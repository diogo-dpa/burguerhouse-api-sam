import { prisma } from '../../lib/prisma';
import { IPrismaMenusRepository } from '../../irepositories/prisma/IPrismaMenusRepository';
import { MenuPrismaModel } from '../../models/menu/MenuPrismaModel';
import { MenuCreateModel } from '../../models/menu/MenuCreateModel';
import { MenuUpdateModel } from '../../models/menu/MenuUpdateModel';
import { JsonAPIQueryOptions } from '../../utils/jsonapi/typesJsonapi';

export class PrismaMenusRepository implements IPrismaMenusRepository {
    private defaultInclude = { menuItems: true };

    async getAll(queryOptions?: JsonAPIQueryOptions): Promise<MenuPrismaModel[]> {
        const { sort, include } = queryOptions ?? {};

        const allMenus = await prisma.menus.findMany({
            orderBy: [...(sort ?? [])],
            include: {
                ...(include ?? this.defaultInclude),
            },
        });

        return this.formatMenusResponse(allMenus as MenuPrismaModel[]);
    }

    async getById(id: string, queryOptions?: JsonAPIQueryOptions): Promise<MenuPrismaModel | null> {
        const { include } = queryOptions ?? {};

        const menuFound = await prisma.menus.findUnique({
            where: {
                id,
            },
            include: {
                ...(include ?? this.defaultInclude),
            },
        });

        if (!menuFound) return null;

        return this.formatMenuResponse(menuFound as MenuPrismaModel);
    }

    async getByName(name: string): Promise<MenuPrismaModel | null> {
        const menuFound = await prisma.menus.findUnique({
            where: {
                name,
            },
        });

        if (!menuFound) return null;

        return this.formatMenuResponse(menuFound as MenuPrismaModel);
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
                    create: updateData.menuItems?.map((menuItem) =>
                        !!menuItem.ingredientId
                            ? {
                                  ingredient: {
                                      connect: {
                                          id: menuItem.ingredientId,
                                      },
                                  },
                              }
                            : {
                                  snack: {
                                      connect: {
                                          id: menuItem.snackId,
                                      },
                                  },
                              },
                    ),
                },
            },
            include: {
                ...this.defaultInclude,
            },
        });

        return this.formatMenuResponse(updatedMenu as MenuPrismaModel);
    }

    async create(newData: MenuCreateModel): Promise<MenuPrismaModel> {
        const createdMenu = await prisma.menus.create({
            data: {
                name: newData.name,
                description: newData.description,
                menuItems: {
                    create: newData.menuItems?.map((menuItem) =>
                        !!menuItem.ingredientId
                            ? {
                                  ingredient: {
                                      connect: {
                                          id: menuItem.ingredientId,
                                      },
                                  },
                              }
                            : {
                                  snack: {
                                      connect: {
                                          id: menuItem.snackId,
                                      },
                                  },
                              },
                    ),
                },
            },
            include: {
                ...this.defaultInclude,
            },
        });

        return this.formatMenuResponse(createdMenu as MenuPrismaModel);
    }

    async delete(id: string): Promise<void> {
        await prisma.menus.delete({
            where: {
                id,
            },
        });
    }

    // Private methods
    private formatMenuResponse(menu: MenuPrismaModel): MenuPrismaModel {
        return {
            ...menu,
            menuItems:
                menu.menuItems?.map((menuItem) => ({
                    ...menuItem,
                    snack: menuItem.snack
                        ? { ...menuItem.snack, unitMoneyAmount: Number(menuItem.snack?.unitMoneyAmount) }
                        : null,
                    ingredient: menuItem.ingredient
                        ? { ...menuItem.ingredient, unitMoneyAmount: Number(menuItem.ingredient?.unitMoneyAmount) }
                        : null,
                })) ?? [],
        } as MenuPrismaModel;
    }

    private formatMenusResponse(menus: MenuPrismaModel[]): MenuPrismaModel[] {
        return menus.map((menu) => this.formatMenuResponse(menu)) as MenuPrismaModel[];
    }
}
