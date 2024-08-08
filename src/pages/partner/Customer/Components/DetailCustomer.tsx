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
          // alert(idcustomer)
          const response = await ApiConfig.get(`http://localhost:5182/api/v1/mobil/${idperusahaan}`);
          console.log("cekresdriver", response.data);
          setDrivers(response.data);
          setIsLoading(false);
        } catch (err) {
          setError("Failed to fetch driver data");
          setIsLoading(false);
        }
      };

      getDataDriver();
    }
  }, [idcustomer]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const itemsPerPage = 20;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = drivers.slice(indexOfFirstItem, indexOfLastItem);

  const vehicles = [
    {
      no: 1,
      policeNumber: "B1233KD",
      unitType: "Toyota Avanza 2018",
      contractEnd: "20 June 2025",
      rentPrice: "8,400,000",
      km: "2,300",
      ujiEmisi: "11 Nov 2023",
      driverId: 1, // ID Driver untuk data ini
    },
    {
      no: 2,
      policeNumber: "B1234KD",
      unitType: "Honda CR-V 2020",
      contractEnd: "15 July 2024",
      rentPrice: "10,000,000",
      km: "5,000",
      ujiEmisi: "30 Nov 2023",
      driverId: 2, // ID Driver untuk data ini
    },
    // Tambahkan data kendaraan lainnya sesuai kebutuhan
  ];

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
                <svg width="100" height="100">
                  <circle cx="50" cy="50" r="40" fill="#673AB7" />
                  <circle cx="50" cy="50" r="30" fill="#FFC107" />
                  <circle cx="50" cy="50" r="20" fill="#2196F3" />
                  <circle cx="50" cy="50" r="10" fill="#F44336" />
                </svg>
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
                <p className="card-text mb-1">
                {alamat}
                </p>
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
                  <td></td>
                  <td>
                    {isLoading ? (
                      "Loading..."
                    ) : error ? (
                      "Error loading driver"
                    ) : (
                      <span
                        onClick={() =>
                          detaildriver(
                            vehicle.id,
                            vehicle.full_name,
                            vehicle.photo,
                            vehicle.home_address,
                            vehicle.phone_number
                          )
                        }
                        style={{ cursor: "pointer", color: "blue" }}
                      >
                        {vehicle.full_name}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <style>
          {
            `
            .table-bordered {
            border-radius: 15px 15px 0 0;
            border-top: 1px solid #009879;
            overflow: hidden;
          }
          .table tbody tr:last-of-type {
            border-bottom: 2px solid #009879;
          }
            `
          }
        </style>
      </div>
    </>
  );
};

export default CustomerDetail;
