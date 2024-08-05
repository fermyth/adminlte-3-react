import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Form, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

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
  const [services, setServices] = useState<Service[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:5182/api/v1/services")
      .then((response) => {
        setServices(response.data);
        console.log("Data services:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching data from API", error);
      });
  }, []);

  const handleAddModalShow = () => setShowAddModal(true);
  const handleAddModalClose = () => setShowAddModal(false);

  const handleEditModalShow = (service: Service) => {
    setSelectedService(service);
    setShowEditModal(true);
  };
  const handleEditModalClose = () => setShowEditModal(false);

  const handleViewModalShow = (service: Service) => {
    setSelectedService(service);
    setShowViewModal(true);
  };
  const handleViewModalClose = () => setShowViewModal(false);

  const handleAddService = (newService: Service) => {
    setServices([...services, newService]);
    handleAddModalClose();
  };

  const handleEditService = (updatedService: Service) => {
    const updatedServices = services.map((service) =>
      service.id === updatedService.id ? updatedService : service
    );
    setServices(updatedServices);
    handleEditModalClose();
  };

  const kirim = () => {
    alert("Pesan Berhasil Terkirim ke Driver");
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4 text-dark font-weight-bold">Jadwal</h1>

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
      <Table striped bordered hover className="text-center table-bordered">
        <thead className="">
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
                <h2>{new Date(service.jadwal_service).getDate()}</h2>{" "}
                {new Date(service.jadwal_service).toLocaleString("default", {
                  month: "long",
                })}
              </td>
              <td>
                <p>
                  <Link
                    to={`/partner-dashboard/customer/costumer-detail/detail-mobil/${service.tb_mobil.nopol}`}
                  >
                    {service.nopol_customer} <br />
                    <span>
                      {service.tb_mobil.tb_perusahaan.nama_perusahaan}
                    </span>
                  </Link>
                </p>
              </td>
              <td style={{ textAlign: "left" }}>
                <p>
                  <b>{service.actions}</b>
                </p>
                <hr style={{ marginTop: -10 }} />
                <p style={{ marginTop: -10, color: "blue" }}>
                  <b>Lokasi: {service.lokasi_service}</b>
                </p>
              </td>
              <td>
                <span
                  className={`alert-${service.status === "Scheduled" ? "info" : service.status === "In Progress" ? "warning" : "success"}`}
                >
                  {service.status}
                </span>
              </td>
              <td>
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

      {/* Add Modal */}
      <Modal show={showAddModal} onHide={handleAddModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>{/* Form fields for adding a new service */}</Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleAddModalClose}>
            Close
          </Button>
          <Button
            variant="success"
            onClick={() =>
              handleAddService({
                id: services.length + 1,
                jadwal_service: "2024-08-01T00:00:00.000Z",
                nopol_customer: "New Nopol",
                lokasi_service: "New Location",
                status: "Scheduled",
                actions: "New Service",
                mobilId: 1,
                createdAt: "",
                updatedAt: "",
                mobil: {
                  id: 1,
                  tipe_kendaraan: "Sedan",
                  pembuat: "Toyota",
                  tahun: 2022,
                  warna_kendaraan: "Hitam",
                  nopol: "B1234XYZ",
                  nomor_rangka: "R12345678901234567",
                  nomor_mesin: "M12345678901234567",
                  pilihan_aksesoris: "AC, Airbag, GPS",
                  biaya_sewa: "500000",
                  perusahaanId: 1,
                  photo1: "url_to_photo1",
                  photo2: "url_to_photo2",
                  photo3: "url_to_photo3",
                  photo4: "url_to_photo4",
                  createdAt: "",
                  updatedAt: "",
                  perusahaan: {
                    id: 1,
                    nama_perusahaan: "Perusahaan ABC",
                    alamat: "Jalan Contoh No. 123, Jakarta",
                    kontak: "08123456789",
                    partnerId: 1,
                    createdAt: "",
                    updatedAt: "",
                  },
                },
              })
            }
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={handleEditModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedService && (
            <Form>
              <Form.Group controlId="formJadwalService">
                <Form.Label>Jadwal Service</Form.Label>
                <Form.Control
                  type="datetime-local"
                  defaultValue={new Date(selectedService.jadwal_service)
                    .toISOString()
                    .slice(0, 16)}
                />
              </Form.Group>
              <Form.Group controlId="formNopolCustomer">
                <Form.Label>Nopol Customer</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={selectedService.nopol_customer}
                />
              </Form.Group>
              <Form.Group controlId="formLokasiService">
                <Form.Label>Lokasi Service</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={selectedService.lokasi_service}
                />
              </Form.Group>
              <Form.Group controlId="formStatus">
                <Form.Label>Status</Form.Label>
                <Form.Control as="select" defaultValue={selectedService.status}>
                  <option>Scheduled</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formActions">
                <Form.Label>Actions</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={selectedService.actions}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEditModalClose}>
            Close
          </Button>
          <Button
            variant="success"
            onClick={() =>
              selectedService &&
              handleEditService({
                ...selectedService,
                jadwal_service: (
                  document.getElementById(
                    "formJadwalService"
                  ) as HTMLInputElement
                ).value,
                nopol_customer: (
                  document.getElementById(
                    "formNopolCustomer"
                  ) as HTMLInputElement
                ).value,
                lokasi_service: (
                  document.getElementById(
                    "formLokasiService"
                  ) as HTMLInputElement
                ).value,
                status: (
                  document.getElementById("formStatus") as HTMLSelectElement
                ).value,
                actions: (
                  document.getElementById("formActions") as HTMLInputElement
                ).value,
              })
            }
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* View Modal */}
      <Modal show={showViewModal} onHide={handleViewModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>View Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedService && (
            <div>
              <p>Jadwal Service: {selectedService.jadwal_service}</p>
              <p>Nopol Customer: {selectedService.nopol_customer}</p>
              <p>Lokasi Service: {selectedService.lokasi_service}</p>
              <p>Status: {selectedService.status}</p>
              <p>Actions: {selectedService.actions}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleViewModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Jadwal;
