<svelte:head>
    <title>Contact - YourSite</title>
    <meta name="description" content="Get in touch with YourSite. We'd love to hear from you and discuss your project." />
</svelte:head>

<div class="page-header">
    <div class="container">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you and discuss your project</p>
    </div>
</div>

<div class="container">
    <section class="contact-section">
        <div class="contact-content">
            <div class="contact-info">
                <h2>Get in Touch</h2>
                <p>
                    Have a project in mind or just want to say hello? We're here to help bring your 
                    ideas to life. Send us a message and we'll get back to you as soon as possible.
                </p>

                <div class="contact-methods">
                    <div class="contact-method">
                        <div class="method-icon">📧</div>
                        <div class="method-content">
                            <h3>Email Us</h3>
                            <p>info@yoursite.com</p>
                            <small>We typically respond within 24 hours</small>
                        </div>
                    </div>

                    <div class="contact-method">
                        <div class="method-icon">💬</div>
                        <div class="method-content">
                            <h3>Let's Chat</h3>
                            <p>Schedule a consultation</p>
                            <small>Free 30-minute discovery call</small>
                        </div>
                    </div>

                    <div class="contact-method">
                        <div class="method-icon">🚀</div>
                        <div class="method-content">
                            <h3>Start Your Project</h3>
                            <p>Ready to begin?</p>
                            <small>Tell us about your vision</small>
                        </div>
                    </div>
                </div>

                <div class="office-hours">
                    <h3>Office Hours</h3>
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Weekend: By appointment</p>
                    <small>All times in your local timezone</small>
                </div>
            </div>

            <div class="contact-form-container">
                <h2>Send us a Message</h2>
                <ContactForm />
            </div>
        </div>
    </section>

    <section class="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div class="faq-grid">
            <div class="faq-item">
                <h3>How long does a typical project take?</h3>
                <p>Project timelines vary based on complexity, but most websites take 2-6 weeks from start to finish.</p>
            </div>
            <div class="faq-item">
                <h3>Do you provide ongoing support?</h3>
                <p>Yes! We offer maintenance plans and ongoing support to keep your website running smoothly.</p>
            </div>
            <div class="faq-item">
                <h3>What technologies do you use?</h3>
                <p>We work with modern technologies like SvelteKit, React, and deploy on platforms like Cloudflare.</p>
            </div>
            <div class="faq-item">
                <h3>Can you help with existing projects?</h3>
                <p>Absolutely! We can help improve, maintain, or completely redesign your existing website.</p>
            </div>
        </div>
    </section>
</div>

<script>
    import ContactForm from '$lib/components/ContactForm.svelte';
</script>

<style>
    .page-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 4rem 0;
        text-align: center;
    }

    .page-header h1 {
        font-size: 3rem;
        margin-bottom: 1rem;
        font-weight: 700;
    }

    .page-header p {
        font-size: 1.25rem;
        opacity: 0.9;
    }

    .contact-section {
        padding: 4rem 0;
    }

    .contact-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4rem;
        align-items: start;
    }

    .contact-info h2,
    .contact-form-container h2 {
        color: #2c3e50;
        margin-bottom: 1.5rem;
        font-size: 2rem;
    }

    .contact-info p {
        line-height: 1.8;
        color: #555;
        font-size: 1.1rem;
        margin-bottom: 2rem;
    }

    .contact-methods {
        margin: 2rem 0;
    }

    .contact-method {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        margin-bottom: 2rem;
        padding: 1.5rem;
        background: #f8f9fa;
        border-radius: 8px;
        transition: transform 0.3s ease;
    }

    .contact-method:hover {
        transform: translateX(5px);
    }

    .method-icon {
        font-size: 2rem;
        flex-shrink: 0;
    }

    .method-content h3 {
        margin: 0 0 0.5rem 0;
        color: #2c3e50;
        font-size: 1.2rem;
    }

    .method-content p {
        margin: 0 0 0.25rem 0;
        color: #007cba;
        font-weight: 600;
    }

    .method-content small {
        color: #666;
        font-size: 0.9rem;
    }

    .office-hours {
        background: #007cba;
        color: white;
        padding: 2rem;
        border-radius: 8px;
        margin-top: 2rem;
    }

    .office-hours h3 {
        margin: 0 0 1rem 0;
        font-size: 1.3rem;
    }

    .office-hours p {
        margin: 0.5rem 0;
        color: white;
        font-size: 1rem;
    }

    .office-hours small {
        opacity: 0.8;
        font-size: 0.9rem;
    }

    .contact-form-container {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }

    .faq-section {
        padding: 4rem 0;
        background: #f8f9fa;
        margin: 4rem -1rem 0;
        padding-left: 1rem;
        padding-right: 1rem;
    }

    .faq-section h2 {
        text-align: center;
        color: #2c3e50;
        margin-bottom: 3rem;
        font-size: 2rem;
    }

    .faq-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        max-width: 1200px;
        margin: 0 auto;
    }

    .faq-item {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .faq-item h3 {
        color: #2c3e50;
        margin-bottom: 1rem;
        font-size: 1.2rem;
    }

    .faq-item p {
        color: #666;
        line-height: 1.6;
        margin: 0;
    }

    @media (max-width: 768px) {
        .page-header h1 {
            font-size: 2rem;
        }

        .contact-content {
            grid-template-columns: 1fr;
            gap: 2rem;
        }

        .contact-info h2,
        .contact-form-container h2,
        .faq-section h2 {
            font-size: 1.5rem;
        }

        .faq-grid {
            grid-template-columns: 1fr;
        }

        .faq-section {
            margin-left: -1rem;
            margin-right: -1rem;
        }
    }
</style>
