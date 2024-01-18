import { SnackUpdateModel } from '../models/snack/SnackUpdateModel';
import { SnackCreateModel } from '../models/snack/SnackCreateModel';
import { SnackResponseModel } from '../models/snack/SnackResponseModel';

export interface ISnackService {
    createSnack: (newSnack: SnackCreateModel) => Promise<SnackResponseModel>;
    updateSnack: (snackId: string, newSnack: SnackUpdateModel) => Promise<SnackResponseModel>;
    getAllSnacks: () => Promise<SnackResponseModel[]>;
    getSnackById: (snackId: string) => Promise<SnackResponseModel>;
    deleteSnackById: (snackId: string) => Promise<void>;
}
