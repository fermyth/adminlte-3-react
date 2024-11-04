import React, { useState, useEffect } from "react";
import { Form, Button, Card } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTools } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import { UrlServer } from "@app/libs/Api";

interface ServiceRecord {
  id: string;
  km: string;
  lokasi: string;
  servis: string;
  keterangan: string;
}

const FormJadwal: React.FC = () => {
  const navigate = useNavigate();

  const [km, setKm] = useState("");
  const [tgl_service, settglservice] = useState<string | null>(null);
  const [plat_nomor, setplatnomor] = useState<any>(null);
  const [lokasi, setlokasi] = useState<string | null>(null);
  const [type, setype] = useState<string | null>(null);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const url = UrlServer()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); 
      try {
        const response = await axios.get(`${url}/nopoldriver`);
        console.log('cekres',response)
        const data = response.data.data.data;
        const formattedOptions = data.map((item: any) => ({
          value: item.id,
          label: item.nopol,
        }));
        setOptions(formattedOptions);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      mobilsId: plat_nomor?.value,
      tgl_jadwal: tgl_service,
      lokasi_service: lokasi,
      type_service: type,
      ket_json: JSON.stringify({  lokasi  }), 
      status: "Scheduled", 
    };

    try {
      await axios.post(`${url}/jadwals`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success("Jadwal berhasil ditambahkan!");
      navigate("/partner-dashboard/jadwal");
    } catch (error) {
      console.error("Ada kesalahan dalam menambahkan jadwal:", error);
      toast.error("Terjadi kesalahan saat menambahkan jadwal. Silakan coba lagi.");
    }
  };

  const handleSelectChange = (selectedOption: any) => {
    setplatnomor(selectedOption);
  };

  return (
    <div className="form-container mb-5">
      <style>{`
        .form-container {
          min-height: 80vh;
          padding: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .form-card {
          max-width: 50%;
          width: 100%;
        }
        .card-header {
          background-color: #009879;
          color: white;
          display: flex;
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
          padding: 8px 16px;
          font-size: 16px;
          transition: background-color 0.3s ease;
        }
        .submit-button:hover {
          background-color: #007a66;
        }
        .back-button {
          color: #009879;
        }
      `}</style>
      <div className="form-card">
        <h1 className="text-center mb-4 text-dark font-weight-bold">Form Jadwal</h1>
        <div className="d-flex justify-content-between mb-3">
          <Button variant="link" onClick={() => navigate(-1)} className="back-button">
            <FaArrowLeft size={20} />
          </Button>
        </div>
        <Form onSubmit={handleSubmit}>
          <Card className="shadow-sm border-0 rounded">
            <Card.Header className="card-header">
              <FaTools size={24} className="icon" />
              <h4 className="mb-0">Detail Servis</h4>
            </Card.Header>
            <Card.Body>
              <Form.Group controlId="formTglService" className="mb-3">
                <Form.Label>Tanggal</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Masukkan Tanggal"
                  value={tgl_service || ""}
                  onChange={(e) => settglservice(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formPlatNomor" className="mb-3">
                <Form.Label>Plat Nomor</Form.Label>
                <Select
                  placeholder="Pilih Plat Nomor"
                  options={options}
                  value={plat_nomor}
                  onChange={handleSelectChange}
                  isClearable
                />
              </Form.Group>
              <Form.Group controlId="formLokasi" className="mb-3">
                <Form.Label>Lokasi</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Masukkan Lokasi"
                  value={lokasi || ""}
                  onChange={(e) => setlokasi(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formTypeService" className="mb-3">
                <Form.Label>Type</Form.Label>
                <Form.Control
                  as="select"
                  value={type || ""}
                  onChange={(e) => setype(e.target.value)}
                  required
                >
                  <option value="">Pilih</option>
                  <option value="uji_emisi">Uji Emisi</option>
                  <option value="service_rutin">Service Rutin</option>
                  <option value="service_kecelakaan">Service Kecelakaan</option>
                  <option value="ganti_stnk">Ganti STNK</option>
                </Form.Control>
              </Form.Group>
            </Card.Body>
          </Card>

          <div className="text-right mt-4">
            <Button type="submit" className="submit-button">
              Simpan
            </Button>
          </div>
        </Form>

        <ToastContainer />
      </div>
    </div>
  );
};

export default FormJadwal;
