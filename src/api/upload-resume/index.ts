import { Router } from "express";
import multer from "multer";
import { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";
import { prisma } from "../../database";
import { cloudinary } from "../../utils/cloudinary";
import { getCooieValue } from "../../utils/get-cookie";

const router = Router();

type ResBody = {
	status: "upload successfull" | "upload error";
	message?: string;
};

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.use("/", upload.single("resume"), async (req, res) => {
	const fileBuffer = req.file?.buffer;
	let resBody: ResBody = {} as ResBody;
	const username = getCooieValue("username", req);

	try {
		const uploadResult: UploadApiResponse | undefined = await new Promise(
			(resolve, reject) => {
				cloudinary.uploader
					.upload_stream((error, uploadResult) => {
						return resolve(uploadResult);
					})
					.end(fileBuffer);
			}
		);

		if (uploadResult && username) {
			await prisma.user.update({
				data: {
					resumeUplodedLink: uploadResult.secure_url,
				},
				where: {
					username: username,
				},
			});

			resBody = {
				status: "upload successfull",
			};

			res.status(200);
			return res.send(resBody);
		}
	} catch (error: unknown) {
		resBody = {
			status: "upload error",
			message: "Something happend while uploading the file",
		};
		res.status(500);
		return res.send(resBody);
	}

	return res.status(500).send("Internal server error");
});

export { router as uploadResumeRoute };
