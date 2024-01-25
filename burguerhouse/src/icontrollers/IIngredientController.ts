import { IBaseController } from './IBaseController';

export type IIngredientController = Omit<IBaseController, 'getRelationshipById'>;
