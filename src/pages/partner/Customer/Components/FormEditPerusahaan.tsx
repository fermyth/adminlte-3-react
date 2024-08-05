import React, { useState, useEffect } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaBuilding, FaUpload } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateFormPerusahaanInternal: React.FC = () => {
  const [namaPerusahaan, setNamaPerusahaan] = useState("");
  const [alamat, setAlamat] = useState("");
  const [kontak, setKontak] = useState("");
  const [email, setEmail] = useState("");
  const [logoPerusahaan, setLogoPerusahaan] = useState<File | null>(null);

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await axios.get(`YOUR_COMPANY_API_URL/${id}`);
        const company = response.data;
        setNamaPerusahaan(company.namaPerusahaan || "");
        setAlamat(company.alamat || "");
        setKontak(company.kontak || "");
        setEmail(company.email || "");
      } catch (error) {
        console.error("Ada kesalahan dalam mengambil data perusahaan:", error);
        toast.error("Terjadi kesalahan saat mengambil data perusahaan.");
      }
    };

    if (id) {
      fetchCompanyData();
    }
  }, [id]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoPerusahaan(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("namaPerusahaan", namaPerusahaan);
    formData.append("alamat", alamat);
    formData.append("kontak", kontak);
    formData.append("email", email);

    if (logoPerusahaan) {
      formData.append("logoPerusahaan", logoPerusahaan);
    }

    try {
      await axios.put(`YOUR_COMPANY_API_URL/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Data perusahaan berhasil diperbarui!");
      setTimeout(() => navigate("/internal/partner_internal"), 2000);
    } catch (error) {
      console.error("Ada kesalahan dalam memperbarui data perusahaan:", error);
      toast.error("Terjadi kesalahan saat memperbarui data perusahaan.");
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
        Update Data Perusahaan
      </h1>
      <div className="d-flex justify-content-between mb-3">
        <Button
          variant="link"
          onClick={() => navigate(-1)}
          className="text-dark"
        >
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
                    value={namaPerusahaan}
                    onChange={(e) => setNamaPerusahaan(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formAlamat">
                  <Form.Label>Alamat</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Masukkan Alamat"
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formKontak">
                  <Form.Label>Kontak</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Masukkan Kontak"
                    value={kontak}
                    onChange={(e) => setKontak(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formEmailPerusahaan">
                  <Form.Label>Email Perusahaan</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Masukkan Email Perusahaan"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                  />
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

export default UpdateFormPerusahaanInternal;
