<script>
	import SubscribeForm from '$lib/components/SubscribeForm.svelte';
</script>

<h1>¡Pinche Poutine! Digital</h1>

<section>
	<h2>Stay Updated</h2>
	<p>Subscribe to our newsletter for the latest updates:</p>
	<SubscribeForm type="newsletter" />
</section>

<section>
	<h2>Event Updates</h2>
	<p>Get notified about upcoming events:</p>
	<SubscribeForm 
		type="events" 
		placeholder="Email for event updates"
		buttonText="Get Event Updates"
	/>
</section>

<svelte:head>
    <title>Home - ¡Pinche Poutine! Digital</title>
    <meta name="description" content="Welcome to YourSite - Building amazing experiences with modern web technologies." />
</svelte:head>

<div class="hero">
    <div class="container">
        <div class="hero-content">
            <h1>¡Pinche Poutine! Digital</h1>
            <p class="hero-subtitle">Building amazing experiences with modern web technologies</p>
            <div class="hero-actions">
                <a href="/services" class="btn">Our Services</a>
                <a href="/contact" class="btn btn-secondary">Get in Touch</a>
            </div>
        </div>
    </div>
</div>

<section class="features">
    <div class="container">
        <h2>What We Offer</h2>
        <div class="features-grid">
            <div class="feature-card">
                <div class="feature-icon">🚀</div>
                <h3>Fast Performance</h3>
                <p>Lightning-fast websites built with modern technologies for optimal user experience.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">📱</div>
                <h3>Responsive Design</h3>
                <p>Websites that look and work perfectly on all devices, from mobile to desktop.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">🔧</div>
                <h3>Custom Solutions</h3>
                <p>Tailored solutions that meet your specific business needs and requirements.</p>
            </div>
        </div>
    </div>
</section>

<section class="newsletter-section">
    <div class="container">
        <div class="newsletter-content">
            <h2>Stay Connected</h2>
            <p>Subscribe to our newsletter and get the latest updates, tips, and insights delivered to your inbox.</p>
            <div class="newsletter-form">
                <SubscribeForm />
            </div>
        </div>
    </div>
</section>

<section class="recent-posts">
    <div class="container">
        <h2>Latest from Our Blog</h2>
        {#if data.recentPosts && data.recentPosts.length > 0}
            <div class="posts-grid">
                {#each data.recentPosts as post}
                    <article class="post-card">
                        <h3><a href="/blog/{post.slug}">{post.title}</a></h3>
                        <p class="post-excerpt">{post.excerpt}</p>
                        <div class="post-meta">
                            <span class="post-date">{new Date(post.date).toLocaleDateString()}</span>
                        </div>
                    </article>
                {/each}
            </div>
            <div class="blog-link">
                <a href="/blog" class="btn">View All Posts</a>
            </div>
        {:else}
            <p>No recent posts available.</p>
        {/if}
    </div>
</section>

<script>
    import SubscribeForm from '$lib/components/SubscribeForm.svelte';
    
    export let data;
</script>

<style>
    .hero {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 6rem 0;
        text-align: center;
    }
    
    .hero-content h1 {
        font-size: 3rem;
        margin-bottom: 1rem;
        font-weight: 700;
    }
    
    .hero-subtitle {
        font-size: 1.25rem;
        margin-bottom: 2rem;
        opacity: 0.9;
    }
    
    .hero-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
    }
    
    .features {
        padding: 4rem 0;
        background: #f8f9fa;
    }
    
    .features h2 {
        text-align: center;
        margin-bottom: 3rem;
        font-size: 2.5rem;
        color: #2c3e50;
    }
    
    .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
    }
    
    .feature-card {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        text-align: center;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .feature-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }
    
    .feature-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
    }
    
    .feature-card h3 {
        margin-bottom: 1rem;
        color: #2c3e50;
    }
    
    .feature-card p {
        color: #666;
        line-height: 1.6;
    }
    
    .newsletter-section {
        padding: 4rem 0;
        background: #007cba;
        color: white;
        text-align: center;
    }
    
    .newsletter-content h2 {
        margin-bottom: 1rem;
        font-size: 2.5rem;
    }
    
    .newsletter-content p {
        margin-bottom: 2rem;
        font-size: 1.1rem;
        opacity: 0.9;
    }
    
    .newsletter-form {
        max-width: 400px;
        margin: 0 auto;
    }
    
    .recent-posts {
        padding: 4rem 0;
    }
    
    .recent-posts h2 {
        text-align: center;
        margin-bottom: 3rem;
        font-size: 2.5rem;
        color: #2c3e50;
    }
    
    .posts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        margin-bottom: 3rem;
    }
    
    .post-card {
        background: white;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .post-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    }
    
    .post-card h3 {
        margin-bottom: 1rem;
    }
    
    .post-card h3 a {
        color: #2c3e50;
        text-decoration: none;
        transition: color 0.3s ease;
    }
    
    .post-card h3 a:hover {
        color: #007cba;
    }
    
    .post-excerpt {
        color: #666;
        line-height: 1.6;
        margin-bottom: 1rem;
    }
    
    .post-meta {
        font-size: 0.9rem;
        color: #888;
    }
    
    .blog-link {
        text-align: center;
    }
    
    @media (max-width: 768px) {
        .hero-content h1 {
            font-size: 2rem;
        }
        
        .hero-actions {
            flex-direction: column;
            align-items: center;
        }
        
        .features h2,
        .newsletter-content h2,
        .recent-posts h2 {
            font-size: 2rem;
        }
    }
</style>
