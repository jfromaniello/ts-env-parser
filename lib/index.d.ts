import "reflect-metadata";
export declare function setting({ parser, required }?: {
    parser?: (input: string) => any;
    required?: boolean;
}): (target: any, key: string) => void;
export declare class EnvironmentBase {
    constructor(input?: {
        [key: string]: any;
    });
    validate(): this;
}
