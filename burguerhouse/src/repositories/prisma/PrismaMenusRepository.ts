import { prisma } from '../../lib/prisma';
import { IPrismaMenusRepository } from '../../irepositories/prisma/IPrismaMenusRepository';
import { MenuPrismaModel } from '../../models/menu/MenuPrismaModel';
import { MenuCreateModel } from '../../models/menu/MenuCreateModel';
import { MenuUpdateModel } from '../../models/menu/MenuUpdateModel';

export class PrismaMenusRepository implements IPrismaMenusRepository {
    async getAll(): Promise<MenuPrismaModel[]> {
        return await prisma.menus.findMany({
            include: {
                menuItems: true,
            },
        });
    }

    async getById(id: string): Promise<MenuPrismaModel | null> {
        const menuFound = await prisma.menus.findUnique({
            where: {
                id,
            },
            include: {
                menuItems: true,
            },
        });

        return menuFound;
    }

    async update(id: string, updateData: MenuUpdateModel): Promise<MenuPrismaModel> {
        const updatedMenu = await prisma.menus.update({
            where: {
                id,
            },
            data: {
                description: updateData.description,
                menuItems: {
                    deleteMany: {},
                    create: updateData.menuItems?.map((menuItem) => ({
                        ingredient: {
                            connect: {
                                id: menuItem.ingredientId,
                            },
                        },
                        snack: {
                            connect: {
                                id: menuItem.snackId,
                            },
                        },
                    })),
                },
            },
            include: {
                menuItems: true,
            },
        });

        return updatedMenu;
    }

    async create(newData: MenuCreateModel): Promise<MenuPrismaModel> {
        const createdMenu = await prisma.menus.create({
            data: {
                name: newData.name,
                description: newData.description,
                menuItems: {
                    create: newData.menuItems?.map((menuItem) => ({
                        ingredient: {
                            connect: {
                                id: menuItem.ingredientId,
                            },
                        },
                        snack: {
                            connect: {
                                id: menuItem.snackId,
                            },
                        },
                    })),
                },
            },
            include: {
                menuItems: true,
            },
        });

        return createdMenu;
    }

    async delete(id: string): Promise<void> {
        await prisma.menus.delete({
            where: {
                id,
            },
        });
    }
}
