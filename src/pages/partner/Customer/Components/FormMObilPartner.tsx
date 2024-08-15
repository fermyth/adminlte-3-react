import React, { useState, useEffect } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { FaArrowLeft, FaCar, FaImage } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FormMobilPartner: React.FC = () => {
  const [formData, setFormData] = useState({
    contract_number: "",
    tipe_kendaraan: "",
    tahun: "",
    warna_kendaraan: "",
    nopol: "",
    nomor_rangka: "",
    nomor_mesin: "",
    pilihan_aksesoris: "",
    biaya_sewa: "",
    jangka_waktu_sewa: "",
    contract_end: "",
    photo1: "",
    photo2: "",
    photo3: "",
    photo4: "",
    vendor: ""
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { perusahaanID } = useParams();

  useEffect(() => {
    // const queryParams = new URLSearchParams(location.search);
    const perusahaanId = perusahaanID;
    //    alert(perusahaanId);
    if (perusahaanId) {
      setFormData((prevData) => ({ ...prevData, perusahaanId }));
    } else {
      toast.error("Company ID not found in URL");
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
    //  alert('test')

    try {
      const response = await axios.post(
        "https://api_partner_staging.sigapdriver.com/api/v1/mobil",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      navigate("/partner-dashboard/customer/costumer-detail");
      if (response.status === 200) {
        toast.success("Vehicle Data Successfully Added!");
      }
    } catch (error) {
      console.error("Error submitting form data:", error);
      toast.error("An error occurred while adding vehicle data.");
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
        Add Vehicle Data
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
                <h4 style={titleStyle}>Vehicle Information</h4>
              </Card.Header>
              <Card.Body>
                <Form.Group controlId="formNamaMobil">
                  <Form.Label>Contract No</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Contract No"
                    name="contract_number"
                    value={formData.contract_number}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formJenisMobil">
                  <Form.Label>Vehicle Type</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Vehicle Type"
                    name="tipe_kendaraan"
                    value={formData.tipe_kendaraan}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formNomorRangka">
                  <Form.Label>Vehicle Vendor</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Vehichle Vendor"
                    name="vendor"
                    value={formData.vendor}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formTahun">
                  <Form.Label>Year</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Year"
                    name="tahun"
                    value={formData.tahun}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formWarnaKendaraan">
                  <Form.Label>Vehicle Color</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Vehicle Color"
                    name="warna_kendaraan"
                    value={formData.warna_kendaraan}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formNopol">
                  <Form.Label>License Plate</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter License Plate"
                    name="nopol"
                    value={formData.nopol}
                    onChange={(e) => {
                      // Get value from event
                      const value = e.target.value;
                      // Remove special characters and convert to uppercase
                      const formattedValue = value
                        .replace(/[^a-zA-Z0-9]/g, "")
                        .toUpperCase();
                      // Set value to formData
                      setFormData((prevData) => ({
                        ...prevData,
                        nopol: formattedValue,
                      }));
                    }}
                    required
                  />
                </Form.Group>

                {/* <Form.Group controlId="formNomorRangka">
                  <Form.Label>Chassis Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Chassis Number"
                    name="nomor_rangka"
                    value={formData.nomor_rangka}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formNomorMesin">
                  <Form.Label>Engine Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Engine Number"
                    name="nomor_mesin"
                    value={formData.nomor_mesin}
                    onChange={handleChange}
                    required
                  />
                </Form.Group> */}
                {/* <Form.Group controlId="formPilihanAksesoris">
                  <Form.Label>Accessories Options</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Accessories Options"
                    name="pilihan_aksesoris"
                    value={formData.pilihan_aksesoris}
                    onChange={handleChange}
                    required
                  />
                </Form.Group> */}
                <Form.Group controlId="formBiayaSewa">
                  <Form.Label>Rental Fee</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Rental Fee"
                    name="biaya_sewa"
                    value={formData.biaya_sewa}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formJangkaWaktuSewa">
                  <Form.Label>Rental Period</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder="Enter Rental Period"
                    name="jangka_waktu_sewa"
                    value={formData.jangka_waktu_sewa}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formPerusahaan">
                  <Form.Label>Contract End</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder="Enter Contract End Date"
                    name="contract_end"
                    value={formData.contract_end}
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
                <FaImage size={24} style={iconStyle} />
                <h4 style={titleStyle}>Upload Vehicle Photos</h4>
              </Card.Header>
              <Card.Body>
                {["Front", "Back", "Left Side", "Right Side"].map(
                  (side, index) => (
                    <Form.Group key={index} controlId={`formPhoto${index + 1}`}>
                      <Form.Label>{`${side} Photo`}</Form.Label>
                      <div className="d-flex align-items-center">
                        <Form.Control
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleFileChange(
                              e as React.ChangeEvent<HTMLInputElement>,
                              index
                            )
                          }
                          required
                        />
                        {formData[
                          `photo${index + 1}` as keyof typeof formData
                        ] && (
                          <img
                            src={URL.createObjectURL(
                              formData[
                                `photo${index + 1}` as keyof typeof formData
                              ] as File
                            )}
                            alt={`${side} preview`}
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                              marginLeft: "10px",
                            }}
                          />
                        )}
                      </div>
                    </Form.Group>
                  )
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Button variant="success" type="submit" style={buttonStyle} block>
          Save
        </Button>
      </Form>
      <ToastContainer />
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>

      <br></br>
    </div>
  );
};

export default FormMobilPartner;
