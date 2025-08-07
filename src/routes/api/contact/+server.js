import { json } from '@sveltejs/kit';
import { sendEmail } from '$lib/email.js';

export async function POST({ request, platform }) {
    try {
        const { name, email, subject, message } = await request.json();

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return json(
                { error: 'Please provide a valid email address' },
                { status: 400 }
            );
        }

        // Prepare email content
        const emailContent = `
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
        `.trim();

        // Send email using your existing email utility
        const result = await sendEmail({
            to: platform?.env?.CONTACT_EMAIL || 'info@yoursite.com', // Your contact email
            from: platform?.env?.MAILGUN_FROM_EMAIL || 'noreply@yoursite.com',
            subject: `Contact Form: ${subject}`,
            text: emailContent,
            html: `
                <h3>New Contact Form Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <h4>Message:</h4>
                <p>${message.replace(/\n/g, '<br>')}</p>
            `
        }, platform);

        if (result.success) {
            // Optionally send auto-reply to the user
            try {
                await sendEmail({
                    to: email,
                    from: platform?.env?.MAILGUN_FROM_EMAIL || 'noreply@yoursite.com',
                    subject: 'Thank you for contacting us',
                    text: `Hi ${name},\n\nThank you for your message. We have received your inquiry about "${subject}" and will get back to you as soon as possible.\n\nBest regards,\nYourSite Team`,
                    html: `
                        <h3>Thank you for contacting us</h3>
                        <p>Hi ${name},</p>
                        <p>Thank you for your message. We have received your inquiry about "${subject}" and will get back to you as soon as possible.</p>
                        <p>Best regards,<br>YourSite Team</p>
                    `
                }, platform);
            } catch (autoReplyError) {
                console.error('Auto-reply failed:', autoReplyError);
                // Don't fail the main request if auto-reply fails
            }

            return json({
                success: true,
                message: 'Thank you! Your message has been sent successfully.'
            });
        } else {
            console.error('Email send failed:', result.error);
            return json(
                { error: 'Failed to send message. Please try again later.' },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Contact form error:', error);
        return json(
            { error: 'An error occurred. Please try again later.' },
            { status: 500 }
        );
    }
}
