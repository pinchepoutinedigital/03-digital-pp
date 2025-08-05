<script>
	import { onMount } from 'svelte';

	/**
	 * @typedef {Object} Subscriber
	 * @property {number} id - Subscriber ID
	 * @property {string} email - Email address
	 * @property {string} type - Subscription type
	 * @property {string} created_at - Creation date
	 * @property {boolean} active - Active status
	 */

	/** @type {Subscriber[]} */
	let subscribers = [];
	
	/** @type {boolean} */
	let loading = true;
	
	/** @type {string} */
	let error = '';

	/** @type {string} */
	let filter = 'all'; // 'all', 'newsletter', 'events', 'inactive'

	onMount(async () => {
		await loadSubscribers();
	});

	/**
	 * Load subscribers from API
	 * @returns {Promise<void>}
	 */
	async function loadSubscribers() {
		try {
			loading = true;
			const response = await fetch('/api/admin/subscribers');
			
			if (!response.ok) {
				throw new Error('Failed to load subscribers');
			}

			/** @type {{subscribers: Subscriber[]}} */
			const data = await response.json();
			subscribers = data.subscribers;
		} catch (err) {
			error = 'Failed to load subscribers';
			console.error(err);
		} finally {
			loading = false;
		}
	}

	/**
	 * Get filtered subscribers based on current filter
	 * @param {Subscriber[]} subs - All subscribers
	 * @param {string} filterType - Filter type
	 * @returns {Subscriber[]} Filtered subscribers
	 */
	function getFilteredSubscribers(subs, filterType) {
		switch (filterType) {
			case 'newsletter':
				return subs.filter(s => s.type === 'newsletter' && s.active);
			case 'events':
				return subs.filter(s => s.type === 'events' && s.active);
			case 'inactive':
				return subs.filter(s => !s.active);
			default:
				return subs.filter(s => s.active);
		}
	}

	/**
	 * Format date for display
	 * @param {string} dateString - ISO date string
	 * @returns {string} Formatted date
	 */
	function formatDate(dateString) {
		return new Date(dateString).toLocaleDateString();
	}

	// Reactive filtered subscribers
	$: filteredSubscribers = getFilteredSubscribers(subscribers, filter);
	$: stats = {
		total: subscribers.filter(s => s.active).length,
		newsletter: subscribers.filter(s => s.type === 'newsletter' && s.active).length,
		events: subscribers.filter(s => s.type === 'events' && s.active).length,
		inactive: subscribers.filter(s => !s.active).length
	};
</script>

<svelte:head>
	<title>Subscribers Admin - Your Site</title>
</svelte:head>

<div class="admin-dashboard">
	<h1>Subscribers Dashboard</h1>

	<!-- Stats Cards -->
	<div class="stats-grid">
		<div class="stat-card">
			<h3>Total Active</h3>
			<p class="stat-number">{stats.total}</p>
		</div>
		<div class="stat-card">
			<h3>Newsletter</h3>
			<p class="stat-number">{stats.newsletter}</p>
		</div>
		<div class="stat-card">
			<h3>Events</h3>
			<p class="stat-number">{stats.events}</p>
		</div>
		<div class="stat-card">
			<h3>Inactive</h3>
			<p class="stat-number">{stats.inactive}</p>
		</div>
	</div>

	<!-- Filter Controls -->
	<div class="controls">
		<select bind:value={filter} class="filter-select">
			<option value="all">All Active</option>
			<option value="newsletter">Newsletter Only</option>
			<option value="events">Events Only</option>
			<option value="inactive">Inactive</option>
		</select>
		
		<button on:click={loadSubscribers} class="refresh-button" disabled={loading}>
			{loading ? 'Loading...' : 'Refresh'}
		</button>
	</div>

	<!-- Subscribers Table -->
	{#if loading}
		<div class="loading">Loading subscribers...</div>
	{:else if error}
		<div class="error">{error}</div>
	{:else if filteredSubscribers.length === 0}
		<div class="empty">No subscribers found for the selected filter.</div>
	{:else}
		<div class="table-container">
			<table class="subscribers-table">
				<thead>
					<tr>
						<th>Email</th>
						<th>Type</th>
						<th>Subscribed</th>
						<th>Status</th>
					</tr>
				</thead>
				<tbody>
					{#each filteredSubscribers as subscriber (subscriber.id)}
						<tr>
							<td>{subscriber.email}</td>
							<td>
								<span class="type-badge type-{subscriber.type}">
									{subscriber.type}
								</span>
							</td>
							<td>{formatDate(subscriber.created_at)}</td>
							<td>
								<span class="status-badge status-{subscriber.active ? 'active' : 'inactive'}">
									{subscriber.active ? 'Active' : 'Inactive'}
								</span>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>

<style>
	.admin-dashboard {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
		margin: 2rem 0;
	}

	.stat-card {
		background: white;
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
		padding: 1.5rem;
		text-align: center;
	}

	.stat-card h3 {
		margin: 0 0 0.5rem 0;
		color: #6b7280;
		font-size: 0.875rem;
		text-transform: uppercase;
		font-weight: 600;
	}

	.stat-number {
		margin: 0;
		font-size: 2rem;
		font-weight: bold;
		color: #1f2937;
	}

	.controls {
		display: flex;
		gap: 1rem;
		margin: 2rem 0;
		align-items: center;
	}

	.filter-select {
		padding: 0.5rem;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		background: white;
	}

	.refresh-button {
		padding: 0.5rem 1rem;
		background-color: #3b82f6;
		color: white;
		border: none;
		border-radius: 0.375rem;
		cursor: pointer;
	}

	.refresh-button:hover:not(:disabled) {
		background-color: #2563eb;
	}

	.refresh-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.table-container {
		overflow-x: auto;
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
	}

	.subscribers-table {
		width: 100%;
		border-collapse: collapse;
		background: white;
	}

	.subscribers-table th,
	.subscribers-table td {
		padding: 0.75rem;
		text-align: left;
		border-bottom: 1px solid #e5e7eb;
	}

	.subscribers-table th {
		background-color: #f9fafb;
		font-weight: 600;
		color: #374151;
	}

	.type-badge {
		padding: 0.25rem 0.5rem;
		border-radius: 0.375rem;
		font-size: 0.75rem;
		font-weight: 500;
		text-transform: capitalize;
	}

	.type-newsletter {
		background-color: #dbeafe;
		color: #1e40af;
	}

	.type-events {
		background-color: #fef3c7;
		color: #92400e;
	}

	.status-badge {
		padding: 0.25rem 0.5rem;
		border-radius: 0.375rem;
		font-size: 0.75rem;
		font-weight: 500;
	}

	.status-active {
		background-color: #d1fae5;
		color: #065f46;
	}

	.status-inactive {
		background-color: #fee2e2;
		color: #991b1b;
	}

	.loading, .error, .empty {
		text-align: center;
		padding: 2rem;
		color: #6b7280;
	}

	.error {
		color: #dc2626;
	}
</style>
