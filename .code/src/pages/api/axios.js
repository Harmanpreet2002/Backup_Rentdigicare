import axios from "axios"
import { SERVER_URL } from "../ServerLink";

// get token from the http only cookie in production
// Token will change each time login happen in production
const token ="Bearer " + window.localStorage.getItem("accessToken");
export default axios.create({
    baseURL: SERVER_URL+"/",
    headers: { Authorization: token }
})