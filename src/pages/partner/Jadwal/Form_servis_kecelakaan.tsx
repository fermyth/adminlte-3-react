import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaExclamationTriangle } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


interface FormUjiEmisiProps {
  initialSkorEmisi?: string;
  initialStatusUji?: string;
}


const FormServiseKecelakaan: React.FC<FormUjiEmisiProps> = ({ initialSkorEmisi = "", initialStatusUji = "success" }) => {
  const [skorEmisi, setSkorEmisi] = useState(initialSkorEmisi);
  const [statusUji, setStatusUji] = useState(initialStatusUji);
  const [lokasi, setLokasi] = useState("");
  const [km, setKm] = useState("");
  const [service, setService] = useState("");
  const [skor, setSkor] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [penyebab, setPenyebab] = useState("");
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const ketJson = {
      skor,
      km ,
      service : service ,
      keterangan,
      penyebab : penyebab,
    };
   

    const formData = {
      status:statusUji ,
      ket_json: JSON.stringify(ketJson), 
    };
    console.log('ketJson',formData);

    try {
      const response = await axios.put(`http://localhost:5182/api/v1/jadwals/${id}`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log("Response:", response.data); 
      toast.success("Data updated successfully!");
      navigate("/partner-dashboard/jadwal");
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error("Error updating data. Please try again.");
    }
  };

  return (
    <div className="form-container">
      <style>{`
        .form-container {
          min-height: 80vh;
          padding: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #f8f9fa;
        }
        .form-card {
          max-width: 500px;
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
          padding: 10px 20px;
          font-size: 16px;
          transition: background-color 0.3s ease;
          border-radius: 5px;
        }
        .submit-button:hover {
          background-color: #007a66;
        }
        .back-button {
          color: #009879;
          font-size: 20px;
          display: flex;
          align-items: center;
          text-decoration: none;
          transition: color 0.3s ease;
        }
        .back-button:hover {
          color: #007a66;
        }
      `}</style>
      <div className="form-card">
        <h1 className="text-center mb-4 text-dark font-weight-bold">Update Servis Kecelakaan</h1>
        <div className="d-flex justify-content-between mb-3">
          <Button variant="link" onClick={() => navigate(-1)} className="back-button">
            <FaArrowLeft /> 
          </Button>
        </div>
        <Form onSubmit={handleSubmit}>
          <Card className="shadow-sm border-0 rounded">
            <Card.Header className="card-header">
              <FaExclamationTriangle size={24} className="icon" />
              <h4 className="mb-0">Detail Servis Kecelakaan</h4>
            </Card.Header>
            <Card.Body>
              <Form.Group controlId="formPenyebab" className="mb-3">
                <Form.Label>Penyebab</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Masukkan Penyebab"
                  value={penyebab}
                  onChange={(e) => setPenyebab(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formServis" className="mb-3">
                <Form.Label>Servis</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Masukkan Servis"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formKeterangan" className="mb-3">
                <Form.Label>Keterangan</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Masukkan Keterangan"
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  required
                />
                </Form.Group>
              <Form.Group controlId="formStatus" className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  as="select"
                  value={statusUji}
                  onChange={(e) => setStatusUji(e.target.value)}
                  required
                >
                  <option value="success">Success</option>
                  <option value="in_progress">In Progress</option>
                  <option value="scheduled">Scheduled</option>
                </Form.Control>
              </Form.Group>
            </Card.Body>
          </Card>

          <div className="text-right mt-4">
            <Button
              type="submit"
              className="submit-button"
            >
              Simpan
            </Button>
          </div>
        </Form>

        <ToastContainer />
      </div>
    </div>
  );
};

export default FormServiseKecelakaan;
