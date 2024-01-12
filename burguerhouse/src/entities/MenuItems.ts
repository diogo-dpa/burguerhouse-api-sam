import { BaseEntity } from './BaseEntity';

export class SnackItemsEntity extends BaseEntity {
    public menuId: string;
    public snackId: string;
    public ingredientId: string;

    constructor(_id: number, _menuId: string, _snackId: string, _ingredientId: string) {
        super(_id);
        this.menuId = _menuId;
        this.snackId = _snackId;
        this.ingredientId = _ingredientId;
    }
}
