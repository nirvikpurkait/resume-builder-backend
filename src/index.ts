import express from "express";
import cors from "cors";
import { prisma } from "./database";

const app = express();

app.use(express.json());
app.use(cors());

app.post("/api/login", async (req, res) => {
	type ReqBody = {
		username: string;
		password: string;
		role: "STUDENT" | "ADMIN";
	};
	const reqBody: ReqBody = req.body;

	const user = await prisma.user.findUnique({
		where: { username: reqBody.username },
	});

	// if user does not exists
	if (!user) {
		return res.send("No user exists");
	}

	// if user exists
	// check role is correct
	if (reqBody.role === String(user.role)) {
		// check password is correct
		if (reqBody.password === user.password) {
			if (reqBody.role === "ADMIN") {
				return res.send({ sendTo: "/admin" });
			} else {
				return res.send({ sendTo: "/student" });
			}
		}
		return res.send(`Wrong Password`);
	}
	// role is not correct
	return res.send(`Unauthorized`);
});

app.get("/api/user-details", async (req, res) => {
	const users = await prisma.user.findMany();
	const modifiedUsers = users.map((user) => {
		return { username: user.username, id: user.id };
	});

	return res.json(modifiedUsers);
});

app.listen(5000, () => {
	console.log(`app listening on port 5000`);
});
