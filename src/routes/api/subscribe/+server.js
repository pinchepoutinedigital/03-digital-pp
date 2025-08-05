import { json } from '@sveltejs/kit';
import { sendEmail as sendMailgunEmail, getWelcomeEmailContent } from '$lib/email.js';

/**
 * @typedef {Object} SubscribeRequest
 * @property {string} email - User's email address
 * @property {'newsletter' | 'events'} type - Subscription type
 */

/**
 * Handle POST requests for email subscriptions
 * @param {Object} params - SvelteKit request parameters
 * @param {Request} params.request - The request object
 * @param {Object} params.platform - Cloudflare platform object
 * @returns {Promise<Response>} JSON response
 */
export async function POST({ request, platform }) {
	try {
		// Ensure we have the platform environment
		if (!platform?.env) {
			return json({ 
				success: false, 
				message: 'Service temporarily unavailable' 
			}, { status: 500 });
		}

		/** @type {SubscribeRequest} */
		const { email, type } = await request.json();

		// Basic validation
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

		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return json({
				success: false,
				message: 'Invalid email format'
			}, { status: 400 });
		}

		// Check if email already exists
		const existingSubscriber = await platform.env.DB
			.prepare('SELECT id, type FROM subscribers WHERE email = ? AND active = true')
			.bind(email)
			.first();

		if (existingSubscriber) {
			return json({
				success: false,
				message: 'Email already subscribed to this list'
			}, { status: 409 });
		}

		// Insert new subscriber
		const insertResult = await platform.env.DB
			.prepare('INSERT INTO subscribers (email, type, created_at) VALUES (?, ?, ?)')
			.bind(email, type, new Date().toISOString())
			.run();

		if (!insertResult.success) {
			throw new Error('Failed to save subscription');
		}

		// Send welcome email
		const emailContent = getWelcomeEmailContent(type);
		const emailSent = await sendMailgunEmail({
			to: email,
			...emailContent
		}, platform.env);

		if (!emailSent) {
			console.error('Failed to send welcome email to:', email);
			// Don't fail the subscription if email fails
		}

		return json({
			success: true,
			message: `Successfully subscribed to ${type}!`
		});

	} catch (error) {
		console.error('Subscription error:', error);
		return json({
			success: false,
			message: 'Failed to process subscription'
		}, { status: 500 });
	}
}
