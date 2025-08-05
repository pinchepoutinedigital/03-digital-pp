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
