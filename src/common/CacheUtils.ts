import {StringMap} from "./StringMap";

/**
 * 用于缓存
 */
export class CacheUtils {
    private static cache: StringMap<StringMap<any>> = new StringMap<any>();

    /**
     * 清空缓存
     */
    static clearCache() {
        CacheUtils.cache = new StringMap<any>();
    }

    /**
     * 取得缓存
     * @param type
     * @param key
     * @param obj
     */
    static get(type, key): any {
        let typeCache = CacheUtils.cache.get(type);
        if (!typeCache) {
            return null;
        }
        return CacheUtils.cache.get(key);
    }

    /**
     * 增加缓存
     * @param type
     * @param key
     * @param obj
     */
    static put(type, key, obj) {
        let typeCache = CacheUtils.cache.get(type);
        if (!typeCache) {
            typeCache = new StringMap<any>();
            CacheUtils.cache.set(type, typeCache);
        }
        typeCache.set(key, obj);
    }

    /**
     * 如果不存在,增加缓存
     * @param type
     * @param key
     * @param obj
     */
    static putIfAbsent(type, key, obj) {
        let typeCache = CacheUtils.cache.get(type);
        if (!typeCache) {
            typeCache = new StringMap<any>();
            CacheUtils.cache.set(type, typeCache);
            typeCache.set(key, obj);
            return;
        }
        if (typeCache.has(key)) {
            return;
        } else
            typeCache.set(key, obj);
    }

    /**
     * 删除缓存
     * @param type
     * @param key
     */
    static removeCache(type, key?) {
        if (key) {
            let typeCache = CacheUtils.cache.get(type);
            if (!typeCache) {
                return;
            }
            return typeCache.delete(key);
        } else {
            return CacheUtils.cache.delete(type);
        }
    }
}
