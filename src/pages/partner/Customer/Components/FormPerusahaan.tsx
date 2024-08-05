import React, { useState } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import { FaArrowLeft, FaBuilding, FaUpload } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FormPerusahaanPartner: React.FC = () => {
  const [formData, setFormData] = useState({
    nama_perusahaan: "",
    alamat: "",
    kontak: "",
    email: "",
    image: "static_image.jpg",
    partnerId: 1,
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      nama_perusahaan: formData.nama_perusahaan,
      alamat: formData.alamat,
      kontak: formData.kontak,
      email: formData.email,
      image: formData.image, // Static image value
      partnerId: formData.partnerId,
    };

    try {
      const response = await axios.post(
        "http://localhost:5182/api/v1/perusahaan",
        data
      );
      toast.success("Perusahaan berhasil ditambahkan!");
      navigate("/partner-dashboard/customer");
    } catch (error: any) {
      toast.error("Terjadi kesalahan saat menambahkan perusahaan.");
      console.error("Error submitting form:", error.response?.data);
    }
  };

  const headerStyle = {
    backgroundColor: "#009879",
    color: "white",
    display: "flex",
    alignItems: "center",
    padding: "10px",
    borderBottom: "2px solid white",
  };

  const iconStyle = {
    marginRight: "10px",
  };

  const titleStyle = {
    fontSize: "18px",
    marginBottom: 0,
  };

  const buttonStyle = {
    backgroundColor: "#009879",
    borderColor: "#009879",
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4 text-dark font-weight-bold">
        Tambah Data Perusahaan
      </h1>
      <div className="d-flex justify-content-between mb-3">
        <Button variant="link" className="text-dark">
          <FaArrowLeft size={20} />
        </Button>
      </div>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6} className="mb-3">
            <Card className="shadow-sm">
              <Card.Header style={headerStyle}>
                <FaBuilding size={24} style={iconStyle} />
                <h4 style={titleStyle}>Form Perusahaan</h4>
              </Card.Header>
              <Card.Body>
                <Form.Group controlId="formNamaPerusahaan">
                  <Form.Label>Nama Perusahaan</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Masukkan Nama Perusahaan"
                    name="nama_perusahaan"
                    value={formData.nama_perusahaan}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formAlamat">
                  <Form.Label>Alamat</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Masukkan Alamat"
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formKontak">
                  <Form.Label>Kontak</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Masukkan Kontak"
                    name="kontak"
                    value={formData.kontak}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formEmailPerusahaan">
                  <Form.Label>Email Perusahaan</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Masukkan Email Perusahaan"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} className="mb-3">
            <Card className="shadow-sm">
              <Card.Header style={headerStyle}>
                <FaUpload size={24} style={iconStyle} />
                <h4 style={titleStyle}>Upload Logo Perusahaan</h4>
              </Card.Header>
              <Card.Body>
                <Form.Group controlId="formLogoPerusahaan">
                  <Form.Label>Logo Perusahaan</Form.Label>
                  <Form.Control type="file" accept="image/*" disabled />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="text-right">
          <Button type="submit" className="mt-3 px-4" style={buttonStyle}>
            Simpan
          </Button>
        </div>
      </Form>

      <ToastContainer />
    </div>
  );
};

export default FormPerusahaanPartner;
