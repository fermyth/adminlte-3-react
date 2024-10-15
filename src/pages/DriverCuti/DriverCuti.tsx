import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pagination } from "react-bootstrap";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ApiConfig, { UrlServerLaravel } from "@app/libs/Api";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../Footer";

interface DriverApiResponse {
  id: any;
  photo: string;
  full_name: string;
  birthdate: string;
  phone_number: string;
  ktp_address: string;
  company_name: string;
}

interface DriverData {
  id: number;
  no: number;
  foto: string;
  namaLengkap: string;
  usia: number;
  handphone: string;
  alamatLengkap: string;
  company_name: string;
}

const DriverCuti: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<DriverData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [idCompany, setIdCompany] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const url_backend = UrlServerLaravel();

  useEffect(() => {
    console.log("open the use effect");
  }, []);

  useEffect(() => {
    console.log("open the use effect after ID");
    const getDataDriver = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${url_backend}/data_driver_cuti_company/${idCompany}`
        );

        console.log("response.data.data:", response.data);

        if (response) {
          const drivers: DriverData[] = response.data.data.map(
            (driver: DriverApiResponse, index: number): DriverData => ({
              no: index + 1,
              employee_id_driver_cuti: driver.employee_id_driver_cuti,
              nama_driver_cuti: driver.nama_driver_cuti,
              no_hp_cuti: driver.no_hp_cuti,
              nama_perusahaan: driver.nama_perusahaan,
              start_date: driver.start_date || "",
              end_date: driver.end_date || "",
              reason: driver.reason,
              driver_pengganti: driver.employee_id_driver_pengganti === null ? "Tidak" : "Ya",
              employee_id_driver_pengganti: driver.employee_id_driver_pengganti,
              no_hp_pengganti_wa: driver.no_hp_pengganti_wa,
              nama_driver_pengganti: driver.nama_driver_pengganti


            })
          );
          const jumlahDriver50TahunKeAtas = drivers.filter(
            (driver) => driver.usia >= 51
          ).length;

          setData(drivers);
          console.log("response.data.data222:", drivers);
          setIsLoading(false);
        }
      } catch (err) {
        setError("Failed to fetch data");
        setIsLoading(false);
      }
    };

    if (idCompany) {
      getDataDriver();
    }
  }, [idCompany]);

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
        setIsLoading(false);
      } catch (error) {
        setError("Failed to fetch data");
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);


  
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const itemsPerPage = 20;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <style>
        {`
          .table-bordered {
            border-radius: 15px 15px 0 0;
            border-top: 1px solid #009879;
            overflow: hidden;
          }
          .table tbody tr:last-of-type {
            border-bottom: 2px solid #009879;
          }
          .hover {
            transition: all 0.3s ease;
          }

          .hover:hover {
            transform: scale(1.1);
          }

          #driver, #driver50 {
            width: 30%;
            border-radius: 5px;
            cursor: pointer;
          }

          #driver {
            background-color: #009879;
          }

          #driver50 {
            background-color: #009879;
          }
              .pagination {
            display: flex;
            justify-content: center;
            padding-bottom: 20px;
          }

          .page-item .page-link {
            color: #009879;
            border: 1px solid #009879;
          }

          .page-item.active .page-link {
            background-color: #009879;
            border-color: #009879;
          }
          .info-box {
            background-color: #009879;
            border-radius: 10px;
            color: white;
            padding: 20px;
            text-align: center;
            width: 100%;
            margin: 10px;
            transition: transform 0.3s ease-in-out;
          }

          .info-box:hover {
            transform: scale(1.05);
          }

          .table-bordered th, .table-bordered td {
            vertical-align: middle;
          } 
        `}
      </style>
      
      <div className="p-4">
        <div className="table-responsive">
          <center><h1>Driver Cuti</h1></center>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="text-center align-middle nowrap"
                  style={{ backgroundColor: "#009879", color: "white" }}
                >
                  No
                </th>
                <th
                  scope="col"
                  className="text-center align-middle nowrap"
                  style={{ backgroundColor: "#009879", color: "white" }}
                >
                  ID Driver Cuti
                </th>
                <th
                  scope="col"
                  className="text-center align-middle nowrap"
                  style={{ backgroundColor: "#009879", color: "white" }}
                >
                  Nama Driver Cuti
                </th>
                <th
                  scope="col"
                  className="text-center align-middle nowrap"
                  style={{ backgroundColor: "#009879", color: "white" }}
                >
                  No. Handphone Driver Cuti
                </th>
                <th
                  scope="col"
                  className="text-center align-middle nowrap"
                  style={{ backgroundColor: "#009879", color: "white" }}
                >
                  Nama Perusahaan
                </th>
                <th
                  scope="col"
                  className="text-center align-middle nowrap"
                  style={{ backgroundColor: "#009879", color: "white" }}
                >
                  Mulai Cuti
                </th>
                <th
                  scope="col"
                  className="text-center align-middle nowrap"
                  style={{ backgroundColor: "#009879", color: "white" }}
                >
                  Tanggal Masuk Kembali
                </th>
                <th
                  scope="col"
                  className="text-center align-middle nowrap"
                  style={{ backgroundColor: "#009879", color: "white" }}
                >
                  Alasan Cuti
                </th>
                <th
                  scope="col"
                  className="text-center align-middle nowrap"
                  style={{ backgroundColor: "#009879", color: "white" }}
                >
                  Butuh Driver Pengganti
                </th>
                <th
                  scope="col"
                  className="text-center align-middle nowrap"
                  style={{ backgroundColor: "#009879", color: "white" }}
                >
                  ID Driver Pengganti
                </th>
                <th
                  scope="col"
                  className="text-center align-middle nowrap"
                  style={{ backgroundColor: "#009879", color: "white" }}
                >
                  No. Handphone Driver Pengganti
                </th>
                <th
                  scope="col"
                  className="text-center align-middle nowrap"
                  style={{ backgroundColor: "#009879", color: "white" }}
                >
                  Nama Driver Pengganti
                </th>
               
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={12} className="text-center">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={12} className="text-center">
                    {error}
                  </td>
                </tr>
              ) : (
                currentItems.map((item: any) => (
                  <tr key={item.no}>
                    <th scope="row" className="text-center align-middle nowrap">
                      {item.no}
                    </th>
                    <td className="text-center align-middle nowrap">
                      {item.employee_id_driver_cuti}
                    </td>
                    <td className="text-center align-middle nowrap">
                      {item.nama_driver_cuti}
                    </td>

                    
                    <td className="text-center align-middle nowrap">
                      {item.no_hp_cuti}
                    </td>
                    <td className="text-center align-middle nowrap">
                      {item.nama_perusahaan}
                    </td>
                    <td className="text-center align-middle nowrap">
                      {item.start_date}
                    </td>
                    <td className="align-middle ">{item.end_date}</td>
                    <td className="align-middle ">{item.reason}</td>
                    <td className="align-middle ">{item.driver_pengganti}</td>
                    <td className="align-middle ">{item.employee_id_driver_pengganti}</td>
                    <td className="align-middle ">{item.no_hp_pengganti_wa}</td>
                    <td className="align-middle ">{item.nama_driver_pengganti}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {/* Pagination */}
          <div className="pagination">
            <Pagination>
              <Pagination.Prev
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              />
              {[...Array(Math.ceil(data.length / itemsPerPage)).keys()].map(
                (number) => (
                  <Pagination.Item
                    key={number + 1}
                    active={number + 1 === currentPage}
                    onClick={() => handlePageChange(number + 1)}
                  >
                    {number + 1}
                  </Pagination.Item>
                )
              )}
              <Pagination.Next
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={indexOfLastItem >= data.length}
              />
            </Pagination>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default DriverCuti;