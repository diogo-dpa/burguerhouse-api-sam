/*
  Warnings:

  - You are about to drop the `_IngredientsToOrderItems` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_OrderItemsToSnacks` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `ingredientId` to the `OrderItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `snackId` to the `OrderItems` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_IngredientsToOrderItems" DROP CONSTRAINT "_IngredientsToOrderItems_A_fkey";

-- DropForeignKey
ALTER TABLE "_IngredientsToOrderItems" DROP CONSTRAINT "_IngredientsToOrderItems_B_fkey";

-- DropForeignKey
ALTER TABLE "_OrderItemsToSnacks" DROP CONSTRAINT "_OrderItemsToSnacks_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrderItemsToSnacks" DROP CONSTRAINT "_OrderItemsToSnacks_B_fkey";

-- AlterTable
ALTER TABLE "OrderItems" ADD COLUMN     "ingredientId" TEXT NOT NULL,
ADD COLUMN     "snackId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_IngredientsToOrderItems";

-- DropTable
DROP TABLE "_OrderItemsToSnacks";

-- AddForeignKey
ALTER TABLE "OrderItems" ADD CONSTRAINT "OrderItems_snackId_fkey" FOREIGN KEY ("snackId") REFERENCES "Snacks"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItems" ADD CONSTRAINT "OrderItems_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredients"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
