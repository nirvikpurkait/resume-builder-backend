import { Router } from "express";
import { loginRoute } from "./login";
import { userDetailsRoute } from "./user-details";
import { uploadResumeRoute } from "./upload-resume";

const router = Router();

router.post("/login", loginRoute);
router.get("/user-details", userDetailsRoute);
router.post("/upload-resume", uploadResumeRoute);

export { router as apiRoute };
