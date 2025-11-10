-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "motivo" TEXT NOT NULL,
    "whatsapp_number" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);
