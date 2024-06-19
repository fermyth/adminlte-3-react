import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Row,
  Col,
  Form,
  Table,
  Modal,
} from "react-bootstrap";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface DataItem {
  pt: string;
  name: string;
  name_users: string;
  nopol: string;
  jamMasuk: string;
  jamKeluar: string;
  km_in: string;
  km_out: string;
  lk_pp: string;
  lk_inap: string;
  km_in_images: string;
  km_out_images: string;
}

const LaporanHarian: React.FC = () => {
  const [date, setDate] = useState<string>("");
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalImage, setModalImage] = useState<string>("");
  const [idCompany, setIdCompany] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userData = await AsyncStorage.getItem("userData");
        if (userData) {
          const { id_company } = JSON.parse(userData);
          setIdCompany(id_company);

          const today = new Date();
          const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

          setDate(formattedDate);

          if (id_company) {
            await handleFilter(formattedDate, id_company);
          }
        }
      } catch (error) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const handleFilter = async (selectedDate: string, idCompany: string) => {
    setLoading(true);
    try {
      const response = await axios.get<{ data: any[] }>(
        `https://backend.sigapdriver.com/api/get_data_timesheet_api/${selectedDate}/${idCompany}/1/33`
      );

      const mappedData: DataItem[] = response.data.data.map((item) => ({
        pt: item.pt || "-",
        name: item.name || "-",
        name_users: item.name_users || "-",
        nopol: item.nopol || "-",
        jamMasuk: item.jam_masuk || "-",
        jamKeluar: item.jam_keluar || "-",
        km_in: item.km_in || "-",
        km_out: item.km_out || "-",
        lk_pp: item.lk_pp || "-",
        lk_inap: item.lk_inap || "-",
        km_in_images: item.km_in_images || "-",
        km_out_images: item.km_out_images || "-",
      }));

      setData(mappedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setDate("");
    setData([]);
  };

  const openModal = (imageUrl: string) => {
    setModalImage(imageUrl);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalImage("");
  };

  return (
    <Container>
      <Row className="mt-5">
        <Col className="text-center">
          <h1 className="text-uppercase font-weight-bold">
            Laporan Harian Driver
          </h1>
          <p className="text-uppercase font-weight-bold">{date}</p>
          <div className="d-flex justify-content-center align-items-center mt-4 gap-3 mb-4">
            <Form.Control
              type="date"
              value={date}
              onChange={handleDateChange}
              className="mb-3"
              style={{ width: "200px" }}
            />
            <Row className="justify-content-center">
              <Col xs="auto" className="mb-3">
                <Button
                  variant="dark"
                  onClick={() => handleFilter(date, idCompany || "")}
                  disabled={loading || !date || !idCompany}
                >
                  {loading ? "Memuat data..." : "Filter"}
                </Button>
              </Col>
              <Col xs="auto" className="mb-3">
                <button
                  className="btn btn-success custom-btn"
                  onClick={handleRefresh}
                >
                  Refresh
                </button>
              </Col>
            </Row>
          </div>
          <div className="table-responsive">
            <style>
              {`
                .btn-success.custom-btn {
                  background-color: #009879;
                  border-color: #009879;
                }

                .btn-success.custom-btn:hover {
                  background-color: #007f66;
                  border-color: #007f66;
                }
                .header-row {
                  background-color: rgb(4, 170, 109);
                  color: white;
                }
                .sub-header-row {
                  background-color: #138732;
                  color: white;
                  font-weight: bold;
                }
                .table-hover tbody tr:hover {
                  background-color: rgba(0, 0, 0, 0.075);
                }
                .btn-custom {
                  background-color: #ffc107;
                  color: black;
                }
                .btn-custom:hover {
                  background-color: #e0a800;
                }
                th, td {
                  white-space: nowrap;
                }
                .table-bordered th,
                .table-bordered td {
                  border: 1px solid #ACE1AF !important;
                }
                .sticky-column {
                  position: sticky;
                  left: 0;
                  background-color: #CCE2CB;
                  z-index: 3;
                }
                .sticky-header {
                  position: sticky;
                  top: 0;
                  z-index: 2;
                  background-color: #CCE2CB;
                }
                .table-bordered {
                  border-radius: 15px 15px 0 0;
                  border-top: 1px solid #009879;
                  overflow: hidden;
                }
                .table tbody tr:last-of-type {
                  border-bottom: 2px solid #009879;
                }
                .lk-pp-column {
                  word-wrap: break-word;
                  white-space: normal;
                  border : 1px solid red;
                }
              `}
            </style>
            <Table className="table table-hover table-bordered">
              <thead>
                <tr>
                  <th
                    className="text-center align-middle sticky-column"
                    style={{
                      backgroundColor: "#009879",
                      color: "white",
                    }}
                  >
                    No
                  </th>
                  <th
                    className="text-center align-middle sticky-column"
                    style={{ backgroundColor: "#009879", color: "white" }}
                  >
                    Nama Pt
                  </th>
                  <th
                    className="text-center align-middle sticky-column"
                    style={{ backgroundColor: "#009879", color: "white" }}
                  >
                    Nama
                  </th>
                  <th
                    className="text-center align-middle sticky-column"
                    style={{ backgroundColor: "#009879", color: "white" }}
                  >
                    Nama User
                  </th>
                  <th
                    className="text-center align-middle sticky-column"
                    style={{ backgroundColor: "#009879", color: "white" }}
                  >
                    Nopol
                  </th>

                  <th
                    className="text-center align-middle sticky-column"
                    style={{ backgroundColor: "#009879", color: "white" }}
                  >
                    Jam <br /> Masuk
                  </th>
                  <th
                    className="text-center align-middle sticky-column"
                    style={{ backgroundColor: "#009879", color: "white" }}
                  >
                    Jam <br /> Keluar
                  </th>
                  <th
                    className="text-center align-middle sticky-column"
                    style={{ backgroundColor: "#009879", color: "white" }}
                  >
                    Km In
                  </th>
                  <th
                    className="text-center align-middle sticky-column"
                    style={{ backgroundColor: "#009879", color: "white" }}
                  >
                    Km Out
                  </th>

                  <th
                    className="text-center align-middle sticky-column lk-pp-column"
                    style={{ backgroundColor: "#009879", color: "white" }}
                  >
                    lk pp
                  </th>
                  <th
                    className="text-center align-middle sticky-column lk-pp-column"
                    style={{ backgroundColor: "#009879", color: "white" }}
                  >
                    lk inap
                  </th>
                  <th
                    className="text-center align-middle sticky-column lk-pp-column"
                    style={{ backgroundColor: "#009879", color: "white" }}
                  >
                    Images <br /> Km In
                  </th>
                  <th
                    className="text-center align-middle sticky-column lk-pp-column"
                    style={{ backgroundColor: "#009879", color: "white" }}
                  >
                    Images <br /> Km Out
                  </th>
                  <th
                    className="text-center align-middle sticky-column"
                    style={{ backgroundColor: "#009879", color: "white" }}
                  >
                    Opsi
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={14} className="text-center">
                      Memuat data...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={14} className="text-center text-danger">
                      {error}
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={14} className="text-center">
                      No data available
                    </td>
                  </tr>
                ) : (
                  data.map((item, index) => (
                    <tr key={index}>
                      <td className="text-center">{index + 1}</td>
                      <td className="text-center">{item.pt}</td>
                      <td className="text-center">{item.name}</td>
                      <td className="text-center">{item.name_users}</td>
                      <td className="text-center">{item.nopol}</td>
                      <td className="text-center">{item.jamMasuk}</td>
                      <td className="text-center">{item.jamKeluar}</td>
                      <td className="text-center">{item.km_in}</td>
                      <td className="text-center">{item.km_out}</td>
                      <td className="text-start lk-pp-column">{item.lk_pp}</td>
                      <td className="text-start lk-pp-column">
                        {item.lk_inap}
                      </td>
                      <td>
                        {item.km_in_images && item.km_in_images !== "-" ? (
                          <img
                            src={
                              "https://backend.sigapdriver.com/storage/" +
                              item.km_in_images
                            }
                            style={{
                              width: "50px",
                              height: "50px",
                              cursor: "pointer",
                            }}
                            alt=""
                            onClick={() => openModal(item.km_in_images)}
                          />
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>
                        {item.km_out_images && item.km_out_images !== "-" ? (
                          <img
                            src={
                              "https://backend.sigapdriver.com/storage/" +
                              item.km_out_images
                            }
                            style={{
                              width: "50px",
                              height: "50px",
                              cursor: "pointer",
                            }}
                            alt=""
                            onClick={() => openModal(item.km_out_images)}
                          />
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="text-center">
                        <Button
                          className="btn btn-dark"
                          onClick={() => openModal(item.km_in_images)}
                        >
                          Detail
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Gambar Detail</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <img
            src={`https://backend.sigapdriver.com/storage/${modalImage}`}
            alt=""
            style={{ maxWidth: "50%" }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default LaporanHarian;
