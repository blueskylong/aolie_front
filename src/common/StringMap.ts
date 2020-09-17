export class StringMap<V> {
    private obj = {};

    constructor(obj?: any) {
        this.obj = {};
        if (obj) {
            for (let attr in obj) {
                this.obj[attr] = obj[attr];
            }
        }
    }


    clear(): void {
        this.obj = {};
    }

    delete(key: string): boolean {
        let result = this.obj.hasOwnProperty(key);
        delete this.obj[key];
        return result;
    }


    forEach(callbackfn: (value: V, key: string, map: StringMap<V>) => void, thisArg?: any): void {
        for (let key in this.obj) {
            callbackfn(this.obj[key], key, this);
        }
    }

    get(key: string): V | undefined {
        return this.obj[key as any] as any;
    }

    has(key: string): boolean {
        return this.obj.hasOwnProperty(key);
    }

    set(key: string, value: V): StringMap<V> {
        this.obj[key] = value;
        return this;
    }

    getSize() {
        let i = 0;
        for (let key in this.obj) {
            i++;
        }
        return i;
    }
}
