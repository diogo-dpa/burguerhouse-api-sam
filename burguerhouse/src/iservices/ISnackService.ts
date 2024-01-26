import { SnackUpdateModel } from '../models/snack/SnackUpdateModel';
import { SnackCreateModel } from '../models/snack/SnackCreateModel';
import { SnackResponseModel } from '../models/snack/SnackResponseModel';
import { JsonAPIQueryOptions } from '../utils/jsonapi/typesJsonapi';

export interface ISnackService {
    createSnack: (newSnack: SnackCreateModel) => Promise<SnackResponseModel>;
    updateSnack: (snackId: string, newSnack: SnackUpdateModel) => Promise<SnackResponseModel>;
    getAllSnacks: (queryOptions?: JsonAPIQueryOptions) => Promise<SnackResponseModel[]>;
    getSnackById: (snackId: string, queryOptions?: JsonAPIQueryOptions) => Promise<SnackResponseModel>;
    deleteSnackById: (snackId: string) => Promise<void>;
}
