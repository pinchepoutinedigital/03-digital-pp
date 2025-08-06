/**
 * @typedef {Object} EmailOptions
 * @property {string} to - Recipient email address
 * @property {string} subject - Email subject line
 * @property {string} text - Plain text content
 * @property {string} [html] - HTML content (optional)
 * @property {string} [from] - Sender email address (optional)
 */

/**
 * @typedef {Object} MailgunEnv
 * @property {string} MAILGUN_API_KEY - Mailgun API key
 * @property {string} MAILGUN_DOMAIN - Mailgun domain
 */

/**
 * Send an email via Mailgun API
 * @param {EmailOptions} options - Email configuration
 * @param {MailgunEnv} env - Environment variables
 * @returns {Promise<boolean>} Success status
 */
export async function sendEmail(options, env) {
	try {
		const formData = new FormData();
		formData.append('from', options.from || `Your Site <noreply@${env.MAILGUN_DOMAIN}>`);
		formData.append('to', options.to);
		formData.append('subject', options.subject);
		formData.append('text', options.text);
		if (options.html) {
			formData.append('html', options.html);
		}

		const response = await fetch(
			`https://api.mailgun.net/v3/${env.MAILGUN_DOMAIN}/messages`,
			{
				method: 'POST',
				headers: {
					'Authorization': `Basic ${btoa(`api:${env.MAILGUN_API_KEY}`)}`
				},
				body: formData
			}
		);

		return response.ok;
	} catch (error) {
		console.error('Email sending failed:', error);
		return false;
	}
}

/**
 * @typedef {Object} EmailContent
 * @property {string} subject - Email subject
 * @property {string} text - Plain text content
 * @property {string} html - HTML content
 */

/**
 * Get welcome email content based on subscription type
 * @param {'newsletter' | 'events'} type - Subscription type
 * @returns {EmailContent} Email content object
 */
export function getWelcomeEmailContent(type) {
	const isEvents = type === 'events';
	
	return {
		subject: isEvents 
			? 'Welcome to Our Events Updates!' 
			: 'Welcome to Our Newsletter!',
		text: isEvents
			? 'Thanks for subscribing to our events updates! You\'ll be the first to know about upcoming events.'
			: 'Thanks for subscribing to our newsletter! Stay tuned for updates.',
		html: isEvents
			? `
				<h1>🎉 Welcome to Our Events!</h1>
				<p>Thanks for subscribing to our events updates!</p>
				<p>You'll be the first to know about:</p>
				<ul>
					<li>Upcoming events</li>
					<li>Early bird tickets</li>
					<li>Exclusive member perks</li>
				</ul>
				<p>Stay tuned!</p>
			`
			: `
				<h1>📧 Welcome to Our Newsletter!</h1>
				<p>Thanks for subscribing to our newsletter!</p>
				<p>You'll receive regular updates about:</p>
				<ul>
					<li>Site updates</li>
					<li>New features</li>
					<li>Important announcements</li>
				</ul>
				<p>Stay tuned!</p>
			`
	};
}

// Add this function to your existing src/lib/email.js file

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
