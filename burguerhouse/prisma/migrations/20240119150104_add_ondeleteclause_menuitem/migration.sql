-- DropForeignKey
ALTER TABLE "MenuItems" DROP CONSTRAINT "MenuItems_menuId_fkey";

-- AddForeignKey
ALTER TABLE "MenuItems" ADD CONSTRAINT "MenuItems_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menus"("id") ON DELETE CASCADE ON UPDATE CASCADE;
