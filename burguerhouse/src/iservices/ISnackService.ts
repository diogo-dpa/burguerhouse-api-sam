import { SnackUpdateModel } from '../models/snack/SnackUpdateModel';
import { SnackCreateModelWithIngredientIds } from '../models/snack/SnackCreateModelWithIngredientIds';
import { SnackResponseModel } from '../models/snack/SnackResponseModel';

export interface ISnackService {
    createSnack: (newSnack: SnackCreateModelWithIngredientIds) => Promise<SnackResponseModel>;
    updateSnack: (snackId: string, newSnack: SnackUpdateModel) => Promise<SnackResponseModel>;
    getAllSnacks: () => Promise<SnackResponseModel[]>;
    getSnackById: (snackId: string) => Promise<SnackResponseModel>;
    deleteSnackById: (snackId: string) => Promise<void>;
}
