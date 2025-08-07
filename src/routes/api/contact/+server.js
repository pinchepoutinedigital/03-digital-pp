import { json } from '@sveltejs/kit';
import { 
    MAILGUN_API_KEY, 
    MAILGUN_DOMAIN, 
    MAILGUN_FROM_EMAIL,
    CONTACT_EMAIL 
} from '$env/static/private';

export async function POST({ request, platform }) {
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
        
        // Send email via Mailgun REST API directly
        const formData = new FormData();
        formData.append('from', `${name} via Contact Form <${MAILGUN_FROM_EMAIL}>`);
        formData.append('to', CONTACT_EMAIL);
        formData.append('subject', `Contact Form: ${subject}`);
        formData.append('html', `
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
        `);
        formData.append('text', `
New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

Sent on: ${new Date().toLocaleString()}
        `);
        formData.append('h:Reply-To', email);

        // Make direct API call to Mailgun
        const mailgunResponse = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${btoa(`api:${MAILGUN_API_KEY}`)}`
            },
            body: formData
        });

        if (!mailgunResponse.ok) {
            const errorText = await mailgunResponse.text();
            console.error('Mailgun API error:', errorText);
            throw new Error('Failed to send email via Mailgun');
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
