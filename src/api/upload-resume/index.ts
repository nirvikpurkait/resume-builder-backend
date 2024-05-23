import { Router } from "express";
import multer from "multer";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { prisma } from "../../database";

const router = Router();

type ResBody = {
	status: "upload successfull" | "upload error";
	message?: string;
};

cloudinary.config({
	cloud_name: "qs9plzf7aycxv3or",
	api_key: "573715244482798",
	api_secret: "Cd0PxKxfhRK5D_9eyJjTBbUnW1w",
	secure: true,
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.use("/", upload.single("file"), async (req, res) => {
	const fileBuffer = req.file?.buffer;

	const uploadResult: UploadApiResponse | undefined = await new Promise(
		(resolve, reject) => {
			cloudinary.uploader
				.upload_stream((error, uploadResult) => {
					return resolve(uploadResult);
				})
				.end(fileBuffer);
		}
	);

	return res.status(200).send("File received successfully");
});

export { router as uploadResumeRoute };
