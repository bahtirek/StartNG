
import { Child } from './child.interface';
import { FormsData } from './forms.interface';

export interface Comp {
    name?: string;
    authentication?: boolean;
    siblingInteraction?:  string[];
    children?: Child[];
    path?: string;
    router?: boolean;
    parentModule?: string;
    inRouter?: boolean;
    parentAuth?: boolean;
    folder?: boolean;
    component?: boolean;
    module?: boolean;
    routingModule?:boolean;
    lazyLoading?: boolean;
    folderPath?: string;
    childAuthentication?: boolean;
    parent?: string;
    altParent?: string;
    routes?: string;
    htmlChildren?: string;
    links?: string;
    declarations?: string;
    imports?: string;
    moduleImports?: string;
    importsForRoutingFile?: string;
    ngModuleImports?: string;
    upName?: string;
    authGuardImport?: boolean;
    beforeLazy?: boolean;
    parentIndex?: number;
    moduleIndex?: number;
    isParentFolder?: boolean;
    altPath?: string;
    index?: number;
    isDefaultComponent?: boolean;
    defaultComponentId?: number;
    defaultComponent?: string;
    exports?: string;
    id?: number;
    pathArray?: number[];
    parentId?: number;
    altParentId?: number;
    parentModuleId?: number;
    parentFolder?: string;
    parentFolderId?: number;
    forms?: FormsData[];
    ts?: string;
    html?: string;
    reactiveFormsModule?: boolean;
    formBuilder?: boolean;
    phoneFormat?: boolean;
    phoneFormatDirective?: boolean;
}

