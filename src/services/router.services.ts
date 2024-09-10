import axios from "axios";

const authRouter = axios.create({
	baseURL: "http://localhost:3000",
});

export default authRouter;
