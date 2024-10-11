import axios from "axios";

const ApiConfig = axios.create({
  //baseURL: "http://localhost:5181/api/v1",
  // baseURL: "https://api_portal.sigapdriver.com/api/v1",
   baseURL: "https://api_portal_staging.sigapdriver.com/api/v1",
  // baseURL: "https://backend.sigapdriver.com/api/"
});

const ApiPartner = () => {
  //return "http://localhost:5182/api/v1";
  return "https://api_partner_staging.sigapdriver.com/api/v1";
};

const UrlServer = () => {
   return "https://api_portal_staging.sigapdriver.com/api/v1";
  // return "https://api_partner_staging.sigapdriver.com/api/v1";
 // return "http://localhost:5181/api/v1";
};

const UrlServerLaravel = () => {
  return "https://backend.sigapdriver.com/api";
 // return "https://api_partner_staging.sigapdriver.com/api/v1";
// return "http://localhost:5181/api/v1";
};

const UrlServerRekruitmen = () => {
  return "https://api_rekruitmen_staging.sigapdriver.com/api/v1";
 // return "https://api_partner_staging.sigapdriver.com/api/v1";
// return "http://localhost:5181/api/v1";
};

export { UrlServer, ApiPartner,UrlServerLaravel,UrlServerRekruitmen };
export default ApiConfig;
