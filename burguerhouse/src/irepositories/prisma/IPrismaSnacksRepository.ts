import { SnackCreateModel } from '../../models/snack/SnackCreateModel';
import { SnackPrismaModel } from '../../models/snack/SnackPrismaModel';
import { SnackUpdateModel } from '../../models/snack/SnackUpdateModel';
import { JsonAPIQueryOptions } from '../../utils/jsonapi/typesJsonapi';

export interface IPrismaSnacksRepository {
    getAll: (queryOptions?: JsonAPIQueryOptions) => Promise<SnackPrismaModel[]>;
    getById: (id: string, queryOptions?: JsonAPIQueryOptions) => Promise<SnackPrismaModel | null>;
    getByName: (name: string) => Promise<SnackPrismaModel | null>;
    update: (id: string, updateData: SnackUpdateModel) => Promise<SnackPrismaModel>;
    create: (newData: SnackCreateModel) => Promise<SnackPrismaModel>;
    delete: (id: string) => Promise<void>;
}
