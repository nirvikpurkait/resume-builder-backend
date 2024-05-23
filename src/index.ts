import express from "express";
import cors from "cors";
import { apiRoute } from "./api/api-routes";
import "dotenv/config";

const app = express();

app.use(express.json());
app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
	})
);

app.use("/api", apiRoute);

app.listen(5000, () => {
	console.log(`app listening on port 5000`);
});
