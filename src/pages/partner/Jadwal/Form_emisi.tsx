import React, { useState, useEffect } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaBuilding,
  FaTools,
  FaExclamationTriangle,
  FaLeaf,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FormUjiEmisiProps {
  initialSkorEmisi?: string;
  initialStatusUji?: string;
  isDetail?: boolean;
}

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
  ket_json: string;
  tgl_jadwal: string;
}

const FormUjiEmisi: React.FC<FormUjiEmisiProps> = ({
  initialSkorEmisi = "",
  initialStatusUji = "",
  isDetail = false,
}) => {
  const [skorEmisi, setSkorEmisi] = useState(initialSkorEmisi);
  const [statusUji, setStatusUji] = useState(initialStatusUji);
  const [lokasi, setLokasi] = useState("");
  const [km, setKm] = useState("");
  const [servic, setService] = useState("");
  const [skor, setSkor] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [penyebab, setPenyebab] = useState("");
  const [status_uji_emisi, setStatusUjiEmisi] = useState("");
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { service } = location.state as { service: Service };

  console.log("asas", service);
  useEffect(() => {
    if (service && service.ket_json) {
      const ketJsonData = JSON.parse(service.ket_json);
      setLokasi(service.lokasi_service || "");
      setKm(ketJsonData.km || "");
      setService(ketJsonData.servic || "");
      setSkor(ketJsonData.skor || "");
      setKeterangan(ketJsonData.keterangan || "");
      setPenyebab(ketJsonData.penyebab || "");
    }
  }, [service]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const ketJson = {
      skor,
      km,
      service: servic,
      keterangan,
      penyebab,
      type: "uji_emisi",
    };

    const formData = {
      status: statusUji,
      status_uji_emisi : status_uji_emisi,
      ket_json: JSON.stringify(ketJson),
    };
    console.log("ketJson", formData);

    try {
      const response = await axios.put(
        `https://api_partner_staging.sigapdriver.com/api/v1/jadwals/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response:", response.data);
      toast.success("Data berhasil diperbarui!");
      navigate("/partner-dashboard/jadwal");
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error(
        "Terjadi kesalahan saat memperbarui data. Silakan coba lagi."
      );
    }
  };

  return (
    <div className="container">
      <style>{`
        .back-button {
          color: #009879;
          font-size: 20px;
          display: flex;
          align-items: center;
          text-decoration: none;
          transition: color 0.3s ease;
          position: absolute;
          top: 20px;
          left: 20px;
        }
  
        .back-button:hover {
          color: #007a66;
        }
  
        .content {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          width: 100%;
          max-width: 1200px;
        }
  
        .info-card, .form-card {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
  
        .info-card {
          max-width: 400px;
          margin-top: 80px;
        }
  
        .form-card {
          max-width: 600px;
          margin-top: 80px;
        }
  
        .card-header {
          background-color: #009879;
          color: white;
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 10px;
          border-bottom: 2px solid white;
          border-radius: 8px 8px 0 0;
        }
  
        .icon {
          margin-right: 10px;
        }
  
        .submit-button {
          background-color: #009879;
          border-color: #009879;
          padding: 10px 20px;
          font-size: 16px;
          transition: background-color 0.3s ease;
          border-radius: 5px;
        }
  
        .submit-button:hover {
          background-color: #007a66;
        }
  
        .text-center {
          text-align: center;
        }
  
        .text-right {
          text-align: right;
        }
      `}</style>
      <br />
      <Row>
        <Col xs={1}>
          <Button
            variant="link"
            onClick={() => navigate(-1)}
            style={{ color: "#049879" }}
          >
            <FaArrowLeft />
          </Button>
        </Col>
        <Col xs={11}>
          <h1 className="text-center mb-4 text-dark font-weight-bold">
            Perbarui Uji Emisi
          </h1>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card className="shadow-sm border-0 rounded mb-4">
            <Card.Header className="card-header">
              <FaBuilding size={24} className="icon" />
              <h4 className="mb-0">Informasi Perusahaan</h4>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col md={4}>
                  <Card.Text>
                    <strong>Nama Perusahaan</strong>
                  </Card.Text>
                </Col>
                <Col md={8}>
                  <Card.Text>
                    : {service.tb_mobil.tb_perusahaan.nama_perusahaan}
                  </Card.Text>
                </Col>
              </Row>
              <hr />
              <Row className="mb-3">
                <Col md={4}>
                  <Card.Text>
                    <strong>Alamat</strong>
                  </Card.Text>
                </Col>
                <Col md={8}>
                  <Card.Text>: {service.lokasi_service}</Card.Text>
                </Col>
              </Row>
              <hr />
              <Row className="mb-3">
                <Col md={4}>
                  <Card.Text>
                    <strong>Nomor Polisi</strong>
                  </Card.Text>
                </Col>
                <Col md={8}>
                  <Card.Text>: {service.tb_mobil.nopol}</Card.Text>
                </Col>
              </Row>
              <hr />
              <Row className="mb-3">
                <Col md={4}>
                  <Card.Text>
                    <strong>Tanggal</strong>
                  </Card.Text>
                </Col>
                <Col md={8}>
                  <Card.Text>: {new Date(service.tgl_jadwal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</Card.Text>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <div>
            <Card className="shadow-sm border-0 rounded">
              <Card.Header className="card-header">
                <FaLeaf size={24} className="icon" />
                <h4 className="mb-0">Detail Uji Emisi</h4>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formSkorEmisi" className="mb-3">
                    <Form.Label>Skor Emisi</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Masukkan Skor Emisi"
                      value={skor}
                      onChange={(e) => setSkor(e.target.value)}
                      required={!isDetail}
                    />
                  </Form.Group>

                  <Form.Group controlId="formStatusUji" className="mb-3">
                    <Form.Label>Status Pekerjaan</Form.Label>
                    <Form.Control
                      as="select"
                      value={status_uji_emisi}
                      onChange={(e) => setStatusUjiEmisi(e.target.value)}
                      required={!isDetail}
                    >
                      <option value="" hidden>
                        Pilih
                      </option>
                      <option value="Passed">Passed</option>
                      <option value="Failed">Failed</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="formStatusUji" className="mb-3">
                    <Form.Label>Status Uji</Form.Label>
                    <Form.Control
                      as="select"
                      value={statusUji}
                      onChange={(e) => setStatusUji(e.target.value)}
                      required={!isDetail}
                    >
                      <option value="" hidden>
                        Pilih
                      </option>
                      <option value="Completed">Completed</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Scheduled">Scheduled</option>
                    </Form.Control>
                  </Form.Group>

                  {!isDetail && (
                    <div className="text-right mt-4">
                      <Button type="submit" className="submit-button">
                        Simpan
                      </Button>
                    </div>
                  )}
                </Form>
              </Card.Body>
            </Card>

            <ToastContainer />
          </div>
        </Col>
      </Row>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
    </div>
  );
};

export default FormUjiEmisi;
