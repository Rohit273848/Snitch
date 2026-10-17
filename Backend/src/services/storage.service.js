import ImageKit from "@imagekit/nodejs";
import { config } from "../config/config.js";

const client = new ImageKit({
    privateKey: config.IMAGEKIT_PRIVATE_KEY,
});

export async function uploadFile({
    buffer,
    fileName,
    folder = "velmora",
}) {
    const response = await client.files.upload({
        file: await ImageKit.toFile(buffer),
        fileName,
        folder,
    });

    return response;
}

export async function deleteFileById(fileId) {
    try {
        if (!fileId || typeof fileId !== "string") return;
        await client.files.delete(fileId);
    } catch (err) {
        console.error("Failed to delete file from ImageKit by ID:", err.message || err);
    }
}

export async function deleteFileByUrl(url) {
    try {
        if (!url || typeof url !== "string") return;

        // In ImageKit v7, client.files.delete takes fileId.
        // If the URL or file identifier is passed, log or attempt deletion if fileId is extractable.
        // Safe no-op if client.files.list is not available.
        if (typeof client.files?.list === "function") {
            const urlParts = url.split("/");
            const fileName = urlParts[urlParts.length - 1]?.split("?")[0];
            if (!fileName) return;

            const files = await client.files.list({
                searchQuery: `name = "${fileName}"`,
            });

            if (files && Array.isArray(files) && files.length > 0) {
                for (const file of files) {
                    if (file.fileId) {
                        await client.files.delete(file.fileId);
                    }
                }
            }
        }
    } catch (err) {
        console.error("Failed to delete file from ImageKit:", err.message || err);
    }
}
