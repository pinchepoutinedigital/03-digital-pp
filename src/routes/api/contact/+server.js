import { json } from '@sveltejs/kit';
import { 
    MAILGUN_API_KEY, 
    MAILGUN_DOMAIN, 
    MAILGUN_FROM_EMAIL,
    CONTACT_EMAIL 
} from '$env/static/private';

export async function POST({ request }) {
    try {
        const { name, email, subject, message } = await request.json();
        
        // Basic validation
        if (!name || !email || !subject || !message) {
            return json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return json(
                { error: 'Please enter a valid email address' },
                { status: 400 }
            );
        }
        
        // Prepare email content
        const emailData = {
            from: `${name} via Contact Form <${MAILGUN_FROM_EMAIL}>`,
            to: CONTACT_EMAIL,
            subject: `Contact Form: ${subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333; border-bottom: 2px solid #007cba; padding-bottom: 10px;">
                        New Contact Form Submission
                    </h2>
                    
                    <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
                        <p style="margin: 10px 0;"><strong>Email:</strong> 
                            <a href="mailto:${email}" style="color: #007cba;">${email}</a>
                        </p>
                        <p style="margin: 10px 0;"><strong>Subject:</strong> ${subject}</p>
                    </div>
                    
                    <div style="margin: 20px 0;">
                        <h3 style="color: #333;">Message:</h3>
                        <div style="background: white; padding: 15px; border-left: 4px solid #007cba; margin: 10px 0;">
                            ${message.replace(/\n/g, '<br>')}
                        </div>
                    </div>
                    
                    <div style="font-size: 12px; color: #666; margin-top: 30px; text-align: center;">
                        <p>This message was sent via your website contact form on ${new Date().toLocaleString()}</p>
                    </div>
                </div>
            `,
            text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

Sent on: ${new Date().toLocaleString()}
            `,
            'h:Reply-To': email
        };

        // Send email via Mailgun REST API
        const response = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
            method: 'POST',
            headers: {
                Authorization: `Basic ${btoa(`api:${MAILGUN_API_KEY}`)}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(emailData).toString()
        });

        // Check response
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Mailgun API error: ${errorText}`);
        }

        console.log('Contact form email sent successfully:', {
            name,
            email,
            subject,
            timestamp: new Date().toISOString()
        });
        
        return json({
            message: 'Thank you! Your message has been sent successfully. We\'ll get back to you soon!'
        });
        
    } catch (error) {
        console.error('Mailgun sending failed:', error);
        return json(
            { error: 'Failed to send message. Please try again later.' },
            { status: 500 }
        );
    }
}
