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


    forEach(callbackfn: (key: string, value: V, map: StringMap<V>) => any, thisArg?: any): void {
        for (let key in this.obj) {
            if (callbackfn(key, this.obj[key], this) === false) {
                break;
            }
        }
    }

    get(key: string | number): V | undefined {
        return this.obj[key + ""] as any;
    }

    getObject() {
        return this.obj;
    }

    has(key: string | number): boolean {
        return this.obj.hasOwnProperty(key + "");
    }

    setAll(map: StringMap<any>) {
        if (!map) {
            return;
        }
        map.forEach((key, value, map) => {
            this.set(key, value);
        })
    }

    getValues(): Array<V> {
        let result = new Array<V>();
        for (let key in this.obj) {
            result.push(this.obj[key])
        }
        return result;
    }

    getValueAsObject() {
        return $.extend({}, this.obj);
    }

    set(key: string | number, value: V): StringMap<V> {
        this.obj[key + ""] = value;
        return this;
    }

    getSize() {
        let i = 0;
        for (let key in this.obj) {
            i++;
        }
        return i;
    }

    equals(map: StringMap<any> | object) {
        if (!map) {
            return false;
        }
        let dest: StringMap<any>;
        if (!(map instanceof StringMap)) {
            dest = new StringMap(map);
        } else {
            dest = map;
        }
        if (dest.getSize() != this.getSize()) {
            return false;
        }
        let result = true;
        dest.forEach((key, value, map) => {
            if (!this.has(key) || this.get(key) != value) {
                result = false;
                return false;
            }
        })
        return result;
    }
}
