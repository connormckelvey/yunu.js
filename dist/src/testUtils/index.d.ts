export * from './table';
export declare class TestData {
    parent: string;
    dataDir: string;
    constructor(parent: string, dataDir?: string);
    path(): string;
    files(): {
        [k: string]: TestDataFile;
    };
}
export declare class TestDataFile {
    path: string;
    readonly text: string;
    constructor(path: string);
}
