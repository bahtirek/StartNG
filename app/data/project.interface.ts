import { PhoneFormat } from './phone-format.interface';
import { RouteForModule } from './routeForModule.interface';
import { Comp } from './comp.interface';

export interface Project {
    name: string;
    scss: boolean;
    components: Comp[];
    login: boolean;
    pid: string;
    email: string;
    uid: string;
    editName?: boolean;
    home?: boolean;
    routing?: any[];
    routes?: RouteForModule[];
    ids?: number;
    formsUI?: string;
    formsMUI?: string;
    phoneFormat?: string;
    phone?: PhoneFormat;
}
