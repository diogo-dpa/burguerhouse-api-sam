/*
  Warnings:

  - You are about to drop the `_IngredientsToSnackItems` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `ingredientId` to the `SnackItems` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_IngredientsToSnackItems" DROP CONSTRAINT "_IngredientsToSnackItems_A_fkey";

-- DropForeignKey
ALTER TABLE "_IngredientsToSnackItems" DROP CONSTRAINT "_IngredientsToSnackItems_B_fkey";

-- AlterTable
ALTER TABLE "SnackItems" ADD COLUMN     "ingredientId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_IngredientsToSnackItems";

-- AddForeignKey
ALTER TABLE "SnackItems" ADD CONSTRAINT "SnackItems_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
