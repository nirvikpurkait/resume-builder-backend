import express from "express";
import cors, { CorsOptions } from "cors";
import { apiRoute } from "./api/api-routes";
import "dotenv/config";
import { baseUrl } from "./utils/base-url";

const app = express();

const corsOption: CorsOptions = {
	credentials: true,
	origin: baseUrl,
};

app.use(express.json());
app.use(cors(corsOption));

app.use("/api", apiRoute);

app.listen(5000, () => {
	console.log(`app listening on port 5000`);
});
