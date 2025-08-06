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
