import { useEffect, useState } from "react";
import axios from "axios";
import MyChart from "./Cart";
import { useAppSelector } from "@app/store/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EventEmitter } from "events";
import ApiConfig from "@app/libs/ApiV3";
import ApiConfig_v3 from "@app/libs/ApiV3";

import Footer from "./Footer";
import PayChart from "./PieChart";
import PieChartCategory from "./PieChartCategory";

const eventEmitter = new EventEmitter();

interface InvoiceData {
  id: number;
  periode: string;
  grand_total_value_inv_A: string;
  grand_total_value_inv_B: string;
}

interface CompanyInfo {
  id: number;
  company_name: string;
  company_address: string;
  company_ga_id: number;
  company_creator_id: number;
  address_area_id: string;
  created_at: string;
  updated_at: string;
  type_invoice: number;
  company_phone: string;
  internal_company_id: string;
  status: string;
  type_ppn: number;
  type_pph23: number;
}

interface Driver {
  birthdate: string;
}

const employees = [
  { type: 'GS' },
  { type: 'Job Holder' },
  { type: 'GS' },
  { type: 'Job Holder' },
  { type: 'GS' },
  // Tambahkan data karyawan lainnya
];
const Dashboard = () => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [invoiceData, setInvoiceData] = useState<InvoiceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = useAppSelector((state) => state.auth);
  const [idCompany, setIdCompany] = useState<string | null>(null);
  const [isDataChanged, setIsDataChanged] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await ApiConfig.get(`drivers/${idCompany}`);
        const driverData: Driver[] = response.data.data;

        // Calculate age and filter drivers
        const driversWithAge = driverData.map(driver => ({
          ...driver,
          age: calculateAge(new Date(driver.birthdate))
        }));

        setDrivers(driversWithAge);
      } catch (error) {
        console.error('Error fetching driver data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, [idCompany]);

  const calculateAge = (birthdate: Date): number => {
    const today = new Date();
    const birthYear = birthdate.getFullYear();
    const age = today.getFullYear() - birthYear;
    const monthDifference = today.getMonth() - birthdate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthdate.getDate())) {
      return age - 1;
    }
    return age;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        if (userData) {
          let getstorage = JSON.parse(userData);
          console.log("userData:", getstorage);
          setIdCompany(getstorage.id_company);
        } else {
          console.log("id_company is not available");
          setIdCompany(null);
        }
      } catch (error) {
        console.error("Error fetching id_company from AsyncStorage:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    const handleStorageChange = () => {
      fetchData();
    };

    eventEmitter.on("storageChange", handleStorageChange);

    return () => {
      eventEmitter.off("storageChange", handleStorageChange);
    };
  }, [currentUser]);

  useEffect(() => {
    if (idCompany) {
      getPortal(idCompany);
      getLatestInvoices(idCompany);
    }
  }, [idCompany]);

  const getPortal = async (id_company: string) => {
    try {
      const response = await ApiConfig.get(`mastercompanies/${id_company}`);
      console.log("response.dataaaa:", response.data);
  
      // Ambil objek pertama dari array
      if (Array.isArray(response.data) && response.data.length > 0) {
        setCompanyInfo(response.data[0]);
      } else {
        console.log("Data perusahaan tidak ditemukan atau format tidak sesuai.");
        setCompanyInfo(null); // Atau set ke objek kosong jika ingin
      }
  
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching company info:", error);
      setIsLoading(false);
    }
  };
  
  const getLatestInvoices = async (id_company: string) => {
    try {
      const response = await ApiConfig.get(`invoices/${id_company}`);
      console.log("response.data:", response.data);
  
      if (Array.isArray(response.data) && response.data.length > 0) {
        // Kelompokkan data berdasarkan periode (month_timestamp)
        const aggregatedData: { [key: string]: { totalA: number; totalB: number } } = {};
        
        response.data.forEach((invoice) => {
          const monthKey = invoice.periode; // Ganti dengan properti yang sesuai untuk month_timestamp
          
          const valueA = parseFloat(invoice.grand_total_value_inv_A) || 0;
          const valueB = parseFloat(invoice.grand_total_value_inv_B) || 0;
  
          if (!aggregatedData[monthKey]) {
            aggregatedData[monthKey] = { totalA: 0, totalB: 0 };
          }
          
          aggregatedData[monthKey].totalA += valueA;
          aggregatedData[monthKey].totalB += valueB;
        });
  
        // Ubah aggregatedData ke dalam format array untuk chart
        const finalData = Object.keys(aggregatedData).map((month) => ({
          periode: month,
          grand_total_value_inv_A: aggregatedData[month].totalA,
          grand_total_value_inv_B: aggregatedData[month].totalB,
        }));
  
        setInvoiceData(finalData.slice(0, 6)); // Ambil 6 data teratas jika perlu
      } else {
        console.log("Data invoices tidak ditemukan atau format tidak sesuai.");
      }
    } catch (error) {
      console.error("Error fetching latest invoices:", error);
    }
  };
  

  if (isLoading || !idCompany || !companyInfo) {
    return <div>Loading...</div>;
  }

  const addressLines = companyInfo?.company_address
  .replace(/<\/?[^>]+(>|$)/g, '') // Menghapus semua tag HTML
  .replace(/\s{2,}/g, ' ') // Menghapus spasi berlebih
  .split(/\r\n|\n|\r/) // Memisahkan berdasarkan baris baru
  .map(line => line.trim()) // Menghapus spasi di awal dan akhir setiap baris
  .filter(line => line !== ""); // Menghapus baris kosong

