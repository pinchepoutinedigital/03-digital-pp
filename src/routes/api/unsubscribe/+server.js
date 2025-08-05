import { json } from '@sveltejs/kit';

/**
 * @typedef {Object} UnsubscribeRequest
 * @property {string} email - User's email address
 */

/**
 * Handle POST requests for email unsubscriptions
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

		/** @type {UnsubscribeRequest} */
		const { email } = await request.json();

		// Basic validation
		if (!email) {
			return json({
				success: false,
				message: 'Email is required'
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

		// Check if email exists in database
		const existingSubscriber = await platform.env.DB
			.prepare('SELECT id FROM subscribers WHERE email = ?')
			.bind(email)
			.first();

		if (!existingSubscriber) {
			return json({
				success: false,
				message: 'Email address not found in our records'
			}, { status: 404 });
		}

		// Mark subscriber as inactive instead of deleting
		// This preserves the record for analytics and prevents re-subscription issues
		const updateResult = await platform.env.DB
			.prepare('UPDATE subscribers SET active = false WHERE email = ?')
			.bind(email)
			.run();

		if (!updateResult.success) {
			throw new Error('Failed to unsubscribe');
		}

		return json({
			success: true,
			message: 'You have been successfully unsubscribed from all email updates.'
		});

	} catch (error) {
		console.error('Unsubscribe error:', error);
		return json({
			success: false,
			message: 'Failed to process unsubscription'
		}, { status: 500 });
	}
}
