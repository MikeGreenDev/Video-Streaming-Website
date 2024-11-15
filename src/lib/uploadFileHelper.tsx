import fs from 'fs'
import { v4 as uuidV4 } from 'uuid'
import prisma from '@/lib/prismadb'
import path from "path";
import { Media, MediaType } from '@prisma/client';
export const UPLOAD_DIR = path.resolve(process.env.UPLOAD_PATH ?? "", "public/uploads/")

export const uploadFile = async (file: File, type: MediaType, userID: string): Promise<Media> => {
    let buffer: NodeJS.ArrayBufferView | string = "";
    if (file) {
        try {
            if (file.arrayBuffer) {
                buffer = Buffer.from(await file.arrayBuffer());
            }
            if (!fs.existsSync(UPLOAD_DIR)) {
                fs.mkdirSync(UPLOAD_DIR)
            }
        } catch (e: any) {
            return Promise.reject(e)
        }
        console.log("File: ", file)
        let name = file.name.replaceAll(" ", "_")
        // Get the file extension
        let ext = name.split('.').filter(Boolean).slice(1).join('.');
        console.log(name)
        // Trim filename if needed
        if (name.length > 200) {
            name = name.slice(0, -33);
        }
        name = name.replaceAll('.', '');
        // Make the filename unique
        name = name + "_" + uuidV4() + "." + ext;
        console.log("Name: ", name)
        let filename = path.resolve(UPLOAD_DIR, name);
        try {
            fs.writeFileSync(
                filename,
                buffer
            )
        } catch (e: any) {
            return Promise.reject(e)
        }

        const mr = await prisma.media.create({
            data: {
                userID: userID,
                src: filename,
                type: type,
            }
        })

        return Promise.resolve(mr)
    }
    return Promise.reject("File not given")
}
