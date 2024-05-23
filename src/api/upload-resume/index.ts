import { Router } from "express";
import multer from "multer";
import { UploadApiResponse } from "cloudinary";
import { prisma } from "../../database";
import { cloudinary } from "../../utils/cloudinary";

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
	console.log(req.headers);
	const username = req.headers.username as string;

	console.log("___username___", username);

	const uploadResult: UploadApiResponse | undefined = await new Promise(
		(resolve, reject) => {
			cloudinary.uploader
				.upload_stream((error, uploadResult) => {
					return resolve(uploadResult);
				})
				.end(fileBuffer);
		}
	);

	if (uploadResult) {
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

	return res.status(500).send("Internal server error");
});

export { router as uploadResumeRoute };
