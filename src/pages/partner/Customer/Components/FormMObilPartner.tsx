import React, { useState } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCar, FaImage } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FormMobilPartner: React.FC = () => {
  const [namaMobil, setNamaMobil] = useState("");
  const [jenisMobil, setJenisMobil] = useState("");
  const [tahun, setTahun] = useState("");
  const [warnaKendaraan, setWarnaKendaraan] = useState("");
  const [nopol, setNopol] = useState("");
  const [nomorRangka, setNomorRangka] = useState("");
  const [nomorMesin, setNomorMesin] = useState("");
  const [pilihanAksesoris, setPilihanAksesoris] = useState("");
  const [biayaSewa, setBiayaSewa] = useState("");
  const [perusahaan, setPerusahaan] = useState("");
  const [photos, setPhotos] = useState<File[]>(new Array(4).fill(null));

  const navigate = useNavigate();

  const handlePhotoChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const updatedPhotos = [...photos];
        updatedPhotos[index] = e.target.files[0];
        setPhotos(updatedPhotos);
      }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("namaMobil", namaMobil);
    formData.append("jenisMobil", jenisMobil);
    formData.append("tahun", tahun);
    formData.append("warnaKendaraan", warnaKendaraan);
    formData.append("nopol", nopol);
    formData.append("nomorRangka", nomorRangka);
    formData.append("nomorMesin", nomorMesin);
    formData.append("pilihanAksesoris", pilihanAksesoris);
    formData.append("biayaSewa", biayaSewa);
    formData.append("perusahaan", perusahaan);

    photos.forEach((photo, index) => {
      if (photo) {
        formData.append(`photo${index + 1}`, photo);
      }
    });

    try {
      await axios.post("YOUR_CAR_API_URL", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Data mobil berhasil ditambahkan!");
      navigate("/internal"); // Navigate to the main page or other relevant page
    } catch (error) {
      console.error("Ada kesalahan dalam menambahkan data:", error);
      toast.error(
        "Terjadi kesalahan saat menambahkan data. Silakan coba lagi."
      );
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
                <FaCar size={24} style={iconStyle} />
                <h4 style={titleStyle}>Informasi Mobil</h4>
              </Card.Header>
              <Card.Body>
                <Form.Group controlId="formNamaMobil">
                  <Form.Label>Nama Mobil</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Masukkan Nama Mobil"
                    value={namaMobil}
                    onChange={(e) => setNamaMobil(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formJenisMobil">
                  <Form.Label>Jenis Mobil</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Masukkan Jenis Mobil"
                    value={jenisMobil}
                    onChange={(e) => setJenisMobil(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formTahun">
                  <Form.Label>Tahun</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Masukkan Tahun"
                    value={tahun}
                    onChange={(e) => setTahun(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formWarnaKendaraan">
                  <Form.Label>Warna Kendaraan</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Masukkan Warna Kendaraan"
                    value={warnaKendaraan}
                    onChange={(e) => setWarnaKendaraan(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formNopol">
                  <Form.Label>Nopol</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Masukkan Nopol"
                    value={nopol}
                    onChange={(e) => setNopol(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formNomorRangka">
                  <Form.Label>Nomor Rangka</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Masukkan Nomor Rangka"
                    value={nomorRangka}
                    onChange={(e) => setNomorRangka(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formNomorMesin">
                  <Form.Label>Nomor Mesin</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Masukkan Nomor Mesin"
                    value={nomorMesin}
                    onChange={(e) => setNomorMesin(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formPilihanAksesoris">
                  <Form.Label>Pilihan Aksesoris</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Masukkan Pilihan Aksesoris"
                    value={pilihanAksesoris}
                    onChange={(e) => setPilihanAksesoris(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formBiayaSewa">
                  <Form.Label>Biaya Sewa</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Masukkan Biaya Sewa"
                    value={biayaSewa}
                    onChange={(e) => setBiayaSewa(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formPerusahaan">
                  <Form.Label>Perusahaan</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Masukkan Perusahaan"
                    value={perusahaan}
                    onChange={(e) => setPerusahaan(e.target.value)}
                    required
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
                  <Form.Group key={index} controlId={`formPhoto${index + 1}`}>
                    <Form.Label>Foto Mobil {index + 1}</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange(index)}
                    />
                  </Form.Group>
                ))}
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

export default FormMobilPartner;
