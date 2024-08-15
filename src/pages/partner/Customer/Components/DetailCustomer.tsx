import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Table, Button, Row, Col } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ApiConfig from "@app/libs/Api";
import { FaEdit, FaTrashAlt, FaPlus, FaCar } from "react-icons/fa";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import { Dropdown, DropdownButton } from "react-bootstrap";

interface DriverApiResponse {
  id: number;
  full_name: string;
  no_hp: string;
}

interface DriverData {
  id: number;
  full_name: string;
  no_hp: string;
  nopol: string;
  tipe_kendaraan: string;
  contract_end: string;
  biaya_sewa: string;
  tb_jadwal: Array<{status: string}>;
  fullNameId: string | null;
  fullName: string | null;
  photo: string | null;
  homeAddress: string | null;
  phoneNumber: string | null;
}

const CustomerDetail: React.FC = () => {
  const navigate = useNavigate();
  const [idcustomer, setidcustomer] = useState<string | null>(null);
  const [nama_customer, setnamacustomer] = useState<string | null>(null);
  const [no_hp, setno_hp] = useState<string | null>(null);

  const [drivers, setDrivers] = useState<DriverData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [idCompany, setIdCompany] = useState<string | null>(null);
  const [idperusahaan, setidperusahaan] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [alamat, setalamat] = useState<string | null>(null);
  const [kontak, setkontak] = useState<string | null>(null);
  const [logo_perusahaan, setLogoPerusahaan] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const datausers = localStorage.getItem("selecteddataCompany");
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

  useEffect(() => {
    if (idcustomer) {
      const getDataDriver = async () => {
        setIsLoading(true);
        try {
          const driversResponse = await ApiConfig.get(
             `https://api_partner_staging.sigapdriver.com/api/v1/mobil/${idperusahaan}`
            // `http://localhost:5182/api/v1/mobil/${idperusahaan}`
          );
          console.log("Drivers response:", driversResponse.data);

          const fullNamesResponse = await ApiConfig.get(
             `https://api_portal_staging.sigapdriver.com/api/v1/nopoldriver/`
           // `http://localhost:5181/api/v1/nopoldriver/`
          );
          const fullNamesData = fullNamesResponse.data.data.data;
          console.log("Drivers responsedd:", fullNamesResponse);


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
    localStorage.setItem(
      "getdatadriverpartner",
      JSON.stringify({ id, nama_lengkap, photo, alamat, no_hp })
    );
    navigate(
      "/partner-dashboard/customer/costumer-detail/detail-profile-partner"
    );
  };

  const columns = [
    {
      dataField: "nopol",
      text: "Police Number",
      sort: true,
      formatter: (cell: string, row: DriverData) => (
        <Link to={`/partner-dashboard/customer/costumer-detail/detail-mobil/${cell}`}>
          {cell || "-"}
        </Link>
      ),
      headerStyle: { backgroundColor: "#009879", color: "white" },
    },
    {
      dataField: "tipe_kendaraan",
      text: "Unit Type",
      sort: true,
      formatter: (cell: string) => cell || "-",
      headerStyle: { backgroundColor: "#009879", color: "white" },
    },
    {
      dataField: "jangka_waktu_sewa",
      text: "Contract Start",
      sort: true,
      formatter: (cell: string) => cell || "-",
      headerStyle: { backgroundColor: "#009879", color: "white" },
    },
    {
      dataField: "contract_end",
      text: "Contract End",
      sort: true,
      formatter: (cell: string) => cell || "-",
      headerStyle: { backgroundColor: "#009879", color: "white" },
    },
    {
      dataField: "contract_end",
      text: "Remaining Contract",
      sort: true,
      formatter: (cell: string, row: any) => {
        if (!cell || !row.jangka_waktu_sewa) return "-";
        const endDate = new Date(cell);
        const startDate = new Date(row.jangka_waktu_sewa);
        const diffTime = Math.max(endDate.getTime() - startDate.getTime(), 0);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > 30) {
          const diffMonths = Math.floor(diffDays / 30);
          return `${diffMonths} Month`;
        } else {
          return `${diffDays} Day`;
        }
      },
      headerStyle: { backgroundColor: "#009879", color: "white" },
    },
    {
      dataField: "biaya_sewa",
      text: "Rent Price",
      sort: true,
      formatter: (cell: string) => {
        if (!cell) return "-";
        const number = parseFloat(cell);
        return isNaN(number) ? "-" : number.toLocaleString('id-ID', {style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 0});
      },
      headerStyle: { backgroundColor: "#009879", color: "white" },
    },
    {
      dataField: "km",
      text: "KM",
      sort: true,
      formatter: (cell: string) => cell || "-",
      headerStyle: { backgroundColor: "#009879", color: "white" },
    },
    {
      dataField: "tb_jadwal[0].status",
      text: "Uji Emisi",
      sort: true,
      formatter: (cell: string) => cell || "-",
      headerStyle: { backgroundColor: "#009879", color: "white" },
    },
    {
      dataField: "fullName",
      text: "Driver Name",
      sort: true,
      formatter: (cell: string, row: DriverData) => (
        <span
          onClick={() =>
            detaildriver(
              row.fullNameId,
              cell,
              row.photo,
              row.homeAddress,
              row.phoneNumber
            )
          }
          style={{ cursor: "pointer", color: "blue" }}
        >
          {cell === "Unknown" ? "-" : cell || "-"}
        </span>
      ),
      headerStyle: { backgroundColor: "#009879", color: "white" },
    },
  ];

  const { SearchBar } = Search;

  return (
    <>
      <div className="container">
        <br></br>
        <Link to="/partner-dashboard">Back To Dashboard</Link>
      </div>
      <div className="container-fluid" style={{padding:20}}>
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm bg-light" style={{minHeight: '200px', maxHeight: '300px'}}>
              <div className="card-body text-center d-flex align-items-center justify-content-center">
                {logo_perusahaan? (
                  <img src={logo_perusahaan} className="img-fluid" style={{maxWidth: '50%', maxHeight: '50%'}} alt="Company Logo" />
                ) : (
                  <img src='/public/company.jpg' className="img-fluid" style={{maxWidth: '50%', maxHeight: '50%'}} alt="Default Company Logo" />
                )}
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm bg-light" style={{minHeight: '200px', maxHeight: '300px'}}>
              <div className="card-body d-flex flex-column justify-content-center">
                <h5 className="card-title text-primary">
                  {nama_customer} {idcustomer}
                </h5>
                <p className="card-text mb-1">{kontak === '0' ? '' : kontak}</p>
                <p className="card-text mb-1">{alamat}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4"></div>
        </div>
        <div className="">
          <Row className="mb-4">
            <Col>
              <h1 className="text-dark font-weight-bold">Company Vehicles</h1>
            </Col>
            <Col className="text-right">
              <Link
                to={`/partner-dashboard/add-mobil-partner/${idperusahaan}`}
                className="btn btn-success d-inline-flex align-items-center font-weight-bold"
              >
                <FaPlus className="mr-1" /> Add New
              </Link>
            </Col>
          </Row>
          <ToolkitProvider
            keyField="nopol"
            data={drivers}
            columns={columns}
            search
          >
            {(props) => (
              <div>
                <div className="mb-3">
                  <SearchBar {...props.searchProps} placeholder="Search" className="form-control" />
                </div>
                <BootstrapTable
                  {...props.baseProps}
                  bootstrap4
                  striped
                  hover
                  bordered={false}
                  pagination={paginationFactory({
                    sizePerPage: 10,
                    showTotal: true,
                  })}
                  classes="table-bordered w-100"
                />
              </div>
            )}
          </ToolkitProvider>
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
      <ToastContainer />
    </>
  );
};

export default CustomerDetail;
