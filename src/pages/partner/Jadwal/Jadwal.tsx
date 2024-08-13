import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";

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

  useEffect(() => {
    axios
      .get("http://trial.sigapdriver.com:8080/api/v1/jadwals")
      .then((response) => {
        setServices(response.data);
        console.log("Data services:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching data from API", error);
      });
  }, []);

  const kirim = async (tgl, bulan, perusahaan, nopol, type_service, lokasi) => {
    const apiUrl = "https://api.fonnte.com/send";
    const apiKey = "wS6aSBDMFoSDAPWA@tK6";
    const phoneNumber = "08119826380"; // Daftar nomor telepon

    // Merangkai pesan dengan menggunakan template literal
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
    } catch (error) {
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

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4 text-dark font-weight-bold">Jadwal</h1>

      <div className="d-flex justify-content-between mb-3">
        <Dropdown onSelect={(e) => setSelectedStatus(e || "")}>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            Filter Status
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item eventKey="">All</Dropdown.Item>
            <Dropdown.Item eventKey="Scheduled">Scheduled</Dropdown.Item>
            <Dropdown.Item eventKey="In Progress">In Progress</Dropdown.Item>
            <Dropdown.Item eventKey="success">Success</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Link
          to={`/partner-dashboard/form_jadwal`}
          className="btn btn-success font-weight-bold"
        >
          <i className="fas fa-plus"></i> Tambah Baru
        </Link>
      </div>
      <Table striped bordered hover responsive className="text-center">
        <thead>
          <tr>
            <th style={{ backgroundColor: "#009879", color: "white" }}>
              Tanggal
            </th>
            <th style={{ backgroundColor: "#009879", color: "white" }}>
              Nopol Customer
            </th>
            <th style={{ backgroundColor: "#009879", color: "white" }}>
              Lokasi Service
            </th>
            <th style={{ backgroundColor: "#009879", color: "white" }}>
              Status
            </th>
            <th style={{ backgroundColor: "#009879", color: "white" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredServices.map((service) => (
            <tr key={service.id}>
              <td>
                <h5>{new Date(service.tgl_jadwal).getDate()}</h5>{" "}
                {new Date(service.tgl_jadwal).toLocaleString("default", {
                  month: "long",
                })}
              </td>
              <td className="align-middle">
                <p>
                  {service.tb_mobil && service.tb_mobil.tb_perusahaan ? (
                    <Link
                      to={`/partner-dashboard/customer/costumer-detail/detail-mobil/${service.tb_mobil.nopol}`}
                      className="text-decoration-none"
                    >
                      {service.tb_mobil.tb_perusahaan.nama_perusahaan}
                      <br />
                      <h5>{service.tb_mobil.nopol}</h5>
                    </Link>
                  ) : (
                    <p>Data tidak tersedia</p>
                  )}
                </p>
              </td>
              <td className="text-left align-middle">
                <p>
                  <b>{service.type_service}</b>
                </p>
                <hr style={{ marginTop: -10 }} />
                <p style={{ marginTop: -10, color: "blue" }}>
                  <b>Lokasi: {service.lokasi_service}</b>
                </p>
              </td>
              <td className="align-middle">
                <span
                  className={`badge badge-${
                    service.status === "Scheduled"
                      ? "info"
                      : service.status === "In Progress"
                      ? "warning"
                      : "success"
                  }`}
                >
                  {service.status}
                </span>
              </td>
              <td className="align-middle">
                <Button
                  variant={service.status === "success" ? "info" : "success"}
                  className="mr-2"
                  onClick={() => handleButtonClick(service, "detail")}
                >
                  <i
                    className={
                      service.status === "success"
                        ? "fas fa-info-circle"
                        : "fas fa-pen"
                    }
                  ></i>
                  {service.status === "success" ? " Detail" : " Update"}
                </Button>

                <Button
                  variant="primary"
                  className="mr-2"
                  onClick={() =>
                    kirim(
                      new Date(service.tgl_jadwal).getDate(),
                      new Date(service.tgl_jadwal).toLocaleString("default", {
                        month: "long",
                      }),
                      service.tb_mobil.tb_perusahaan.nama_perusahaan,
                      service.tb_mobil.nopol,
                      service.type_service,
                      service.lokasi_service
                    )
                  }
                >
                  <i className="fas fa-paper-plane"></i> Kirim ke Driver
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <p className="text-center mt-2">
        Showing 1 to {filteredServices.length} of {services.length} entries
      </p>

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
  );
};

export default Jadwal;
