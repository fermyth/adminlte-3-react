import React, { useState, useEffect } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import { FaArrowLeft, FaBuilding, FaUpload, FaSpinner } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

// Fungsi untuk menghapus tag HTML dari string
const removeHTMLTags = (str: string | null | undefined): string => {
  if (!str) {
    return "";
  }
  return str.replace(/<[^>]*>?/gm, "");
};

const FormPerusahaanPartner: React.FC = () => {
  const [options, setOptions] = useState([]);
  const [isExistingCompany, setIsExistingCompany] = useState(true);
  const [loading, setLoading] = useState(true); // Tambah state loading

  useEffect(() => {
    // Fungsi untuk mengambil data dari API
    const fetchData = async () => {
      setLoading(true); // Set loading ke true saat memulai fetch
      try {
        const response = await axios.get(
          "http://localhost:5181/api/v1/customer_sigap"
        );
        const data = response.data.data;
        console.log("cekdata", response.data.data);
        const formattedOptions = data.map((item) => ({
          value: item.company_name,
          label: item.company_name,
          id_company: item.master_companies_id,
          alamat: removeHTMLTags(item.company_address),
          kontak: item.phone_number,
          email: item.email,
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

  const [formData, setFormData] = useState({
    nama_perusahaan: "",
    alamat: "",
    kontak: "",
    email: "",
    image: "static_image.jpg",
    partnerId: 1,
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

  const handleSelectChange = (selectedOption: any) => {
    if (selectedOption) {
      setFormData({
        id_company: selectedOption.id_company,
        nama_perusahaan: selectedOption.label,
        alamat: selectedOption.alamat,
        kontak: selectedOption.kontak,
        email: selectedOption.email,
        partnerId: 1,
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
      image: "static_image.jpg",
      partnerId: 1,
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
      image: "static_image.jpg",
      partnerId: 1,
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
      image: "static_image.jpg",
      partnerId: 1,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      id_company: formData.id_company,
      nama_perusahaan: formData.nama_perusahaan,
      alamat: formData.alamat,
      kontak: formData.kontak,
      email: formData.email,
      image: "",
      partnerId: formData.partnerId,
    };
    console.log("inputperusahaan", data);

    try {
      const response = await axios.post(
        "http://localhost:5182/api/v1/perusahaan",
        data
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
        <Button variant="link" className="text-dark">
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
                <Form.Group controlId="formKontak">
                  <Form.Control
                    type="hidden"
                    name="id_company"
                    value={formData.id_company}
                    onChange={handleInputChange}
                    required
                    readOnly={isExistingCompany}
                  />
                </Form.Group>
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
                            borderColor: "#009879", fontSize:14
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
                          variant="contained"
                          color="primary"
                          onClick={handleCreateNewCompanySelect}
                          style={{
                            width: "100%",
                            maxWidth: "300px",
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
                  <Form.Control type="file" accept="image/*" />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="text-right">
          <Button
            type="submit"
            className="mt-3 px-4"
            style={{ backgroundColor: "#009879", borderColor: "#009879" }}
          >
            Simpan
          </Button>
        </div>
      </Form>

      <ToastContainer />
    </div>
  );
};

export default FormPerusahaanPartner;