console.log(addressLines);


  const labels = invoiceData.map((invoice) => invoice.periode);
  const data = invoiceData.map(
    (invoice) =>
      parseFloat(invoice.grand_total_value_inv_A) +
      parseFloat(invoice.grand_total_value_inv_B)
  );

  const latestInvoice = invoiceData.length > 0 ? invoiceData[0] : null;
  const latestTotalInvoiceValue = latestInvoice
    ? parseFloat(latestInvoice.grand_total_value_inv_A) +
      parseFloat(latestInvoice.grand_total_value_inv_B)
    : 0;

    return (
      <>
        <style>
          {`
            .dashboard-container {
              background-color: #f4f6f9;
              padding: 30px;
            }
  
            .info-box {
              background-color: #ffffff;
              border-radius: 12px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              margin-bottom: 30px;
              padding: 25px;
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
            }
  
            .info-box h4 {
              color: #333;
              font-size: 18px;
              margin-bottom: 8px;
            }
  
            .info-box p {
              color: #000;
              font-size: 16px;
              margin: 0;
            }
  
            .company-info, .invoice-info {
              flex: 1;
            }
  
            .invoice-info {
              text-align: right;
            }
  
            .charts-container {
              display: grid;
              grid-template-columns: 2fr 1fr; /* MyChart lebih lebar, PayChart lebih kecil */
              gap: 30px;
            }
  
            .chart-item {
              background-color: #ffffff;
              border-radius: 12px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              padding: 20px;
            }
  
            .header-section {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding-bottom: 20px;
            }
  
            .header-section h2 {
              color: #333;
              font-size: 26px;
              margin: 0;
            }
  
            .address-section p {
              margin: 0;
              line-height: 1.6;
              color: #666;
            }
          `}
        </style>
  
        <div className="dashboard-container">
          <div className="d-flex mt-3">
            <div className="info-box w-50 d-flex flex-column mr-4 ">
              <div className="d-flex ml-3">
                <p className="font-weight-bold text-black text-uppercase">
                  Nama PT
                </p>
                <p className="ml-4 font-weight-bold text-black text-uppercase">
                  {companyInfo.company_name}
                </p>
              </div>
              <div className="d-flex ml-3">
                <p className="font-weight-bold text-black text-uppercase">Alamat</p>
                <div>
                {addressLines.length > 0 ? (
          addressLines.map((line, index) => (
            <p
              key={index}
              className="ml-4 font-weight-bold text-black text-uppercase"
            >
              {line}
            </p>
          ))
        ) : (
          <p className="ml-4 font-weight-bold text-black text-uppercase">
            Alamat tidak tersedia
          </p>
        )}
                </div>
              </div>
            </div>
            <div className="info-box w-50 mr-2 bg-gray d-flex flex-column align-items-center justify-content-center">
              <p className="text-uppercase">
                {latestInvoice ? latestInvoice.periode : "Loading..."}
              </p>
              <h1 className="text-uppercase">
                {latestTotalInvoiceValue.toLocaleString()}
              </h1>
              <h1
                className="text-light"
                style={{ fontSize: "25px", fontWeight: "normal" }}
              >
                Jumlah Invoice Terakhir
              </h1>
            </div>
          </div>

          {/* <div className="row"> */}
  
          {/* <div className="col-lg-8"> */}
          <div className="charts-container">
            <div className="chart-item">
              <h4 className="font-weight-bold text-center">Nilai Invoice 6 Terakhir</h4>
              <MyChart data={data} labels={labels} />
            </div>
          {/* </div> */}

          {/* <div className="col-lg-4"> */}
            <div className="chart-item">
              <h4 className="font-weight-bold text-center">Usia Drivers</h4>
              <div className="d-flex justify-content-center">
                <PayChart drivers={ drivers } />
              </div>
            </div>
          </div>
        {/* </div> */}

          {/* </div> */}
  
          <div className="pt-4 pb-1">
            <Footer />
          </div>
        </div>
      </>
    );
  };
  
  export default Dashboard;