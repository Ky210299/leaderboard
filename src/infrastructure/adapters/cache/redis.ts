import { createClient } from "redis";
import { CachePort } from "../../../domain";

const { REDIS_HOST, REDIS_PORT } = process.env;

if (!REDIS_HOST || !REDIS_PORT) throw new Error("Bad Redis configuration");

const client = createClient({
	url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
});

// Asegurarse de que el cliente esté conectado
(async () => {
	try {
		await client.connect();
		console.log("Connected to Redis");
	} catch (err) {
		console.error("Failed to connect to Redis", err);
		process.exit(1); // Salir si no se puede conectar
	}
})();

export default class RedisCache implements CachePort {
	private readonly DEFAULT_EXPIRATION_TIME = 10 * 1000; // 10 hour
	/**
	 * Guarda un valor en el caché con una clave y opcionalmente un tiempo de expiración.
	 * @param cacheKey - Clave del caché.
	 * @param value - Valor a guardar.
	 * @param exp - Tiempo de expiración en segundos (opcional).
	 */
	public async save(cacheKey: string, value: any, exp = this.DEFAULT_EXPIRATION_TIME) {
		await client.set(cacheKey, JSON.stringify(value, undefined, 2), { EX: exp });
	}

	/**
	 * Obtiene un valor del caché por su clave.
	 * @param cacheKey - Clave del caché.
	 * @returns El valor almacenado, o null si no existe.
	 */
	public async get(cacheKey: string) {
		const value = await client.get(cacheKey);
		if (value == null) return null;
		return JSON.parse(value);
	}
}

export const redis = new RedisCache();
