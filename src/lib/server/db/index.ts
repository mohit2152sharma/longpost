import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '$env/dynamic/private';

export function checkEnvParam(
	variableName: string,
	raiseError: boolean = true
): string | undefined {
	const value = env[variableName];
	if (!value) {
		if (raiseError) {
			throw new Error(`${variableName} is not set`);
		}
		return;
	}
	return value;
}

export function getDbConfig(
	username?: string,
	password?: string,
	host?: string,
	port?: number,
	dbName?: string
): {
	username: string;
	password: string;
	host: string;
	port: number;
	dbName: string;
} {
	const _usrename = username || (checkEnvParam('DATABASE_USERNAME', true) as string);
	const _password = password || (checkEnvParam('DATABASE_PASSWORD', true) as string);
	const _host = host || (checkEnvParam('DATABASE_HOST', true) as string);
	const _port = port || 5432;
	const _dbName = dbName || 'longpost';
	return { username: _usrename, password: _password, host: _host, port: _port, dbName: _dbName };
}

let database_url: string;
if (env.MY_ENV === 'development' || env.MY_ENV === 'test') {
	database_url = 'postgres://postgres@localhost:5432/longpost';
} else {
	if (!env.DATABASE_URL) {
		const dbConfig = getDbConfig();
		database_url = `postgres://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.dbName}`;
	}
	database_url = env.DATABASE_URL;
}
const client = postgres(database_url);
export const db = drizzle(client);
