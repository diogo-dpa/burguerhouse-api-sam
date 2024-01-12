-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isEmployee" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "totalPrice" DECIMAL(65,30) NOT NULL,
    "orderDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItems" (
    "id" TEXT NOT NULL,
    "itemAmount" INTEGER NOT NULL,
    "orderId" TEXT NOT NULL,

    CONSTRAINT "OrderItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ingredients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unitMoneyAmount" DECIMAL(65,30) NOT NULL,
    "availableAmount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Snacks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "unitMoneyAmount" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Snacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SnackItems" (
    "id" TEXT NOT NULL,
    "ingredientAmount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "snackId" TEXT NOT NULL,

    CONSTRAINT "SnackItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Menus" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Menus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuItems" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "menuId" TEXT NOT NULL,

    CONSTRAINT "MenuItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_OrderItemsToSnacks" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_IngredientsToOrderItems" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_IngredientsToSnackItems" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_IngredientsToMenuItems" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_MenuItemsToSnacks" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Ingredients_name_key" ON "Ingredients"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Snacks_name_key" ON "Snacks"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Menus_name_key" ON "Menus"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_OrderItemsToSnacks_AB_unique" ON "_OrderItemsToSnacks"("A", "B");

-- CreateIndex
CREATE INDEX "_OrderItemsToSnacks_B_index" ON "_OrderItemsToSnacks"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_IngredientsToOrderItems_AB_unique" ON "_IngredientsToOrderItems"("A", "B");

-- CreateIndex
CREATE INDEX "_IngredientsToOrderItems_B_index" ON "_IngredientsToOrderItems"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_IngredientsToSnackItems_AB_unique" ON "_IngredientsToSnackItems"("A", "B");

-- CreateIndex
CREATE INDEX "_IngredientsToSnackItems_B_index" ON "_IngredientsToSnackItems"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_IngredientsToMenuItems_AB_unique" ON "_IngredientsToMenuItems"("A", "B");

-- CreateIndex
CREATE INDEX "_IngredientsToMenuItems_B_index" ON "_IngredientsToMenuItems"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MenuItemsToSnacks_AB_unique" ON "_MenuItemsToSnacks"("A", "B");

-- CreateIndex
CREATE INDEX "_MenuItemsToSnacks_B_index" ON "_MenuItemsToSnacks"("B");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItems" ADD CONSTRAINT "OrderItems_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SnackItems" ADD CONSTRAINT "SnackItems_snackId_fkey" FOREIGN KEY ("snackId") REFERENCES "Snacks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItems" ADD CONSTRAINT "MenuItems_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderItemsToSnacks" ADD CONSTRAINT "_OrderItemsToSnacks_A_fkey" FOREIGN KEY ("A") REFERENCES "OrderItems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderItemsToSnacks" ADD CONSTRAINT "_OrderItemsToSnacks_B_fkey" FOREIGN KEY ("B") REFERENCES "Snacks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IngredientsToOrderItems" ADD CONSTRAINT "_IngredientsToOrderItems_A_fkey" FOREIGN KEY ("A") REFERENCES "Ingredients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IngredientsToOrderItems" ADD CONSTRAINT "_IngredientsToOrderItems_B_fkey" FOREIGN KEY ("B") REFERENCES "OrderItems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IngredientsToSnackItems" ADD CONSTRAINT "_IngredientsToSnackItems_A_fkey" FOREIGN KEY ("A") REFERENCES "Ingredients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IngredientsToSnackItems" ADD CONSTRAINT "_IngredientsToSnackItems_B_fkey" FOREIGN KEY ("B") REFERENCES "SnackItems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IngredientsToMenuItems" ADD CONSTRAINT "_IngredientsToMenuItems_A_fkey" FOREIGN KEY ("A") REFERENCES "Ingredients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IngredientsToMenuItems" ADD CONSTRAINT "_IngredientsToMenuItems_B_fkey" FOREIGN KEY ("B") REFERENCES "MenuItems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MenuItemsToSnacks" ADD CONSTRAINT "_MenuItemsToSnacks_A_fkey" FOREIGN KEY ("A") REFERENCES "MenuItems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MenuItemsToSnacks" ADD CONSTRAINT "_MenuItemsToSnacks_B_fkey" FOREIGN KEY ("B") REFERENCES "Snacks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
