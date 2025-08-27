import axios from "axios";


export default axios.Instance({
    baseURL: "http://localhost:5000/api",
    withCredentials: true,
})