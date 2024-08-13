import React, { useState, useEffect } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import { FaArrowLeft, FaBuilding, FaUpload, FaSpinner } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";

// Fungsi untuk menghapus tag HTML dari string
const removeHTMLTags = (str: string | null | undefined): string => {
  if (!str) {
    return "";
  }
  return str.replace(/<[^>]*>?/gm, "");
};

const FormPerusahaanPartner: React.FC = () => {
  const { idpartner } = useParams();
  const [options, setOptions] = useState([]);
  const [isExistingCompany, setIsExistingCompany] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://api_portal.sigapdriver.com/api/v1/customer_sigap"
        );
        const data = response.data.data;
        const formattedOptions = data.map((item) => ({
          value: item.company_name,
          label: item.company_name,
          id_company: item.master_companies_id,
          alamat: removeHTMLTags(item.company_address),
          kontak: item.phone_number,
          email: item.email,
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

  const [formData, setFormData] = useState({
    id_company: "",
    nama_perusahaan: "",
    alamat: "",
    kontak: "",
    email: "",
    image: "",
    partnerId: idpartner,
  });

  const navigate = useNavigate();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFormData({
      ...formData,
      image: file || "",
    });
  };

  const handleSelectChange = (selectedOption: any) => {
    if (selectedOption) {
      setFormData({
        id_company: selectedOption.id_company,
        nama_perusahaan: selectedOption.label,
        alamat: selectedOption.alamat,
        kontak: selectedOption.kontak,
        email: selectedOption.email,
        image: "",
        partnerId: idpartner,
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
      alamat: "",
      kontak: "",
      email: "",
      image: "",
      partnerId: idpartner,
    });
  };

  const handleCreateNewCompany = () => {
    setIsExistingCompany(false);
    setFormData({
      id_company: "",
      nama_perusahaan: "",
      alamat: "",
      kontak: "",
      email: "",
      image: "",
      partnerId: idpartner,
    });
  };

  const handleCreateNewCompanySelect = () => {
    setIsExistingCompany(true);
    setFormData({
      id_company: "",
      nama_perusahaan: "",
      alamat: "",
      kontak: "",
      email: "",
      image: "",
      partnerId: idpartner,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("id_company", formData.id_company);
    data.append("nama_perusahaan", formData.nama_perusahaan);
    data.append("alamat", formData.alamat);
    data.append("kontak", formData.kontak);
    data.append("email", formData.email);
    if (formData.image) {
      data.append("image", formData.image);
    }
    data.append("partnerId", formData.partnerId);

    try {
      const response = await axios.post(
        "https://api_partner_staging.sigapdriver.com/api/v1/perusahaan",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Perusahaan berhasil ditambahkan!");
      navigate("/partner-dashboard/customer");
    } catch (error: any) {
      toast.error("Terjadi kesalahan saat menambahkan perusahaan.");
      console.error("Error submitting form:", error.response?.data);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4 text-dark font-weight-bold">
        Tambah Data Perusahaan
      </h1>
      <div className="d-flex justify-content-between mb-3">
        <Button variant="link" className="text-dark" onClick={() => navigate(-1)}>
          <FaArrowLeft size={20} />
        </Button>
      </div>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6} className="mb-3">
            <Card className="shadow-sm">
              <Card.Header className="bg-primary text-white d-flex align-items-center px-3 py-2">
                <FaBuilding size={24} className="mr-2" />
                <h4 className="mb-0">Form Perusahaan</h4>
              </Card.Header>
              <Card.Body>
                <Form.Group controlId="formNamaPerusahaan">
                  <Form.Label>Nama Perusahaan</Form.Label>
                  {loading ? (
                    <FaSpinner
                      size={24}
                      className="text-primary"
                      style={{ animation: "spin 1s linear infinite" }}
                    />
                  ) : isExistingCompany ? (
                    <Row>
                      <Col md={8} className="mb-8">
                        <Select
                          placeholder="Masukkan Nama Perusahaan"
                          options={options}
                          value={
                            options.find(
                              (option) =>
                                option.value === formData.nama_perusahaan
                            ) || null
                          }
                          onChange={handleSelectChange}
                          isClearable
                        />
                      </Col>
                      <Col md={4} className="mb-4">
                        <Button
                          style={{
                            backgroundColor: "#049879",
                            borderColor: "#009879",
                            fontSize: 14,
                          }}
                          onClick={handleCreateNewCompany}
                        >
                          Buat Perusahaan Baru
                        </Button>
                      </Col>
                    </Row>
                  ) : (
                    <Row>
                      <Col md={8}>
                        <Form.Control
                          type="text"
                          placeholder="Masukkan Nama Perusahaan"
                          name="nama_perusahaan"
                          value={formData.nama_perusahaan}
                          onChange={handleInputChange}
                          required
                        />
                      </Col>
                      <Col md={4}>
                        <Button
                          onClick={handleCreateNewCompanySelect}
                          style={{
                            width: "100%",
                            backgroundColor: "#027BFF",
                            borderColor: "#009879",
                            color: "white",
                          }}
                        >
                          Cari Perusahaan
                        </Button>
                      </Col>
                    </Row>
                  )}
                </Form.Group>
                <Form.Group controlId="formAlamat">
                  <Form.Label>Alamat</Form.Label>
                  <Form.Control
                    as="textarea"
                    placeholder="Masukkan Alamat"
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleInputChange}
                    required
                    readOnly={isExistingCompany}
                  />
                </Form.Group>
                <Form.Group controlId="formKontak">
                  <Form.Label>Kontak</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Masukkan Kontak"
                    name="kontak"
                    value={formData.kontak}
                    onChange={handleInputChange}
                    required
                    readOnly={isExistingCompany}
                  />
                </Form.Group>
                <Form.Group controlId="formEmailPerusahaan">
                  <Form.Label>Email Perusahaan</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Masukkan Email Perusahaan"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    readOnly={isExistingCompany}
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} className="mb-3">
            <Card className="shadow-sm">
              <Card.Header className="bg-primary text-white d-flex align-items-center px-3 py-2">
                <FaUpload size={24} className="mr-2" />
                <h4 className="mb-0">Upload Logo Perusahaan</h4>
              </Card.Header>
              <Card.Body>
                <Form.Group controlId="formLogoPerusahaan">
                  <Form.Label>Logo Perusahaan</Form.Label>
                  <Form.Control
                    name="image"
                    onChange={handleFileChange}
                    type="file"
                    accept="image/*"
                  />
                </Form.Group>
              </Card.Body>
            </Card>
            <Button
              style={{
                marginTop: "10px",
                backgroundColor: "#027BFF",
                borderColor: "#027BFF",
                width: "100%",
              }}
              type="submit"
            >
              Simpan
            </Button>
          </Col>
        </Row>
      </Form>
      <ToastContainer />
    </div>
  );
};

export default FormPerusahaanPartner;
