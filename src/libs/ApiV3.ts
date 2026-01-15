import axios from "axios";

const ApiConfig = axios.create({
 // baseURL: "https://api-invoice-mysql.sigapdriver.com/api/v1",
 // baseURL: "http://localhost:8299/api/v1",
  // baseURL: "https://api_portal.sigapdriver.com/api/v1",
   baseURL: "https://api_portal_staging.sigapdriver.com/api/v1",
  // baseURL: "https://backend.sigapdriver.com/api/"
});


const ApiConfig_2 = axios.create({
 // baseURL: "https://api-invoice-mysql.sigapdriver.com/api/v1",
 // baseURL: "http://localhost:8299/api/v1",
  // baseURL: "https://api_portal.sigapdriver.com/api/v1",
   baseURL: "https://api_portal_staging.sigapdriver.com/api/v1",
  // baseURL: "https://backend.sigapdriver.com/api/"
});



const ApiPartner = () => {
  //return "http://localhost:5182/api/v1";
  return "https://api_partner_staging.sigapdriver.com/api/v1";
};

const UrlServer = () => {
 //  return "https://api_portal_staging.sigapdriver.com/api/v1";
  // return "https://api_partner_staging.sigapdriver.com/api/v1";
  return "https://api-invoice-mysql.sigapdriver.com/api/v1";
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

const ApiConfig_v2 = () => {
  return "https://api-invoice-mysql.sigapdriver.com/api/v1/";
};

export { UrlServer, ApiPartner,UrlServerLaravel,UrlServerRekruitmen,ApiConfig_v2 };
export default ApiConfig;