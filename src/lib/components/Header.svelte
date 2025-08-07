<header class="header">
    <div class="container">
        <nav class="nav">
            <a href="/" class="logo">
                <h1>YourSite</h1>
            </a>
            
            <button class="mobile-toggle" on:click={toggleMobile} aria-label="Toggle navigation">
                <span></span>
                <span></span>
                <span></span>
            </button>
            
            <ul class="nav-links" class:open={mobileOpen}>
                <li><a href="/" on:click={closeMobile}>Home</a></li>
                <li><a href="/about" on:click={closeMobile}>About</a></li>
                <li><a href="/services" on:click={closeMobile}>Services</a></li>
                <li><a href="/blog" on:click={closeMobile}>Blog</a></li>
                <li><a href="/contact" on:click={closeMobile}>Contact</a></li>
            </ul>
        </nav>
    </div>
</header>

<script>
    import { page } from '$app/stores';
    
    let mobileOpen = false;
    
    function toggleMobile() {
        mobileOpen = !mobileOpen;
    }
    
    function closeMobile() {
        mobileOpen = false;
    }
</script>

<style>
    .header {
        background: #fff;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        position: sticky;
        top: 0;
        z-index: 1000;
    }
    
    .nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 0;
    }
    
    .logo h1 {
        margin: 0;
        color: #007cba;
        font-size: 1.8rem;
    }
    
    .logo {
        text-decoration: none;
    }
    
    .nav-links {
        display: flex;
        list-style: none;
        margin: 0;
        padding: 0;
        gap: 2rem;
    }
    
    .nav-links a {
        text-decoration: none;
        color: #333;
        font-weight: 500;
        transition: color 0.3s ease;
    }
    
    .nav-links a:hover {
        color: #007cba;
    }
    
    .mobile-toggle {
        display: none;
        flex-direction: column;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        justify-content: space-around;
    }
    
    .mobile-toggle span {
        width: 100%;
        height: 3px;
        background: #333;
        transition: all 0.3s ease;
    }
    
    @media (max-width: 768px) {
        .mobile-toggle {
            display: flex;
        }
        
        .nav-links {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            flex-direction: column;
            padding: 1rem;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            gap: 1rem;
        }
        
        .nav-links.open {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
        }
        
        .nav-links li {
            text-align: center;
        }
    }
</style>
