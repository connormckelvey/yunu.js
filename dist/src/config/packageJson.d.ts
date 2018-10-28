export declare type PackageJsonValues = {
    version?: string;
    author?: string;
    main?: string;
    files?: string[];
    scripts?: {
        [k: string]: string;
    };
};
export declare const packageJson: (values: PackageJsonValues, project?: string) => string;
export declare const defaultValues: PackageJsonValues;
declare const _default: string;
export default _default;
