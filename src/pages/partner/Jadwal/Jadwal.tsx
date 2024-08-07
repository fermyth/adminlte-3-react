import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button } from "react-bootstrap";
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
  perusahaan: Perusahaan;
}

interface Service {
  id: number;
  jadwal_service: string;
  nopol_customer: string;
  lokasi_service: string;
  status: string;
  actions: string;
  mobilId: number;
  createdAt: string;
  updatedAt: string;
  mobil: Mobil;
}

const Jadwal: React.FC = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:5182/api/v1/jadwals")
      .then((response) => {
        setServices(response.data);
        console.log("Data services:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching data from API", error);
      });
  }, []);

  const kirim = () => {
    alert("Pesan Berhasil Terkirim ke Driver");
  };

  const update_jadwal = (id: any, type: any) => {
    let url = null;
    if (type === 'uji_emisi') {
      url = `update_emisi/${id}/${type}`;
    } else if (type === 'service_rutin') {
      url = `update_service_rutin/${id}/${type}`;
    } else if (type === 'service_kecelakaan') {
      url = `update_service_kecelakaan/${id}/${type}`;
    } else if (type === 'ganti_stnk') {
      url = `update_stnk/${id}/${type}`;
    } else {
      alert("Halaman Tidak Ditemukan");
    }
    navigate(url);
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4 text-dark font-weight-bold">Jadwal</h1>

      <div className="d-flex justify-content-end mb-3">
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
          {services.map((service: any) => (
            <tr key={service.id}>
              <td>
                <h5>{new Date(service.tgl_jadwal).getDate()}</h5>{" "}
                {new Date(service.tgl_jadwal).toLocaleString("default", {
                  month: "long",
                })}
              </td>
              <td>
                <p>
                  <Link
                    to={`/partner-dashboard/customer/costumer-detail/detail-mobil/${service.tb_mobil.nopol}`}
                    className="text-decoration-none"
                  >
                    {service.tb_mobil.tb_perusahaan.nama_perusahaan}
                    <br />
                    <h5>{service.tb_mobil.nopol}</h5>
                  </Link>
                </p>
              </td>
              <td className="text-left">
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
              <td>
                <Button
                  variant="success"
                  className="mr-2"
                  onClick={() => update_jadwal(service.id, service.type_service)}
                >
                  <i className="fas fa-pen"></i> Update
                </Button>
                <Button
                  variant="primary"
                  className="mr-2"
                  onClick={() => kirim()}
                >
                  <i className="fas fa-paper-plane"></i> Kirim ke Driver
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <p className="text-center mt-2">
        Showing 1 to {services.length} of {services.length} entries
      </p>

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
  );
};

export default Jadwal;
