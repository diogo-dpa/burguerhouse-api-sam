import { Menus, Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { IPrismaMenusRepository } from '../../irepositories/prisma/IPrismaMenusRepository';

export class PrismaMenusRepository implements IPrismaMenusRepository {
    async getAll(): Promise<Menus[]> {
        return await prisma.menus.findMany({
            include: {
                menuItems: true,
            },
        });
    }

    async getById(id: string): Promise<Menus | null> {
        const userFound = await prisma.menus.findUnique({
            where: {
                id,
            },
            include: {
                menuItems: true,
            },
        });

        return userFound;
    }

    async update(id: string, updateData: Prisma.MenusUpdateInput): Promise<Menus> {
        const updatedUser = await prisma.menus.update({
            where: {
                id,
            },
            data: { ...updateData },
            include: {
                menuItems: true,
            },
        });

        return updatedUser;
    }

    async create(newData: Prisma.MenusCreateInput): Promise<Menus> {
        const createdUser = await prisma.menus.create({
            data: {
                ...newData,
            },
            include: {
                menuItems: true,
            },
        });

        return createdUser;
    }

    async delete(id: string): Promise<void> {
        await prisma.menus.delete({
            where: {
                id,
            },
        });
    }
}
