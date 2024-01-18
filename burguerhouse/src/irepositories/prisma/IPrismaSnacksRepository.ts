import { SnackCreateModel } from '../../models/snack/SnackCreateModel';
import { SnackPrismaModel } from '../../models/snack/SnackPrismaModel';
import { SnackUpdateModel } from '../../models/snack/SnackUpdateModel';

export interface IPrismaSnacksRepository {
    getAll: () => Promise<SnackPrismaModel[]>;
    getById: (id: string) => Promise<SnackPrismaModel | null>;
    update: (id: string, updateData: SnackUpdateModel) => Promise<SnackPrismaModel>;
    create: (newData: SnackCreateModel) => Promise<SnackPrismaModel>;
    delete: (id: string) => Promise<void>;
}
