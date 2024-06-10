import { useEffect, useState } from "react";
import axios from "axios";
import MyChart from "./Cart"; 

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

const Dashboard = () => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [invoiceData, setInvoiceData] = useState<InvoiceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getPortal = async () => {
    try {
      const response = await axios.get("https://backend.sigapdriver.com/api/getCompanyInfo/33");
      setCompanyInfo(response.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching company info:", error);
      setIsLoading(false);
    }
  };

  const getInvoices = async () => {
    try {
      const response = await axios.get("https://backend.sigapdriver.com/api/getLatestInvoice/33");
      if (response.data.success) {
        setInvoiceData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  useEffect(() => {
    getPortal();
    getInvoices();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!companyInfo) {
    return <div>Error loading company info</div>;
  }

  const addressLines = companyInfo.company_address.split('<p>').filter(line => line).map(line => line.replace('</p>', '').replace('\r\n', ''));

  const labels = invoiceData.map(invoice => invoice.periode);
  const data = invoiceData.map(invoice => 
    parseFloat(invoice.grand_total_value_inv_A) + parseFloat(invoice.grand_total_value_inv_B)
  );

  const latestInvoice = invoiceData.length > 0 ? invoiceData[0] : null;
  const latestTotalInvoiceValue = latestInvoice 
    ? parseFloat(latestInvoice.grand_total_value_inv_A) + parseFloat(latestInvoice.grand_total_value_inv_B) 
    : 0;

  return (
    <div>
      <div className="d-flex">  
        <div className="info-box w-50 d-flex flex-column mr-4">
          <div className="d-flex ml-3">
            <p className="font-weight-bold text-black text-uppercase">
              Nama PT
            </p>
            <p className="ml-4 font-weight-bold text-black text-uppercase">
              {companyInfo.company_name}
            </p>
          </div>  
          <div className="d-flex ml-3">
            <p className="font-weight-bold text-black text-uppercase">
              Alamat
            </p>
            <div>
              {addressLines.map((line, index) => (
                <p key={index} className="ml-4 font-weight-bold text-black text-uppercase">
                  {line}
                </p>
              ))}
            </div>
          </div>   
        </div> 
        <div className="info-box w-50 mr-2 bg-black d-flex flex-column align-items-center justify-content-center">
          <p className="font-weight-bold text-light text-uppercase">
            {latestInvoice ? latestInvoice.periode : "Loading..."}
          </p>
          <h1 className="font-weight-bold text-light text-uppercase">
            {latestInvoice ? latestTotalInvoiceValue.toLocaleString() : "Loading..."}
          </h1>
          <h1 className="text-light" style={{ fontSize: "25px", fontWeight: "bold" }}>
            Jumlah Invoice Terakhir
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
