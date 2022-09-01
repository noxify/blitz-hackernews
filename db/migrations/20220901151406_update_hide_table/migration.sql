-- DropIndex
DROP INDEX "Hide_userId_entryId_key";

-- AlterTable
ALTER TABLE "Hide" ADD COLUMN     "commentId" INTEGER,
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "entryId" DROP NOT NULL,
ADD CONSTRAINT "Hide_pkey" PRIMARY KEY ("id");
