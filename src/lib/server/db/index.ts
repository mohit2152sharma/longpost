// TODO: disable db stuff as Stripe is not working in india
// import { drizzle } from 'drizzle-orm/postgres-js';
// import postgres from 'postgres';
// import { env } from '$env/dynamic/private';
// import { DEV_ENVS, PROD_ENVS } from '$lib/constants';
//
// export function checkEnvParam(
// 	variableName: string,
// 	raiseError: boolean = true
// ): string | undefined {
// 	const value = env[variableName];
// 	if (!value) {
// 		if (raiseError) {
// 			throw new Error(`${variableName} is not set`);
// 		}
// 		return;
// 	}
// 	return value;
// }
//
// export function getDbConfig(
// 	username?: string,
// 	password?: string,
// 	host?: string,
// 	port?: number,
// 	dbName?: string
// ): {
// 	username: string;
// 	password: string;
// 	host: string;
// 	port: number;
// 	dbName: string;
// } {
// 	const _username = username || (checkEnvParam('DATABASE_USERNAME', true) as string);
// 	const _password = password || (checkEnvParam('DATABASE_PASSWORD', true) as string);
// 	const _host = host || (checkEnvParam('DATABASE_HOST', true) as string);
// 	const _port = port || parseInt(checkEnvParam('DATABASE_PORT', true) as string);
// 	const _dbName = dbName || (checkEnvParam('DATABASE_NAME', true) as string);
// 	return { username: _username, password: _password, host: _host, port: _port, dbName: _dbName };
// }
//
// function getDatabaseUrl(): string {
// 	if (!env.DATABASE_URL) {
// 		const dbConfig = getDbConfig();
// 		databaseUrl = `postgres://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.dbName}`;
// 	} else {
// 		databaseUrl = env.DATABASE_URL;
// 	}
// 	return databaseUrl;
// }
//
// let databaseUrl: string;
// if (env.MY_ENV === 'local') {
// 	databaseUrl = 'postgres://postgres@localhost:5432/longpost';
// } else if (PROD_ENVS.concat(DEV_ENVS).includes(env.MY_ENV)) {
// 	databaseUrl = getDatabaseUrl();
// } else {
// 	throw new Error(`Environment not provided or unknown environment: ${env.MY_ENV}`);
// }
//
// const client = postgres(databaseUrl);
// export const db = drizzle(client);
