<svelte:head>
    <title>About - YourSite</title>
    <meta name="description" content="Learn more about YourSite and our mission to build amazing web experiences." />
</svelte:head>

<div class="page-header">
    <div class="container">
        <h1>About YourSite</h1>
        <p>Building amazing experiences with modern web technologies</p>
    </div>
</div>

<div class="container">
    <section class="about-content">
        <div class="content-section">
            <h2>Our Story</h2>
            <p>
                Founded with a passion for creating exceptional web experiences, YourSite has been at the forefront 
                of modern web development. We believe in the power of clean code, beautiful design, and 
                user-centered thinking to create digital solutions that make a difference.
            </p>
            <p>
                Our journey began with a simple mission: to help businesses and individuals establish a strong 
                online presence through innovative web technologies. Today, we continue to push boundaries and 
                explore new possibilities in the ever-evolving digital landscape.
            </p>
        </div>

        <div class="content-section">
            <h2>Our Mission</h2>
            <p>
                We are committed to delivering high-quality web solutions that not only meet our clients' needs 
                but exceed their expectations. Our approach combines technical expertise with creative vision to 
                build websites and applications that are both functional and beautiful.
            </p>
        </div>

        <div class="values-section">
            <h2>Our Values</h2>
            <div class="values-grid">
                <div class="value-item">
                    <div class="value-icon">💡</div>
                    <h3>Innovation</h3>
                    <p>We stay ahead of the curve by embracing new technologies and methodologies.</p>
                </div>
                <div class="value-item">
                    <div class="value-icon">🎯</div>
                    <h3>Quality</h3>
                    <p>Every project we deliver meets the highest standards of quality and performance.</p>
                </div>
                <div class="value-item">
                    <div class="value-icon">🤝</div>
                    <h3>Collaboration</h3>
                    <p>We work closely with our clients to ensure their vision becomes reality.</p>
                </div>
                <div class="value-item">
                    <div class="value-icon">🌱</div>
                    <h3>Growth</h3>
                    <p>We're committed to continuous learning and helping our clients grow.</p>
                </div>
            </div>
        </div>

        <div class="team-section">
            <h2>Our Team</h2>
            <p>
                Our diverse team of developers, designers, and digital strategists brings together years of 
                experience and a shared passion for creating outstanding web experiences. We believe that 
                great work comes from great people working together towards a common goal.
            </p>
            
            <div class="team-stats">
                <div class="stat-item">
                    <div class="stat-number">100+</div>
                    <div class="stat-label">Projects Completed</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">50+</div>
                    <div class="stat-label">Happy Clients</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">5+</div>
                    <div class="stat-label">Years Experience</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">24/7</div>
                    <div class="stat-label">Support</div>
                </div>
            </div>
        </div>

        <div class="cta-section">
            <h2>Ready to Work Together?</h2>
            <p>Let's discuss how we can help bring your vision to life.</p>
            <a href="/contact" class="btn">Get in Touch</a>
        </div>
    </section>
</div>

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

    .about-content {
        padding: 4rem 0;
    }

    .content-section {
        margin-bottom: 3rem;
    }

    .content-section h2 {
        color: #2c3e50;
        margin-bottom: 1.5rem;
        font-size: 2rem;
    }

    .content-section p {
        line-height: 1.8;
        color: #555;
        font-size: 1.1rem;
        margin-bottom: 1.5rem;
    }

    .values-section {
        margin: 4rem 0;
    }

    .values-section h2 {
        color: #2c3e50;
        margin-bottom: 3rem;
        font-size: 2rem;
        text-align: center;
    }

    .values-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
    }

    .value-item {
        text-align: center;
        padding: 2rem;
        background: #f8f9fa;
        border-radius: 8px;
        transition: transform 0.3s ease;
    }

    .value-item:hover {
        transform: translateY(-5px);
    }

    .value-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
    }

    .value-item h3 {
        color: #2c3e50;
        margin-bottom: 1rem;
        font-size: 1.25rem;
    }

    .value-item p {
        color: #666;
        line-height: 1.6;
    }

    .team-section {
        margin: 4rem 0;
        text-align: center;
    }

    .team-section h2 {
        color: #2c3e50;
        margin-bottom: 1.5rem;
        font-size: 2rem;
    }

    .team-section p {
        line-height: 1.8;
        color: #555;
        font-size: 1.1rem;
        margin-bottom: 3rem;
        max-width: 800px;
        margin-left: auto;
        margin-right: auto;
    }

    .team-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 2rem;
        margin: 3rem 0;
    }

    .stat-item {
        padding: 2rem;
        background: #007cba;
        color: white;
        border-radius: 8px;
    }

    .stat-number {
        font-size: 2.5rem;
        font-weight: bold;
        margin-bottom: 0.5rem;
    }

    .stat-label {
        font-size: 1rem;
        opacity: 0.9;
    }

    .cta-section {
        text-align: center;
        padding: 3rem 0;
        background: #f8f9fa;
        border-radius: 8px;
        margin: 4rem 0;
    }

    .cta-section h2 {
        color: #2c3e50;
        margin-bottom: 1rem;
        font-size: 2rem;
    }

    .cta-section p {
        color: #666;
        font-size: 1.1rem;
        margin-bottom: 2rem;
    }

    @media (max-width: 768px) {
        .page-header h1 {
            font-size: 2rem;
        }

        .content-section h2,
        .values-section h2,
        .team-section h2,
        .cta-section h2 {
            font-size: 1.5rem;
        }

        .team-stats {
            grid-template-columns: repeat(2, 1fr);
        }

        .stat-number {
            font-size: 2rem;
        }
    }
</style>
