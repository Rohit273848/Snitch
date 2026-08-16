import ImageKit from "@imagekit/nodejs";
import { config } from "../config/config.js";

const client = new ImageKit({
    privateKey: config.IMAGEKIT_PRIVATE_KEY,
});

export async function uploadFile({
    buffer,
    fileName,
    folder = "snitch",
}) {
    const response = await client.files.upload({
        file: await ImageKit.toFile(buffer),
        fileName,
        folder,
    });

    return response;
}

export async function deleteFileByUrl(url) {
    try {
        if (!url || typeof url !== "string") return;

        // Extract file name from ImageKit URL
        const urlParts = url.split("/");
        const fileName = urlParts[urlParts.length - 1]?.split("?")[0];
        if (!fileName) return;

        const files = await client.files.list({
            searchQuery: `name = "${fileName}"`,
        });

        if (files && Array.isArray(files) && files.length > 0) {
            for (const file of files) {
                if (file.fileId) {
                    await client.files.deleteFile(file.fileId);
                }
            }
        }
    } catch (err) {
        console.error("Failed to delete file from ImageKit:", err.message || err);
    }
}