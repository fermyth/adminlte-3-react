import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pagination } from "react-bootstrap";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ApiConfig from "@app/libs/Api";
import { Link,useNavigate } from "react-router-dom";
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
  id:number;
  no: number;
  foto: string;
  namaLengkap: string;
  usia: number;
  handphone: string;
  alamatLengkap: string;
  company_name: string;
}

const DriverTimeSheets: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<DriverData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [idCompany, setIdCompany] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [jumlahDriver50TahunKeAtas, setJumlahDriver50TahunKeAtas] = useState(0);

  useEffect(() => {
    console.log("open the use effect");
  }, []);

  useEffect(() => {
    console.log("open the use effect after ID");
    const getDataDriver = async () => {
      setIsLoading(true);
      try {
        const response = await ApiConfig.get(`drivers/${idCompany}`);

        console.log("response.data.data:", response.data);

        if (response) {
          const drivers: DriverData[] = response.data.data.map(
            (driver: DriverApiResponse, index: number): DriverData => ({
              no: index + 1,
              foto:
                viewPhoto(driver.photo) ||
                "https://portal.sigapdriver.com/icon_admin.png",
              namaLengkap: driver.full_name,
              usia: calculateAge(driver.birthdate),
              handphone: driver.phone_number,
              id:driver.id,
              alamatLengkap: driver.ktp_address || "",
              company_name: driver.company_name || "",
            })
          );
          const jumlahDriver50TahunKeAtas = drivers.filter(
            (driver) => driver.usia >= 51
          ).length;

          setData(drivers);
          console.log("response.data.data222:", drivers);
          setJumlahDriver50TahunKeAtas(jumlahDriver50TahunKeAtas);
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

  const viewPhoto = (photoAddress: string | null) => {
    if (photoAddress === null || typeof photoAddress !== "string") {
      return "https://portal.sigapdriver.com/icon_admin.png";
    }

    if (photoAddress.indexOf("ttp") < 0) {
      return "http://operation.sigapps.com/" + photoAddress;
    } else {
      return photoAddress;
    }
  };

  const calculateAge = (birthdate: string) => {
    const today = new Date();
    const dob = new Date(birthdate);
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };
 
  const getAgeColor = (age: number) => {
    if (age >= 51 && age <= 55) {
      return "orange";
    } else if (age > 55) {
      return "red";
    } else {
      return "black";
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const itemsPerPage = 20;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);


  const detaildriver =(id : any ,nama_lengkap : any ,photo : any,alamat : any ,no_hp : any , company_name : any) =>{
   // alert(id)
    localStorage.setItem('getdatadriver', JSON.stringify({id,nama_lengkap,photo,alamat,no_hp}));
    navigate('/admin/profil_driver');
  }

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
      <div className="d-flex mt-3 ml-4 mb-3 ">
        <div
          className="info-box d-flex flex-column align-items-center hover py-4"
          id="driver"
        >
          <h1 className="font-weight-bold text-uppercase text-light">
            {data.length}
          </h1>
          <p className="font-weight-bold text-uppercase text-light">
            Jumlah Driver
          </p>
        </div>
        <div
          className="info-box d-flex flex-column align-items-center hover py-4 ml-4"
          id="driver50"
        >
          <h1 className="text-light font-weight-bold text-uppercase">
            {jumlahDriver50TahunKeAtas}
          </h1>
          <p className="text-light font-weight-bold text-uppercase">
            Jumlah Driver 50 Tahun Ke atas
          </p>
        </div>
      </div>
      <div className="p-4">
        <div className="table-responsive">
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
                  Foto
                </th>
                <th
                  scope="col"
                  className="text-center align-middle nowrap"
                  style={{ backgroundColor: "#009879", color: "white" }}
                >
                  Nama Lengkap
                </th>
                <th
                  scope="col"
                  className="text-center align-middle nowrap"
                  style={{ backgroundColor: "#009879", color: "white" }}
                >
                  Usia
                </th>
                <th
                  scope="col"
                  className="text-center align-middle nowrap"
                  style={{ backgroundColor: "#009879", color: "white" }}
                >
                  Nomor Handphone
                </th>
                <th
                  scope="col"
                  className="text-center align-middle nowrap"
                  style={{ backgroundColor: "#009879", color: "white" }}
                >
                  Alamat Lengkap
                </th>
                <th
                  scope="col"
                  className="text-center align-middle nowrap"
                  style={{ backgroundColor: "#009879", color: "white" }}
                >
                  Status Perusahaan
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="text-center">
                    {error}
                  </td>
                </tr>
              ) : (
                currentItems.map((item : any) => (
                  <tr key={item.no}>
                    <th scope="row" className="text-center align-middle nowrap">
                      {item.no}
                    </th>
                    <td className="text-center align-middle nowrap">
                      <img
                        src={item.foto}
                        alt="Foto"
                        className="img-fluid"
                        style={{ width: "50px", height: "50px" }}
                      />
                    </td>
                    <td className="text-center align-middle nowrap">
                    <span onClick={()=>detaildriver(
                      item.id,
                      item.namaLengkap,
                      item.foto,
                      item.alamatLengkap,
                      item.company_name,
                      item.handphone
                      
                      )} style={{ cursor: 'pointer', color: 'blue' }}>
                      {item.namaLengkap}
                    </span>
                    </td>
                    <td
                      className="text-center align-middle nowrap"
                      style={{
                        fontWeight: "bold",
                        color: getAgeColor(item.usia),
                      }}
                    >
                      {item.usia}
                    </td>
                    <td className="text-center align-middle nowrap">
                      {item.handphone}
                    </td>
                    <td className="align-middle ">{item.alamatLengkap}</td>
                    <td className="align-middle ">{item.company_name}</td>
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
        <Footer/>
      </div>
    </>
  );
};

export default DriverTimeSheets;
