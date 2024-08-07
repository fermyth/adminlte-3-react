import axios from "axios";

const ApiConfig = axios.create({
   baseURL: "http://localhost:5181/api/v1",
 //baseURL : "https://api_portal.sigapdriver.com/api/v1"
//baseURL : "https://backend.sigapdriver.com/api/"
});

const UrlServer = () => {
  // return "https://api_portal.sigapdriver.com";
  return "http://localhost:5181";
}

export { UrlServer };
export default ApiConfig;
