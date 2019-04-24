export interface RouteImport {
    name: string;
    index: number;
    lazy: boolean;
    parent: string;
    path: string;
    belongs: boolean;
    proba?: string;
    childRoute?: RouteImport;
}
