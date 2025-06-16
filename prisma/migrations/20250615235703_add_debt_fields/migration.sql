/*
  Warnings:

  - Added the required column `amount` to the `Debt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `installmentsNumber` to the `Debt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Debt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Installment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Debt" ADD COLUMN     "amount" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "installmentsNumber" INTEGER NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Installment" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Installment" ADD CONSTRAINT "Installment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
