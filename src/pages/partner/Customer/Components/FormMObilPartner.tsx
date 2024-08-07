import React, { useState, useEffect } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft, FaCar, FaImage } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FormMobilPartner: React.FC = () => {
  const [formData, setFormData] = useState({
    tipe_kendaraan: "",
    pembuat: "",
    tahun: "",
    warna_kendaraan: "",
    nopol: "",
    nomor_rangka: "",
    nomor_mesin: "",
    pilihan_aksesoris: "",
    biaya_sewa: "",
    jangka_waktu_sewa: "",
    perusahaanId: "",
    photo1: "",
    photo2: "",
    photo3: "",
    photo4: "",
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const perusahaanId = queryParams.get("perusahaanId");
    if (perusahaanId) {
      setFormData((prevData) => ({ ...prevData, perusahaanId }));
    } else {
      toast.error("Perusahaan ID tidak ditemukan di URL");
    }
  }, [location.search]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, [`photo${index + 1}`]: file });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key as keyof typeof formData]);
    }

    try {
      const response = await axios.post(
        "http://localhost:5182/api/v1/mobil",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        toast.success("Data Mobil Berhasil Ditambahkan!");
        navigate("/partner-dashboard/customer");
      }
    } catch (error) {
      console.error("Error submitting form data:", error);
      toast.error("Terjadi kesalahan saat menambahkan data mobil.");
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
        Tambah Data Mobil
      </h1>
      <div className="d-flex justify-content-between mb-3">
        <Button
          variant="link"
          className="text-dark"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft size={20} />
        </Button>
      </div>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6} className="mb-3">
            <Card className="shadow-sm">
              <Card.Header style={headerStyle}>
                <FaCar size={24} style={iconStyle} />
                <h4 style={titleStyle}>Informasi Mobil</h4>
              </Card.Header>
              <Card.Body>
                <Form.Group controlId="formNamaMobil">
                  <Form.Label>Nama Mobil</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Masukkan Nama Mobil"
                    name="tipe_kendaraan"
                    value={formData.tipe_kendaraan}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formJenisMobil">
                  <Form.Label>Jenis Mobil</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Masukkan Jenis Mobil"
                    name="pembuat"
                    value={formData.pembuat}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formTahun">
                  <Form.Label>Tahun</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Masukkan Tahun"
                    name="tahun"
                    value={formData.tahun}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formWarnaKendaraan">
                  <Form.Label>Warna Kendaraan</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Masukkan Warna Kendaraan"
                    name="warna_kendaraan"
                    value={formData.warna_kendaraan}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formNopol">
                  <Form.Label>Nopol</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Masukkan Nopol"
                    name="nopol"
                    value={formData.nopol}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formNomorRangka">
                  <Form.Label>Nomor Rangka</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Masukkan Nomor Rangka"
                    name="nomor_rangka"
                    value={formData.nomor_rangka}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formNomorMesin">
                  <Form.Label>Nomor Mesin</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Masukkan Nomor Mesin"
                    name="nomor_mesin"
                    value={formData.nomor_mesin}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formPilihanAksesoris">
                  <Form.Label>Pilihan Aksesoris</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Masukkan Pilihan Aksesoris"
                    name="pilihan_aksesoris"
                    value={formData.pilihan_aksesoris}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formBiayaSewa">
                  <Form.Label>Biaya Sewa</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Masukkan Biaya Sewa"
                    name="biaya_sewa"
                    value={formData.biaya_sewa}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formJangkaWaktuSewa">
                  <Form.Label>Jangka Waktu Sewa</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Masukkan Jangka Waktu Sewa"
                    name="jangka_waktu_sewa"
                    value={formData.jangka_waktu_sewa}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formPerusahaan">
                  {/* <Form.Label>Perusahaan</Form.Label> */}
                  <Form.Control
                    type="text"
                    placeholder="Masukkan Perusahaan"
                    name="perusahaanId"
                    value={formData.perusahaanId}
                    onChange={handleChange}
                    required
                    hidden
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} className="mb-3">
            <Card className="shadow-sm">
              <Card.Header style={headerStyle}>
                <FaImage size={24} style={iconStyle} />
                <h4 style={titleStyle}>Upload Foto Mobil</h4>
              </Card.Header>
              <Card.Body>
                {[...Array(4)].map((_, index) => (
                  <Form.Group controlId={`formPhoto${index + 1}`} key={index}>
                    <Form.Label>Foto {index + 1}</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, index)}
                      required
                    />
                  </Form.Group>
                ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Button variant="success" type="submit" style={buttonStyle} block>
          Simpan
        </Button>
      </Form>
      <ToastContainer />
    </div>
  );
};

export default FormMobilPartner;
