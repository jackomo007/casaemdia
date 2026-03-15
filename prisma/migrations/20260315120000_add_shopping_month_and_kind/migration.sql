CREATE TYPE "ShoppingListKind" AS ENUM ('GROCERY', 'PLANNED');

ALTER TABLE "ShoppingList"
ADD COLUMN "kind" "ShoppingListKind" NOT NULL DEFAULT 'GROCERY',
ADD COLUMN "referenceMonth" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE INDEX "ShoppingList_householdId_referenceMonth_idx"
ON "ShoppingList"("householdId", "referenceMonth");
