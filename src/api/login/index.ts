import { Router } from "express";
import { prisma } from "../../database";

const router = Router();

type ReqBody = {
	username: string;
	password: string;
	role: "STUDENT" | "ADMIN";
};

type ResBody = {
	authorization: "authorized" | "unauthorized";
	navigateTo?: string;
	message?: string;
};

router.use("/", async (req, res) => {
	const reqBody: ReqBody = req.body;
	let resBody: ResBody = {} as ResBody;

	const user = await prisma.user.findUnique({
		where: { username: reqBody.username },
	});

	// checj if user exists
	if (!user) {
		resBody = {
			authorization: "unauthorized",
		};
		res.statusCode = 401;
		return res.json(resBody);
		/**
		 *
		 */
	} else {
		// if user exists
		// check role is correct
		if (reqBody.role === String(user.role)) {
			// check password is correct
			if (reqBody.password === user.password) {
				res.statusCode = 201;
				res.cookie("username", user.username);
				res.cookie("role", user.role);
				if (reqBody.role === "ADMIN") {
					resBody = {
						authorization: "authorized",
						navigateTo: "/admin",
					};
					return res.json(resBody);
				} else {
					resBody = {
						authorization: "authorized",
						navigateTo: "/student",
					};
					return res.json(resBody);
				}
			}
			resBody = {
				authorization: "unauthorized",
				message: `Wrong password`,
			};
			res.statusCode = 401;
			return res.json(resBody);
		}
		// role is not correct
		resBody = {
			authorization: "unauthorized",
		};
		res.statusCode = 401;
		return res.json(resBody);
	}
});

export { router as loginRoute };
