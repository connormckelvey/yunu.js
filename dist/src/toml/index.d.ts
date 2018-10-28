import * as utils from '../utils/index';
export declare type Reviver = utils.WalkUpdater;
export declare type Replacer = utils.WalkUpdater;
export declare function load<T>(str: string, reviver?: Reviver): T;
export declare function loadFile<T>(path: string, reviver?: Reviver): T;
export declare function dump(data: any, replacer?: Replacer): string;
export declare function dumpFile(path: string, data: any, replacer?: Replacer): void;
