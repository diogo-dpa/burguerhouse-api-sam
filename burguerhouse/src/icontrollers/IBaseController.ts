export interface IBaseController<T> {
    getAll: () => Promise<T>;
    getById: (id: number) => Promise<T>;
    update: (id: number, updateData: Partial<T>) => Promise<T>;
    create: (newData: T) => Promise<T>;
    delete: (id: number) => Promise<T>;
}
