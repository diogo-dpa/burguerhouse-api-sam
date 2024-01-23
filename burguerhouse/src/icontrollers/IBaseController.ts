import { ControllerOptions } from '../controllers/utilsController';
import { ControllerResponseJsonAPI } from '../utils/jsonapi/typesJsonapi';

export interface IBaseController {
    getAll: (controllerOptions: ControllerOptions) => Promise<ControllerResponseJsonAPI>;
    getById: (controllerOptions: ControllerOptions) => Promise<ControllerResponseJsonAPI>;
    getRelationshipById: (controllerOptions: ControllerOptions) => Promise<ControllerResponseJsonAPI>;
    update: (controllerOptions: ControllerOptions) => Promise<ControllerResponseJsonAPI>;
    create: (controllerOptions: ControllerOptions) => Promise<ControllerResponseJsonAPI>;
    delete: (controllerOptions: ControllerOptions) => Promise<ControllerResponseJsonAPI>;
}
