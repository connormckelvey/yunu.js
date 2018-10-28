export declare type WalkUpdater = <T = any>(key: any, value: T, parent?: any) => T;
export declare function walk(subject: any, updater: WalkUpdater): any;
