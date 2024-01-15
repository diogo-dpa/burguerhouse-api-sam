import { SnackUpdateModel } from '../models/snack/SnackUpdateModel';
import { SnackCreateModel } from '../models/snack/SnackCreateModel';
import { SnackModel } from '../models/snack/SnackModel';

export interface ISnackService {
    createSnack: (newSnack: SnackCreateModel) => Promise<SnackModel>;
    updateSnack: (newSnack: SnackUpdateModel) => Promise<SnackModel>;
    getAllSnacks: () => Promise<SnackModel[]>;
    getSnackById: (snackId: string) => Promise<SnackModel>;
    deleteSnackById: (snackId: string) => Promise<void>;
}
