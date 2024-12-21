import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: {
		env: { MY_ENV: 'test', STRIPE_SECRET_KEY: 'sk_test', STRIPE_WEBHOOK_SECRET: 'whsec_test' },
		command: 'npm run build && npm run preview',
		port: 4173
	},
	reporter: 'html',
	testDir: 'e2e',
});
