declare module 'universal-cookie' {
    declare type GetOptions = {
        doNotParse: boolean,
    }
    declare type SetOptions = {
        path?: string,
        expires?: Date,
        maxAge?: number,
        domain?: string,
        secure?: bool,
        httpOnly?: bool,
    }
    declare class Cookies {
        constructor(cookies?: any, hooks?: Object): Cookies;
        get(name: string, options?: GetOptions): any;
        getAll(options?: GetOptions): {[key: string]: any};
        set(name: string, value: any, options?: SetOptions): void;
        remove(name: string, options?: SetOptions): void;
    }
    declare module.exports: typeof Cookies;
}
