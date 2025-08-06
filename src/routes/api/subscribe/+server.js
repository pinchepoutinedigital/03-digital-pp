// src/routes/api/subscribe/+server.js
import { json } from '@sveltejs/kit';
import { sendEmail as sendMailgunEmail, getConfirmationEmailContent } from '$lib/email.js';
import crypto from 'crypto';

export async function POST({ request, platform, url }) {
	try {
		if (!platform?.env) {
			return json({ 
				success: false, 
				message: 'Service temporarily unavailable' 
			}, { status: 500 });
		}

		const { email, type } = await request.json();

		// Validation (same as before)
		if (!email || !type) {
			return json({
				success: false,
				message: 'Email and type are required'
			}, { status: 400 });
		}

		if (!['newsletter', 'events'].includes(type)) {
			return json({
				success: false,
				message: 'Invalid subscription type'
			}, { status: 400 });
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return json({
				success: false,
				message: 'Invalid email format'
			}, { status: 400 });
		}

		// Check if email already exists and is confirmed
		const existingSubscriber = await platform.env.DB
			.prepare('SELECT id, confirmed FROM subscribers WHERE email = ? AND type = ?')
			.bind(email, type)
			.first();

		if (existingSubscriber?.confirmed) {
			return json({
				success: false,
				message: `Email already subscribed to ${type}`
			}, { status: 409 });
		}

		// Generate confirmation token
		const confirmationToken = crypto.randomBytes(32).toString('hex');
		const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

		// If user exists but not confirmed, update their token
		if (existingSubscriber) {
			await platform.env.DB
				.prepare('UPDATE subscribers SET confirmation_token = ?, token_expires_at = ? WHERE id = ?')
				.bind(confirmationToken, expiresAt.toISOString(), existingSubscriber.id)
				.run();
		} else {
			// Insert new unconfirmed subscriber
			await platform.env.DB
				.prepare(`
					INSERT INTO subscribers (email, type, confirmation_token, token_expires_at, confirmed, created_at) 
					VALUES (?, ?, ?, ?, false, ?)
				`)
				.bind(email, type, confirmationToken, expiresAt.toISOString(), new Date().toISOString())
				.run();
		}

		// Create confirmation URL
		const confirmationUrl = `${url.origin}/api/confirm?token=${confirmationToken}`;

		// Send confirmation email
		const emailContent = getConfirmationEmailContent(type, confirmationUrl);
		const emailSent = await sendMailgunEmail({
			to: email,
			...emailContent
		}, platform.env);

		if (!emailSent) {
			console.error('Failed to send confirmation email to:', email);
			return json({
				success: false,
				message: 'Failed to send confirmation email'
			}, { status: 500 });
		}

		return json({
			success: true,
			message: 'Please check your email to confirm your subscription!'
		});

	} catch (error) {
		console.error('Subscription error:', error);
		return json({
			success: false,
			message: 'Failed to process subscription'
		}, { status: 500 });
	}
}

// src/routes/api/confirm/+server.js
import { json, redirect } from '@sveltejs/kit';
import { sendEmail as sendMailgunEmail, getWelcomeEmailContent } from '$lib/email.js';

export async function GET({ url, platform }) {
	try {
		const token = url.searchParams.get('token');
		
		if (!token) {
			return new Response('Invalid confirmation link', { status: 400 });
		}

		if (!platform?.env) {
			return new Response('Service temporarily unavailable', { status: 500 });
		}

		// Find subscriber by token
		const subscriber = await platform.env.DB
			.prepare(`
				SELECT id, email, type, token_expires_at, confirmed 
				FROM subscribers 
				WHERE confirmation_token = ?
			`)
			.bind(token)
			.first();

		if (!subscriber) {
			return new Response('Invalid or expired confirmation link', { status: 400 });
		}

		if (subscriber.confirmed) {
			// Already confirmed, redirect to success page
			throw redirect(302, '/confirmation-success?already=true');
		}

		// Check if token is expired
		const now = new Date();
		const expiresAt = new Date(subscriber.token_expires_at);
		
		if (now > expiresAt) {
			return new Response('Confirmation link has expired', { status: 400 });
		}

		// Confirm the subscription
		await platform.env.DB
			.prepare(`
				UPDATE subscribers 
				SET confirmed = true, confirmed_at = ?, confirmation_token = null, token_expires_at = null
				WHERE id = ?
			`)
			.bind(new Date().toISOString(), subscriber.id)
			.run();

		// Send welcome email
		const emailContent = getWelcomeEmailContent(subscriber.type);
		await sendMailgunEmail({
			to: subscriber.email,
			...emailContent
		}, platform.env);

		// Redirect to success page
		throw redirect(302, '/confirmation-success');

	} catch (error) {
		if (error.status === 302) {
			// Re-throw redirects
			throw error;
		}
		
		console.error('Confirmation error:', error);
		return new Response('Failed to confirm subscription', { status: 500 });
	}
}

// src/lib/email.js - Add confirmation email function
export function getConfirmationEmailContent(type, confirmationUrl) {
	const typeText = type === 'newsletter' ? 'Newsletter' : 'Events';
	
	return {
		subject: `Confirm Your ${typeText} Subscription`,
		html: `
			<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
				<h2>Confirm Your Subscription</h2>
				<p>Thank you for subscribing to our ${typeText.toLowerCase()}!</p>
				<p>Please click the button below to confirm your subscription:</p>
				<div style="text-align: center; margin: 30px 0;">
					<a href="${confirmationUrl}" 
						 style="background-color: #007cba; color: white; padding: 15px 30px; 
										text-decoration: none; border-radius: 5px; display: inline-block;">
						Confirm Subscription
					</a>
				</div>
				<p>Or copy and paste this link into your browser:</p>
				<p><a href="${confirmationUrl}">${confirmationUrl}</a></p>
				<p><small>This link will expire in 24 hours.</small></p>
			</div>
		`,
		text: `
Thank you for subscribing to our ${typeText.toLowerCase()}!

Please confirm your subscription by visiting this link:
${confirmationUrl}

This link will expire in 24 hours.
		`
	};
}

// Database migration - Add these columns to your subscribers table
/*
ALTER TABLE subscribers ADD COLUMN confirmation_token TEXT;
ALTER TABLE subscribers ADD COLUMN token_expires_at TEXT;
ALTER TABLE subscribers ADD COLUMN confirmed BOOLEAN DEFAULT false;
ALTER TABLE subscribers ADD COLUMN confirmed_at TEXT;
*/
