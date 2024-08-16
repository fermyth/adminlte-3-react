import React, { useState, useEffect } from "react";
import { Form, Button, Card } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft, FaTools } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";

interface ServiceRecord {
  id: string;
  km: string;
  lokasi: string;
  servis: string;
  keterangan: string;
}

const UpdateJadwal: React.FC = () => {
  const location = useLocation();
  const record: ServiceRecord = location.state?.record;

  const [km, setKm] = useState(record?.km || "");
  const [lokasi, setLokasi] = useState(record?.lokasi || "");
  const [servis, setServis] = useState(record?.servis || "");
  const [keterangan, setKeterangan] = useState(record?.keterangan || "");
  const [options, setOptions] = useState([]);
  const [isExistingCompany, setIsExistingCompany] = useState(true);
  const [loading, setLoading] = useState(true); // Tambah state loading

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading ke true saat memulai fetch
      try {
        //  alert(idpartner);
        const response = await axios.get(
          "https://api_portal.sigapdriver.com/api/v1/customer_sigap"
        );
        const data = response.data.data;
        console.log("cekdata", response.data.data);
        const formattedOptions = data.map((item) => ({
          value: item.company_name,
          label: item.company_name,
        }));
        console.log("cekdataitem", formattedOptions);
        setOptions(formattedOptions);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading ke false setelah fetch selesai
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      id: record.id,
      km,
      lokasi,
      servis,
      keterangan,
    };

    try {
      await axios.put(`YOUR_SERVICE_API_URL/${record.id}`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success("Data servis berhasil diperbarui!");
      navigate("/internal");
    } catch (error) {
      console.error("Ada kesalahan dalam memperbarui data:", error);
      toast.error(
        "Terjadi kesalahan saat memperbarui data. Silakan coba lagi."
      );
    }
  };

  const [formData, setFormData] = useState({
    nama_perusahaan: "",
  });

  const handleSelectChange = (selectedOption: any) => {
    if (selectedOption) {
      setFormData({
        id_company: selectedOption.id_company,
        nama_perusahaan: selectedOption.label,
      });
      setIsExistingCompany(true);
    } else {
      handleCreateNewCompanySearch();
    }
  };

  const handleCreateNewCompanySearch = () => {
    setFormData({
      id_company: "",
      nama_perusahaan: "",
    });
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
        <h1 className="text-center mb-4 text-dark font-weight-bold">
          Form Jadwal
        </h1>
        <div className="d-flex justify-content-between mb-3">
          <Button
            variant="link"
            onClick={() => navigate(-1)}
            className="back-button"
          >
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
              <Form.Group controlId="formKm" className="mb-3">
                <Form.Label>Tanggal</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Masukkan KM"
                  value={km}
                  onChange={(e) => setKm(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formKm" className="mb-3">
                <Form.Label>Plat Nomor</Form.Label>
                <Select
                  placeholder="Masukkan Nama Perusahaan"
                  options={options}
                  value={
                    options.find(
                      (option) => option.value === formData.nama_perusahaan
                    ) || null
                  }
                  onChange={handleSelectChange}
                  isClearable
                />
              </Form.Group>
              <Form.Group controlId="formLokasi" className="mb-3">
                <Form.Label>Lokasi</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Masukkan Lokasi"
                  value={lokasi}
                  onChange={(e) => setLokasi(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formServis" className="mb-3">
                <Form.Label>Type Service</Form.Label>
                <Form.Control
                  as="select"
                  value={servis}
                  onChange={(e) => setServis(e.target.value)}
                  required
                >
                  <option value="">Pilih</option>
                  <option value="uji_emisi">Uji Emisi</option>
                  <option value="service_rutin">Service Rutin</option>
                  <option value="service_kecelakaan">Service Kecelakaan</option>
                  <option value="ganti_stnk">Ganti STNK</option>
                </Form.Control>
              </Form.Group>
              {/* <Form.Group controlId="formKeterangan" className="mb-3">
                <Form.Label>status</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Masukkan Keterangan"
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  required
                  rows={3}
                />
              </Form.Group> */}
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

export default UpdateJadwal;
