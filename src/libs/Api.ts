import axios from "axios";

const ApiConfig = axios.create({
  // baseURL: "http://localhost:5180/api/v1",
 baseURL : "https://api_portal.sigapdriver.com/api/v1"
//baseURL : "https://backend.sigapdriver.com/api/"
});

const UrlServer = () => {
  return "https://api_portal.sigapdriver.com";
}

export { UrlServer };
export default ApiConfig;
