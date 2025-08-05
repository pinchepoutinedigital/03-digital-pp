import { json } from '@sveltejs/kit';

/**
 * Simple admin authentication check
 * In production, implement proper authentication
 * @param {Request} request - The request object
 * @returns {boolean} Whether the request is authorized
 */
function isAuthorized(request) {
	// Simple API key check - replace with proper auth in production
	const apiKey = request.headers.get('Authorization');
	const expectedKey = 'Bearer your-admin-api-key'; // Set this as an environment variable
	
	// For now, just return true for demo purposes
	// In production: return apiKey === expectedKey;
	return true;
}

/**
 * Handle GET requests to fetch all subscribers (admin only)
 * @param {Object} params - SvelteKit request parameters
 * @param {Request} params.request - The request object
 * @param {Object} params.platform - Cloudflare platform object
 * @returns {Promise<Response>} JSON response with subscribers
 */
export async function GET({ request, platform }) {
	try {
		// Basic auth check (implement proper auth in production)
		if (!isAuthorized(request)) {
			return json({
				error: 'Unauthorized'
			}, { status: 401 });
		}

		// Ensure we have the platform environment
		if (!platform?.env) {
			return json({ 
				error: 'Service temporarily unavailable' 
			}, { status: 500 });
		}

		// Fetch all subscribers with their details
		const subscribers = await platform.env.DB
			.prepare(`
				SELECT id, email, type, created_at, active 
				FROM subscribers 
				ORDER BY created_at DESC
			`)
			.all();

		return json({
			subscribers: subscribers.results || []
		});

	} catch (error) {
		console.error('Admin subscribers fetch error:', error);
		return json({
			error: 'Failed to fetch subscribers'
		}, { status: 500 });
	}
}

/**
 * Handle POST requests for admin actions (bulk operations, etc.)
 * @param {Object} params - SvelteKit request parameters
 * @param {Request} params.request - The request object
 * @param {Object} params.platform - Cloudflare platform object
 * @returns {Promise<Response>} JSON response
 */
export async function POST({ request, platform }) {
	try {
		if (!isAuthorized(request)) {
			return json({
				error: 'Unauthorized'
			}, { status: 401 });
		}

		if (!platform?.env) {
			return json({ 
				error: 'Service temporarily unavailable' 
			}, { status: 500 });
		}

		/** @type {{action: string, data: any}} */
		const { action, data } = await request.json();

		switch (action) {
			case 'export_csv': {
				// Export subscribers as CSV
				const subscribers = await platform.env.DB
					.prepare('SELECT email, type, created_at, active FROM subscribers ORDER BY created_at DESC')
					.all();

				const csvHeaders = 'Email,Type,Created At,Active\n';
				const csvRows = subscribers.results.map(sub => 
					`${sub.email},${sub.type},${sub.created_at},${sub.active}`
				).join('\n');

				return new Response(csvHeaders + csvRows, {
					headers: {
						'Content-Type': 'text/csv',
						'Content-Disposition': 'attachment; filename="subscribers.csv"'
					}
				});
			}

			case 'bulk_unsubscribe': {
				// Bulk unsubscribe emails
				/** @type {string[]} */
				const emails = data.emails;
				
				if (!Array.isArray(emails) || emails.length === 0) {
					return json({ error: 'Invalid email list' }, { status: 400 });
				}

				const placeholders = emails.map(() => '?').join(',');
				const result = await platform.env.DB
					.prepare(`UPDATE subscribers SET active = false WHERE email IN (${placeholders})`)
					.bind(...emails)
					.run();

				return json({
					success: true,
					message: `Unsubscribed ${result.changes} subscribers`
				});
			}

			default:
				return json({ error: 'Unknown action' }, { status: 400 });
		}

	} catch (error) {
		console.error('Admin action error:', error);
		return json({
			error: 'Failed to process admin action'
		}, { status: 500 });
	}
}
