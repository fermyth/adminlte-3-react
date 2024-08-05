import React, { useState } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";



const FormPartnerInternal: React.FC = () => {
  // State untuk form perusahaan
  const [namaPerusahaan, setNamaPerusahaan] = useState("");
  const [alamat, setAlamat] = useState("");
  const [kontak, setKontak] = useState("");
  const [email, setEmail] = useState("");

  // State untuk form pengguna
  const [namaPengguna, setNamaPengguna] = useState("");
  const [emailPengguna, setEmailPengguna] = useState("");
  const [kataSandi, setKataSandi] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Data untuk perusahaan
    const newCompany = {
      id: Date.now().toString(), // Generating a unique id
      namaPerusahaan,
      alamat,
      kontak,
      email,
    };

    // Data untuk pengguna
    const newUser = {
      id: Date.now().toString(), // Generating a unique id
      namaPengguna,
      email: emailPengguna,
      kataSandi,
    };

    // Kirim data perusahaan dan pengguna ke server
    Promise.all([
      axios.post("YOUR_COMPANY_API_URL", newCompany),
      axios.post("YOUR_USER_API_URL", newUser)
    ])
      .then(([companyResponse, userResponse]) => {
        console.log("Data perusahaan dan pengguna berhasil ditambahkan:", companyResponse.data, userResponse.data);
        navigate("/"); // Redirect back to the main page
      })
      .catch(error => {
        console.error("Ada kesalahan dalam menambahkan data:", error);
      });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4 text-dark font-weight-bold">Tambah Data Baru</h1>
      <Form onSubmit={handleSubmit}>
        <Row>
          {/* Card Form Perusahaan */}
          <Col md={6} className="mb-3">
            <Card>
              <Card.Header>
                <h4>Form Perusahaan</h4>
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

          {/* Card Form Pengguna */}
          <Col md={6} className="mb-3">
            <Card>
              <Card.Header>
                <h4>Form Pengguna</h4>
              </Card.Header>
              <Card.Body>
                <Form.Group controlId="formNamaPengguna">
                  <Form.Label>Nama Pengguna</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Masukkan Nama Pengguna"
                    value={namaPengguna}
                    onChange={(e) => setNamaPengguna(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formEmailPengguna">
                  <Form.Label>Email Pengguna</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Masukkan Email Pengguna"
                    value={emailPengguna}
                    onChange={(e) => setEmailPengguna(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formKataSandi">
                  <Form.Label>Kata Sandi</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Masukkan Kata Sandi"
                    value={kataSandi}
                    onChange={(e) => setKataSandi(e.target.value)}
                    required
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Tombol Simpan */}
        <div className="text-right">
          <Button variant="success" type="submit" className="mt-3">
            Simpan
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default FormPartnerInternal;
