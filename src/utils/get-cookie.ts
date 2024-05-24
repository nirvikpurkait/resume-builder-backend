import { Request } from "express";

const getCooieValue = (cookieName: string, req: Request) => {
	const cookies = req.headers.cookie?.split("; ")!;

	for (let cookie of cookies) {
		const [incomingCookieName, incomingCookieValue] = cookie.split("=");
		if (incomingCookieName === cookieName) return incomingCookieValue;
	}

	return null;
};

export { getCooieValue };
