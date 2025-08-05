// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env: {
				DB: D1Database;
				MAILGUN_API_KEY: string;
				MAILGUN_DOMAIN: string;
			};
			context: ExecutionContext;
			caches: CacheStorage;
		}
	}
}

export {};
