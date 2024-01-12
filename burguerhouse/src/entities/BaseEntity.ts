export class BaseEntity {
    public id: number;
    public createdAt: Date;
    public updatedAt: Date;

    constructor(_id: number) {
        this.id = _id;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}
