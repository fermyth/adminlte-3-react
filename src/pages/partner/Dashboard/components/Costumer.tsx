import "bootstrap/dist/css/bootstrap.min.css";
import ChartComponent from "./Cart";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { toast } from "react-toastify";
import { UrlServer } from "@app/libs/Api";

interface Company {
  id: number;
  nama_perusahaan: string;
  alamat: string;
  kontak: string;
  email: string;
  image?: string;
  _count: {
    tb_mobil: number;
  };
  partnerId?: number;
  createdAt?: string;
  updatedAt?: string;
}

const CustomerList = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [idCompany, setIdCompany] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const url = UrlServer()
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // get id company
        const userData = await AsyncStorage.getItem("userData");
        if (userData) {
          const getstorage = JSON.parse(userData);
          setIdCompany(getstorage.id_company);
        } else {
          setIdCompany(null);
        }
      } catch (error) {
        setError("Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (idCompany) {
      const fetchCompanies = async () => {
        try {
          const response = await fetch(
            `${url}/perusahaan/${idCompany}`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data: { perusahaanList: Company[] } = await response.json();
          console.log("adada", data);

          setCompanies(data.perusahaanList);
        } catch (error) {
          console.error("Failed to fetch companies:", error);
          toast.error("Gagal memuat data perusahaan.");
        }
      };

      fetchCompanies();
    }
  }, [idCompany, location.key]);

  // Pisahkan data terbaru dan sisanya
  const sortedCompanies = [...companies].sort((a, b) => {
    return new Date(b.updatedAt ?? "").getTime() - new Date(a.updatedAt ?? "").getTime();
  });

  const latestFour = sortedCompanies.slice(0, 4);
  const hasMore = sortedCompanies.length > 4;

  return (
    <div className="container d-flex justify-content-center align-items-center">
      <style>
        {`
            .table-bordered{
            border-radius: 15px 15px 0 0;
            border-top: 1px solid #009879;
            overflow: hidden;
          }
             .table tbody tr:last-of-type {
            border-bottom: 2px solid #009879;
          }
          .more-info {
            background-color: #f8f9fa;
            color: #039be5;
            font-weight: bold;
            cursor: pointer;
            padding: 10px;
            border-radius: 0 0 15px 15px;
          }
          .more-info:hover {
            background-color: #e9ecef;
          }
          .more-text {
            font-size: 14px;
            color: #039be5;
          }
        `}
      </style>
      <div className="row" style={{ width: "100%" }}>
        <div className="col">
          <div className="card-header text-dark">Customer</div>
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th
                  scope="col"
                  style={{ backgroundColor: "#009879", color: "white" }}
                >
                  Nama Pelanggan
                </th>
                <th
                  scope="col"
                  style={{ backgroundColor: "#009879", color: "white" }}
                >
                  Jumlah Kendaraan
                </th>
              </tr>
            </thead>
            <tbody>
              {latestFour.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.nama_perusahaan}</td>
                  <td>
                    <Link
                      to="/partner-dashboard/customer"
                      className="text-dark hover font-weight-bold"
                    >
                      {customer._count.tb_mobil} Vehicle
                    </Link>
                  </td>
                </tr>
              ))}
              {hasMore && (
                <tr>
                  <td colSpan={2} className="more-info">
                    <span style={{ cursor: "pointer", color: "blue" }}>Lainnya ....</span>
                    
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="col">
          <ChartComponent customers={latestFour.map(c => ({ name: c.nama_perusahaan, vehicles: c._count.tb_mobil }))} />
        </div>
    </div>
  );
};

export default CustomerList;
