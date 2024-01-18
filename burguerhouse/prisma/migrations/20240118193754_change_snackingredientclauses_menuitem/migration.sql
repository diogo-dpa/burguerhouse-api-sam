/*
  Warnings:

  - You are about to drop the `_IngredientsToMenuItems` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MenuItemsToSnacks` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `ingredientId` to the `MenuItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `snackId` to the `MenuItems` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_IngredientsToMenuItems" DROP CONSTRAINT "_IngredientsToMenuItems_A_fkey";

-- DropForeignKey
ALTER TABLE "_IngredientsToMenuItems" DROP CONSTRAINT "_IngredientsToMenuItems_B_fkey";

-- DropForeignKey
ALTER TABLE "_MenuItemsToSnacks" DROP CONSTRAINT "_MenuItemsToSnacks_A_fkey";

-- DropForeignKey
ALTER TABLE "_MenuItemsToSnacks" DROP CONSTRAINT "_MenuItemsToSnacks_B_fkey";

-- AlterTable
ALTER TABLE "MenuItems" ADD COLUMN     "ingredientId" TEXT NOT NULL,
ADD COLUMN     "snackId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_IngredientsToMenuItems";

-- DropTable
DROP TABLE "_MenuItemsToSnacks";

-- AddForeignKey
ALTER TABLE "MenuItems" ADD CONSTRAINT "MenuItems_snackId_fkey" FOREIGN KEY ("snackId") REFERENCES "Snacks"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItems" ADD CONSTRAINT "MenuItems_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredients"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
