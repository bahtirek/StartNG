import { ChildRoute } from "./childRoute.interface";

export interface RouteForModule {
    name: string;
    id: number;
    children: ChildRoute[]; 
    parent: string;
    parentId: number;
    index: number;
    upName: string;
}
