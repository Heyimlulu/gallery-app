-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255),
    "description" TEXT,
    "filename" VARCHAR(255) NOT NULL,
    "data" BYTEA NOT NULL,
    "mime_type" VARCHAR(127) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);
