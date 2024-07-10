import axios from "axios";

const ApiConfig = axios.create({
  baseURL: "http://localhost:5180/api/v1/",
});

export default ApiConfig;
