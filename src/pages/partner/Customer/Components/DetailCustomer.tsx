import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Table, Button, Row, Col } from "react-bootstrap";

import ApiConfig from "@app/libs/Api";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";

interface DriverApiResponse {
  id: number;
  full_name: string;
  no_hp: string;
}

interface DriverData {
  id: number;
  full_name: string;
  no_hp: string;
}

const CustomerDetail: React.FC = () => {
  const navigate = useNavigate();
  const [idcustomer, setidcustomer] = useState(null);
  const [nama_customer, setnamacustomer] = useState(null);
  const [no_hp, setno_hp] = useState(null);

  const [drivers, setDrivers] = useState<DriverData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [idCompany, setIdCompany] = useState<string | null>(null);
  const [idperusahaan, setidperusahaan] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [alamat, setalamat] = useState(null);
  const [kontak, setkontak] = useState(null);
  const [logo_perusahaan, setLogoPerusahaan] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const datausers = localStorage.getItem("selecteddataCompany");
        // console.log('ceklagi',datausers);
        if (datausers) {
          const parsejson = JSON.parse(datausers);
          console.log("cekcekcek", parsejson);
          setidcustomer(parsejson.idcomp);
          setnamacustomer(parsejson.nama_customer);
          setno_hp(parsejson.no_hp);
          setidperusahaan(parsejson.idperusahaan);
          setalamat(parsejson.alamat);
          setkontak(parsejson.kontak);
          setLogoPerusahaan(parsejson.image);
        }
      } catch (error) {
        console.error("Error parsing JSON from localStorage:", error);
      }
      try {
        // Get id company from AsyncStorage
        const userData = await AsyncStorage.getItem("userData");
        if (userData) {
          const parsedData = JSON.parse(userData);

          setIdCompany(parsedData.id_company);
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
  }, []);

  // useEffect(() => {
  //   if (idcustomer) {
  //     const getDataDriver = async () => {
  //       setIsLoading(true);

  //       try {
  //         // alert(idcustomer)
  //         const response = await ApiConfig.get(`drivers/${idcustomer}`);
  //         console.log("cekresdriver", response);
  //         const drivers: DriverData[] = response.data.data.map(
  //           (driver: DriverApiResponse): DriverData => ({
  //             id: driver.id,
  //             full_name: driver.full_name,
  //             no_hp: driver.no_hp,
  //             photo: driver.photo,
  //             home_address: driver.home_address,
  //             phone_number: driver.phone_number,
  //           })
  //         );
  //         setDrivers(drivers);
  //         setIsLoading(false);
  //       } catch (err) {
  //         setError("Failed to fetch driver data");
  //         setIsLoading(false);
  //       }
  //     };

  //     getDataDriver();
  //   }
  // }, [idcustomer]);

  useEffect(() => {
    if (idcustomer) {
      const getDataDriver = async () => {
        setIsLoading(true);
        try {
          const driversResponse = await ApiConfig.get(
            `https://api_partner_staging.sigapdriver.com/api/v1/mobil/${idperusahaan}`
          );
          console.log("Drivers response:", driversResponse.data);

          const fullNamesResponse = await ApiConfig.get(
            `https://api_portal_staging.sigapdriver.com/api/v1/nopoldriver/`
          );
          const fullNamesData = fullNamesResponse.data.data.data;

          if (!Array.isArray(fullNamesData)) {
            throw new Error("Full names data is not an array");
          }

          const combinedData = driversResponse.data.map((driver: any) => {
            const fullName = fullNamesData.find(
              (name: any) => name.nopol === driver.nopol
            );
            return {
              ...driver,
              fullName: fullName ? fullName.full_name : "Unknown",
              phoneNumber: fullName ? fullName.phone_number : "N/A",
              photo: fullName
                ? fullName.photo
                : "https://via.placeholder.com/300.png?text=No+Photo",
              homeAddress: fullName ? fullName.home_address : "N/A",
              fullNameId: fullName ? fullName.id : "N/A",
            };
          });

          console.log("Combined data:", combinedData);
          setDrivers(combinedData);
        } catch (err) {
          console.error("Error fetching driver data:", err);
          setError("Failed to fetch driver data");
        } finally {
          setIsLoading(false);
        }
      };
      getDataDriver();
    }
  }, [idcustomer, idperusahaan]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const itemsPerPage = 20;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = drivers.slice(indexOfFirstItem, indexOfLastItem);

  const detaildriver = (
    id: any,
    nama_lengkap: any,
    photo: any,
    alamat: any,
    no_hp: any
  ) => {
    // alert(photo)
    localStorage.setItem(
      "getdatadriverpartner",
      JSON.stringify({ id, nama_lengkap, photo, alamat, no_hp })
    );
    navigate(
      "/partner-dashboard/customer/costumer-detail/detail-profile-partner"
    );
  };

  return (
    <>
      <div className="container mt-3 mb-2">
        <Link to="/partner-dashboard">Back To Dashboard</Link>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm bg-light">
              <div className="card-body text-center">
                <img src={logo_perusahaan} className="img" width={300} />
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm bg-light">
              <div className="card-body">
                <h5 className="card-title text-primary">
                  {nama_customer} {idcustomer}
                </h5>
                <p className="card-text mb-1">{kontak}</p>
                <p className="card-text mb-1">{alamat}</p>
                {/* <p className="card-text mb-0">DKI Jakarta</p> */}
              </div>
            </div>
          </div>
          <div className="col-md-4"></div>
        </div>
        {/* <h2 className="mt-5 text-dark font-weight-bold">List Kendaraan</h2> */}
        <div className="">
          <Row className="mb-4">
            <Col>
              <h1 className="text-dark font-weight-bold">Mobil Perusahaan</h1>
            </Col>
            <Col className="text-right">
              <Link
                to={`/partner-dashboard/add-mobil-partner/${idperusahaan}`}
                className="btn btn-success d-inline-flex align-items-center font-weight-bold"
              >
                <FaPlus className="mr-1" /> Create
              </Link>
            </Col>
          </Row>
          <table className="table table-bordered mt-3">
            <thead>
              <tr>
                <th
                  scope="col"
                  style={{ backgroundColor: "#009879", color: "white" }}
                >
                  No
                </th>
                <th
                  scope="col"
                  style={{ backgroundColor: "#009879", color: "white" }}
                >
                  Police Number
                </th>
                <th
                  scope="col"
                  style={{ backgroundColor: "#009879", color: "white" }}
                >
                  Unit Type
                </th>
                <th
                  scope="col"
                  style={{ backgroundColor: "#009879", color: "white" }}
                >
                  Contract End
                </th>
                <th
                  scope="col"
                  style={{ backgroundColor: "#009879", color: "white" }}
                >
                  Rent Price
                </th>
                <th
                  scope="col"
                  style={{ backgroundColor: "#009879", color: "white" }}
                >
                  KM
                </th>
                <th
                  scope="col"
                  style={{ backgroundColor: "#009879", color: "white" }}
                >
                  Uji Emisi
                </th>
                <th
                  scope="col"
                  style={{ backgroundColor: "#009879", color: "white" }}
                >
                  Nama Driver
                </th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((vehicle, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <Link
                      to={`/partner-dashboard/customer/costumer-detail/detail-mobil/${vehicle.nopol}`}
                    >
                      {vehicle.nopol}
                    </Link>
                  </td>
                  <td> {vehicle.tipe_kendaraan}</td>
                  <td>{vehicle.contract_end}</td>
                  <td>{vehicle.biaya_sewa}</td>
                  <td></td>
                  <td>{vehicle?.tb_jadwal?.[0]?.status ?? null}</td>
                  <td>
                    <span
                      onClick={() =>
                        detaildriver(
                          vehicle.fullNameId ?? null,
                          vehicle.fullName ?? null,
                          vehicle.photo ?? null,
                          vehicle.homeAddress ?? null,
                          vehicle.phoneNumber ?? null
                        )
                      }
                      style={{ cursor: "pointer", color: "blue" }}
                    >
                      {vehicle.fullName === "Unknown" ? null : vehicle.fullName}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
            `}
        </style>
      </div>
    </>
  );
};

export default CustomerDetail;
