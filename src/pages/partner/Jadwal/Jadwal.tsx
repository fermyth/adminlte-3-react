import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocation } from "react-router-dom";
import { UrlServer,ApiPartner } from "@app/libs/Api";

interface Perusahaan {
  id: number;
  nama_perusahaan: string;
  alamat: string;
  kontak: string;
  partnerId: number;
  createdAt: string;
  updatedAt: string;
}

interface Mobil {
  id: number;
  tipe_kendaraan: string;
  pembuat: string;
  tahun: number;
  warna_kendaraan: string;
  nopol: string;
  nomor_rangka: string;
  nomor_mesin: string;
  pilihan_aksesoris: string;
  biaya_sewa: string;
  perusahaanId: number;
  photo1: string;
  photo2: string;
  photo3: string;
  photo4: string;
  createdAt: string;
  updatedAt: string;
  tb_perusahaan: Perusahaan;
}

interface Service {
  id: number;
  jadwal_service: string;
  nopol_customer: string;
  lokasi_service: string;
  type_service: string;
  status: string;
  actions: string;
  mobilId: number;
  createdAt: string;
  updatedAt: string;
  tb_mobil: Mobil;
  tgl_jadwal: string;
}

const Jadwal: React.FC = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [idCompany, setIdCompany] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const url = UrlServer()
  const url_partner = ApiPartner()

  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const userData = await AsyncStorage.getItem("userData");
        if (userData) {
          const getstorage = JSON.parse(userData);
          setIdCompany(getstorage.id_company);
        } else {
          setIdCompany(null);
        }
      } catch (error) {
        setError("Gagal mengambil data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if(idCompany){
      const fetchData = async () => {
        try {
          const response = await fetch(`${url_partner}/jadwals/${idCompany}`);
          const data = await response.json();
          console.log("Data jadwal:", data);
          
          setServices(data);
        } catch (error) {
          console.error("Gagal mengambil data:", error);
          setError("Gagal mengambil data jadwal");
        }
      };
      fetchData();
    }
  }, [idCompany, location.key]);

  const kirim = async (tgl : any, bulan : any, perusahaan : any, nopol : any, type_service : any, lokasi: any) => {
    const apiUrl = "https://api.fonnte.com/send";
    const apiKey = "wS6aSBDMFoSDAPWA@tK6";
    const phoneNumber = "08119826380"; 

    const message = `Tgl: ${tgl} ${bulan} \n
    --------------------------- 
    Perusahaan:\n${perusahaan} \n
    ---------------------------
    Nomor Polisi:\n${nopol} \n
    ---------------------------
    Service:\n${type_service} \n
    ---------------------------
    Lokasi:\n ${lokasi} \n
    `;

    try {
      const formData = new FormData();
      formData.append("target", phoneNumber);
      formData.append("message", message);

      const response = await axios.post(apiUrl, formData, {
        headers: {
          Authorization: apiKey,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response.data); // Logging untuk melihat respon dari API
      if (response.data.status) {
        alert("Pesan berhasil dikirim!");
      } else {
        alert(`Gagal mengirim pesan: ${response.data.message}`);
      }
    } catch (error : any) {
      console.error(
        "Error mengirim pesan: ",
        error.response ? error.response.data : error.message
      );
      alert("Terjadi kesalahan saat mengirim pesan.");
    }
  };

  const handleButtonClick = (service: Service, action: string) => {
    const { id, type_service } = service;
    let url = "";

    if (action === "detail") {
      switch (type_service) {
        case "uji_emisi":
          url = `update_emisi/${id}/${type_service}`;
          break;
        case "service_rutin":
          url = `update_service_rutin/${id}/${type_service}`;
          break;
        case "service_kecelakaan":
          url = `update_service_kecelakaan/${id}/${type_service}`;
          break;
        case "ganti_stnk":
          url = `update_stnk/${id}/${type_service}`;
          break;
        default:
          alert("Halaman Tidak Ditemukan");
          return;
      }
      navigate(url, { state: { service } });
    } else if (action === "update") {
      navigateToUpdate(id, type_service);
    }
  };

  const navigateToUpdate = (id: number, type: string) => {
    let url = "";
    if (type === "uji_emisi") {
      url = `update_emisi/${id}/${type}`;
    } else if (type === "service_rutin") {
      url = `update_service_rutin/${id}/${type}`;
    } else if (type === "service_kecelakaan") {
      url = `update_service_kecelakaan/${id}/${type}`;
    } else if (type === "ganti_stnk") {
      url = `update_stnk/${id}/${type}`;
    } else {
      alert("Halaman Tidak Ditemukan");
      return;
    }
    navigate(url);
  };

  const filteredServices = selectedStatus
    ? services.filter((service) => service.status === selectedStatus)
    : services;

  const { SearchBar } = Search;

  const columns = [
    {
      dataField: "tgl_jadwal",
      text: "Date",
      formatter: (cell : any, row : any) => (
        <>
          <h5>{new Date(cell).getDate()}</h5>
          {new Date(cell).toLocaleString("default", { month: "long" })}
        </>
      ),
      headerStyle: () => ({ backgroundColor: "#009879", color: "white" }),
    },
    {
      dataField: "tb_mobil.nopol",
      text: "Nopol Customer",
      formatter: (cell : any, row : any) => (
        <Link
          to={`/partner-dashboard/customer/costumer-detail/detail-mobil/${cell}`}
          className="text-decoration-none"
        >
          {row.tb_mobil.tb_perusahaan.nama_perusahaan}
          <br />
          <h5>{cell}</h5>
        </Link>
      ),
      headerStyle: () => ({ backgroundColor: "#009879", color: "white" }),
    },
    {
      dataField: "type_service",
      text: "Service Location",
      formatter: (cell : any, row : any) => (
        <>
          <p>
            <b>{cell === "uji_emisi" ? "Uji Emisi" : cell === "service_rutin" ? "Servis Rutin" : cell === "service_kecelakaan" ? "Servis Kecelakaan" : cell === "ganti_stnk" ? "Ganti STNK" : cell}</b>
          </p>
          <hr style={{ marginTop: -10 }} />
          <p style={{ marginTop: -10, color: "blue" }}>
            <b>Lokasi: {row.lokasi_service}</b>
          </p>
        </>
      ),
      headerStyle: () => ({ backgroundColor: "#009879", color: "white" }),
    },
    {
      dataField: "status",
      text: "Status",
      formatter: (cell : any) => (
        <span
          className={`badge badge-${
            cell === "Scheduled"
              ? "info"
              : cell === "In Progress"
                ? "warning"
                : "success"
          }`}
        >
          {cell}
        </span>
      ),
      headerStyle: () => ({ backgroundColor: "#009879", color: "white" }),
    },
    {
      dataField: "actions",
      text: "Actions",
      formatter: (cell : any, row : any) => (
        <>
          <Button
            variant={row.status === "Completed" ? "info" : "success"}
            className="mr-2"
            onClick={() => handleButtonClick(row, "detail")}
          >
            <i
              className={
                row.status === "Completed" ? "fas fa-info-circle" : "fas fa-pen"
              }
            ></i>
            {row.status === "Completed" ? " Detail" : " Update"}
          </Button>

          <Button
            variant="primary"
            className="mr-2"
            onClick={() =>
              kirim(
                new Date(row.tgl_jadwal).getDate(),
                new Date(row.tgl_jadwal).toLocaleString("default", {
                  month: "long",
                }),
                row.tb_mobil.tb_perusahaan.nama_perusahaan,
                row.tb_mobil.nopol,
                row.type_service,
                row.lokasi_service
              )
            }
          >
            <i className="fas fa-paper-plane"></i> Kirim ke Driver
          </Button>
        </>
      ),
      headerStyle: () => ({ backgroundColor: "#009879", color: "white" }),
    },
  ];

  const serviceTypes = ["uji_emisi", "service_rutin", "service_kecelakaan", "ganti_stnk"];

  return (
    <div className="container mt-5 mb-5">
      <h1 className="text-center mb-4 text-dark font-weight-bold">
        Scheduled Event
      </h1>

      <div className="d-flex justify-content-between mb-3">
        <Dropdown onSelect={(e) => setSelectedStatus(e || "")}>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            Filter Status
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item eventKey="">All</Dropdown.Item>
            <Dropdown.Item eventKey="Scheduled">Scheduled</Dropdown.Item>
            <Dropdown.Item eventKey="In Progress">In Progress</Dropdown.Item>
            <Dropdown.Item eventKey="Completed">Completed</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Link
          to={`/partner-dashboard/form_jadwal`}
          className="btn btn-success font-weight-bold"
        >
          <i className="fas fa-plus"></i> Add New
        </Link>
      </div>

      {serviceTypes.map((type) => {
        const filteredServicesByType = filteredServices.filter(
          (service) => service.type_service === type
        );
        return (
          <React.Fragment key={type}>
            <hr />
            <h3>{type.replace("_", " ").charAt(0).toUpperCase() + type.replace("_", " ").slice(1)}</h3>
            <hr />
            <ToolkitProvider
              keyField="id"
              data={filteredServicesByType}
              columns={columns}
              search
            >
              {(props : any) => (
                <div>
                  <SearchBar {...props.searchProps} />
                  <hr />
                  <BootstrapTable
                    {...props.baseProps}
                    pagination={paginationFactory()}
                    striped
                    bordered
                    hover
                    wrapperClasses="table-responsive"
                  />
                </div>
              )}
            </ToolkitProvider>
          </React.Fragment>
        );
      })}

      <style>
        {`
          .container {
            max-width: 1300px;
            max-height: 800px;
            overflow-y: auto;
            }
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
  );
};

export default Jadwal;
