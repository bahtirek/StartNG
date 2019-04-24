export interface Child {
    name: string;
    inRouter: boolean;
    authentication: boolean;
    id?: number;
    lazy?: boolean;
    home?: boolean;
    active?: boolean;
}
