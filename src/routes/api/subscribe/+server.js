// src/routes/api/subscribe/+server.js
import { json } from '@sveltejs/kit';
import { sendEmail as sendMailgunEmail, getConfirmationEmailContent } from '$lib/email.js';
// Remove the crypto import, we'll use Web Crypto API
//import crypto from 'crypto';

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


		// Add this right before the database query
console.log(`Checking for: email="${email}", type="${type}"`);

// Check if email already exists for this specific type
const existingSubscriber = await platform.env.DB
    .prepare('SELECT id, confirmed, type FROM subscribers WHERE email = ? AND type = ?')
    .bind(email, type)
    .first();

console.log('Query result:', existingSubscriber);
console.log('Email exists for this type:', !!existingSubscriber);
console.log('Is confirmed:', existingSubscriber?.confirmed);

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
		//const confirmationToken = crypto.randomBytes(32).toString('hex');
		// Generate confirmation token using Web Crypto API
const tokenArray = new Uint8Array(32);
crypto.getRandomValues(tokenArray);
const confirmationToken = Array.from(tokenArray, byte => byte.toString(16).padStart(2, '0')).join('');
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


