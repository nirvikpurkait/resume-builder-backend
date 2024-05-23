import { Router } from "express";
import { prisma } from "../../database";

const router = Router();

router.use("/", async (req, res) => {
	const users = await prisma.user.findMany();
	const modifiedUsers = users
		.filter((user) => {
			if (user.role === "STUDENT") return true;
		})
		.map((user) => {
			return {
				id: user.id,
				username: user.username,
				resumeUplodedLink: user.resumeUplodedLink,
			};
		});

	console.log(req.cookies);

	res.statusCode = 200;

	return res.json(modifiedUsers);
});

export { router as userDetailsRoute };
