// src/routes/api/resend-confirmation/+server.js
import { json } from '@sveltejs/kit';
import { sendEmail as sendMailgunEmail, getConfirmationEmailContent } from '$lib/email.js';

export async function POST({ request, platform, url }) {
	try {
		if (!platform?.env) {
			return json({ 
				success: false, 
				message: 'Service temporarily unavailable' 
			}, { status: 500 });
		}

		const { email, type } = await request.json();

		// Validation
		if (!email || !type) {
			return json({
				success: false,
				message: 'Email and type are required'
			}, { status: 400 });
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return json({
				success: false,
				message: 'Invalid email format'
			}, { status: 400 });
		}

		// Find the subscriber
		const subscriber = await platform.env.DB
			.prepare('SELECT id, confirmed FROM subscribers WHERE email = ? AND type = ?')
			.bind(email, type)
			.first();

		if (!subscriber) {
			return json({
				success: false,
				message: 'No subscription found for this email and type'
			}, { status: 404 });
		}

		if (subscriber.confirmed) {
			return json({
				success: false,
				message: 'This subscription is already confirmed'
			}, { status: 400 });
		}

		// Generate new confirmation token
		// Generate confirmation token using Web Crypto API
const tokenArray = new Uint8Array(32);
crypto.getRandomValues(tokenArray);
const confirmationToken = Array.from(tokenArray, byte => byte.toString(16).padStart(2, '0')).join('');
		const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

		// Update the token
		await platform.env.DB
			.prepare('UPDATE subscribers SET confirmation_token = ?, token_expires_at = ? WHERE id = ?')
			.bind(confirmationToken, expiresAt.toISOString(), subscriber.id)
			.run();

		// Create confirmation URL
		const confirmationUrl = `${url.origin}/api/confirm?token=${confirmationToken}`;

		// Send confirmation email
		const emailContent = getConfirmationEmailContent(type, confirmationUrl);
		const emailSent = await sendMailgunEmail({
			to: email,
			...emailContent
		}, platform.env);

		if (!emailSent) {
			console.error('Failed to resend confirmation email to:', email);
			return json({
				success: false,
				message: 'Failed to send confirmation email'
			}, { status: 500 });
		}

		return json({
			success: true,
			message: 'Confirmation email sent! Please check your inbox.'
		});

	} catch (error) {
		console.error('Resend confirmation error:', error);
		return json({
			success: false,
			message: 'Failed to resend confirmation'
		}, { status: 500 });
	}
}
