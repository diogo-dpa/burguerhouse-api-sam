-- DropForeignKey
ALTER TABLE "SnackItems" DROP CONSTRAINT "SnackItems_ingredientId_fkey";

-- DropForeignKey
ALTER TABLE "SnackItems" DROP CONSTRAINT "SnackItems_snackId_fkey";

-- AddForeignKey
ALTER TABLE "SnackItems" ADD CONSTRAINT "SnackItems_snackId_fkey" FOREIGN KEY ("snackId") REFERENCES "Snacks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SnackItems" ADD CONSTRAINT "SnackItems_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredients"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
