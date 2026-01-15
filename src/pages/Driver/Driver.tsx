import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pagination } from "react-bootstrap";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ApiConfig from "@app/libs/Api";
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
  employment_status?: 'jobholder' | 'temporary';
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
  employment_status?: 'jobholder' | 'temporary';
}

type FilterType = 'jobholder' | 'temporary';

const Driver: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<DriverData[]>([]);
  const [filteredData, setFilteredData] = useState<DriverData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [idCompany, setIdCompany] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [jumlahDriver50TahunKeAtas, setJumlahDriver50TahunKeAtas] = useState(0);
  const [activeFilter, setActiveFilter] = useState<FilterType>('jobholder');

  // State untuk statistik
  const [jobholderCount, setJobholderCount] = useState(0);
  const [temporaryCount, setTemporaryCount] = useState(0);
  const [filteredDriver50Plus, setFilteredDriver50Plus] = useState(0);

  useEffect(() => {
    console.log("open the use effect");
  }, []);

  useEffect(() => {
    console.log("open the use effect after ID");
    const getDataDriver = async () => {
      setIsLoading(true);
      try {
        const response = await ApiConfig.get(`drivers_company/${idCompany}`);
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
              id: driver.id,
              alamatLengkap: driver.ktp_address || "",
              company_name: driver.company_name || "",
              employment_status: driver.employment_status || 'jobholder'
            })
          );

          const jumlahDriver50TahunKeAtas = drivers.filter(
            (driver) => driver.usia >= 51
          ).length;

          // Hitung statistik employment status dari semua data (bukan yang difilter)
          const allJobholders = drivers.filter(d => d.employment_status === 'jobholder').length;
          const allTemporary = drivers.filter(d => d.employment_status === 'temporary').length;
          const allDriver50Plus = drivers.filter(driver => driver.usia >= 51).length;

          setData(drivers);
          setFilteredData(drivers.filter(d => d.employment_status === 'jobholder')); // Default filter jobholder
          
          // Set statistik awal (semua data)
          setJobholderCount(allJobholders);
          setTemporaryCount(allTemporary);
          setFilteredDriver50Plus(allDriver50Plus);
          setJumlahDriver50TahunKeAtas(allDriver50Plus);
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

  // Filter data berdasarkan employment status dan update statistik
  useEffect(() => {
    let filtered = data;
    
    if (activeFilter === 'jobholder') {
      filtered = data.filter(driver => driver.employment_status === 'jobholder');
    } else if (activeFilter === 'temporary') {
      filtered = data.filter(driver => driver.employment_status === 'temporary');
    }
    
    // Re-number the filtered data
    filtered = filtered.map((driver, index) => ({
      ...driver,
      no: index + 1
    }));
    
    // Update statistik berdasarkan data yang difilter
    const filteredJobholders = filtered.filter(d => d.employment_status === 'jobholder').length;
    const filteredTemporary = filtered.filter(d => d.employment_status === 'temporary').length;
    const filteredDriver50TahunKeAtas = filtered.filter(driver => driver.usia >= 51).length;
    
    setFilteredData(filtered);
    setJobholderCount(filteredJobholders);
    setTemporaryCount(filteredTemporary);
    setFilteredDriver50Plus(filteredDriver50TahunKeAtas);
    setCurrentPage(1); // Reset to first page when filter changes
  }, [activeFilter, data]);

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
  };

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
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const detaildriver = (id: any, nama_lengkap: any, photo: any, alamat: any, handphone: any, company_name: any) => {
    localStorage.setItem('getdatadriver', JSON.stringify({
      id,
      nama_lengkap,
      photo,
      alamat,
      handphone,
      company_name
    }));
    console.log("cekprofildriverkjdgshfkjwhdfjs", localStorage.getItem('getdatadriver'));

    navigate('/admin/profil_driver');
  };

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
            transform: scale(1.05);
          }

          #driver, #driver50, #jobholder, #temporary {
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

          #jobholder {
            background-color: #007acc;
          }

          #temporary {
            background-color: #ff6b35;
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

          .employment-badge {
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 12px;
            font-weight: bold;
          }

          .badge-jobholder {
            background-color: #007acc;
            color: white;
          }

          .badge-temporary {
            background-color: #ff6b35;
            color: white;
          }

          .form-select:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(0, 152, 121, 0.25);
          }
        `}
      </style>

      {/* Statistics Cards - Dinamis berdasarkan filter */}
      <div className="d-flex mt-3 ml-4 mb-3 flex-wrap">
        <div
          className="info-box d-flex flex-column align-items-center hover py-4"
          id="driver"
        >
          <h1 className="font-weight-bold text-uppercase text-light">
            {filteredData.length}
          </h1>
          <p className="font-weight-bold text-uppercase text-light">
            {activeFilter === 'jobholder' ? 'Jobholder Driver' : 'Temporary Driver'}
          </p>
        </div>

        <div
          className="info-box d-flex flex-column align-items-center hover py-4 ml-4"
          id="driver50"
        >
          <h1 className="text-light font-weight-bold text-uppercase">
            {filteredDriver50Plus}
          </h1>
          <p className="text-light font-weight-bold text-uppercase">
            Driver 50+ Tahun
          </p>
        </div>
      </div>

      <div className="p-4">
        {/* Filter Dropdown */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <label htmlFor="employmentFilter" className="mr-3 font-weight-bold">
              Type:
            </label>
            <select
              id="employmentFilter"
              className="form-select"
              value={activeFilter}
              onChange={(e) => handleFilterChange(e.target.value as FilterType)}
              style={{
                padding: '8px 12px',
                border: '2px solid #009879',
                borderRadius: '5px',
                backgroundColor: 'white',
                color: '#009879',
                fontWeight: 'bold',
                minWidth: '200px'
              }}
            >
              <option value="jobholder">Jobholder ({data.filter(d => d.employment_status === 'jobholder').length})</option>
              <option value="temporary">Temporary ({data.filter(d => d.employment_status === 'temporary').length})</option>
            </select>
          </div>
        
        </div>

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
                  <td colSpan={7} className="text-center">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="text-center">
                    {error}
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center">
                    Tidak ada data untuk filter "{activeFilter}"
                  </td>
                </tr>
              ) : (
                currentItems.map((item: any) => (
                  <tr key={item.id}>
                    <th scope="row" className="text-center align-middle nowrap">
                      {item.no}
                    </th>
                    <td className="text-center align-middle nowrap">
                      <span
                        onClick={() =>
                          idCompany === "33"
                            ? detaildriver(
                                item.id,
                                item.namaLengkap,
                                item.foto,
                                item.alamatLengkap,
                                item.handphone,
                                item.company_name
                              )
                            : null
                        }
                        style={{
                          cursor: idCompany === "33" ? 'pointer' : 'default',
                          color: idCompany === "33" ? 'blue' : 'gray',
                        }}
                      >
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
                    <td className="align-middle">{item.alamatLengkap}</td>
                    <td className="align-middle">{item.company_name}</td>
                    
                  </tr>
                ))
              )}
            </tbody>
          </table>
          
          {/* Pagination */}
          {filteredData.length > 0 && (
            <div className="pagination">
              <Pagination>
                <Pagination.Prev
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                />
                {[...Array(Math.ceil(filteredData.length / itemsPerPage)).keys()].map(
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
                  disabled={indexOfLastItem >= filteredData.length}
                />
              </Pagination>
            </div>
          )}
        </div>
        <Footer/>
      </div>
    </>
  );
};

export default Driver;