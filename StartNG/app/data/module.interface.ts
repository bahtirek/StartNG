export interface Module {
    name: string;
    declarations?: string;
    imports?: string;
    moduleImports?: string;
    providers?: string;
    index?: number;
    importsForRoutingFile?: string;
}
