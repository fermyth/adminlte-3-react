import { useEffect, useState } from "react";
import MyChart from "./Cart";
import axios from "axios";



const Dashboard = () => {
  const data = [12, 19, 3, 5, 2, 3 ];
  const labels = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'];
 
  const [companyInfo, setCompanyInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);


  const getPortal = async () => {
    try {
      const response = await axios.get("https://backend.sigapdriver.com/api/detail_activity/1/3");
     console.log("hahaha",response);
    } catch (error) {
      console.error("Error fetching company info with fetch:", error);
    }
  
  };

  useEffect(() => {
    getPortal();
  }, []);

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  // if (!companyInfo) {
  //   return <div>Error loading company info</div>;
  // }

  return (
    <div>

      <div className="d-flex  ">  
        <div className="info-box w-50 d-flex flex-column mr-4 ">
          <div className="d-flex  ml-3  ">
            <p className=" font-weight-bold text-black text-uppercase ">
              Nama PT
            </p>
            <p className="ml-4 font-weight-bold text-black text-uppercase ">
              PT.KEYENCE INDONESIA 
            </p>
          </div>  
          <div className="d-flex  ml-3 ">
            <p className=" font-weight-bold text-black text-uppercase ">
              Alamat
            </p>
            <div>
            <p className="ml-4 font-weight-bold text-black text-uppercase ">
            ALAMANDA OFFICE TOWER 
            </p>
            <p className="ml-4 font-weight-bold text-black text-uppercase ">
            LANTAI 20 UNIT D
            </p>
            <p className="ml-4 font-weight-bold text-black text-uppercase ">
            JL. TB SIMATUPANG KAV 23-24
            </p>
            <p className="ml-4 font-weight-bold text-black text-uppercase ">
            CILANDAK BARAT, JAKARTA 12430
            </p>
            </div>
          </div>   
        </div> 
        <div className="info-box w-50 mr-2 bg-black -d-flex flex-column align-items-center justify-content-center">
          <p className=" font-weight-bold text-light text-uppercase">
          26 Apr 2024 - 25 May 2024
          </p>
          <h1 className="font-weight-bold text-light text-uppercase">
          203,816,597
          </h1>
          <h1 className="text-light " style={{ fontSize: "25px", fontWeight: "bold" }}>
          Jumlah Invoice Tarakhir
          </h1>
        </div>
      </div>
      <div className="pt-4 pb-3">
        <h2 className="font-weight-bold text-black text-uppercase ml-3">Nilai Invoice 6 Terakhir</h2>
      </div>
      <MyChart data={data} labels={labels} />

    </div>
  );
};

export default Dashboard;

