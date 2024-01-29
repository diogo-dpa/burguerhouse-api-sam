import { IBaseController } from './IBaseController';

export type IOrderController = Omit<IBaseController, 'update' | 'delete'>;
