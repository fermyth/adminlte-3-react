import React, { useState, useEffect } from "react";
import { Button, Container, Row, Col, Form, Table } from "react-bootstrap";
import axios from "axios";

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

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const handleFilter = async () => {
    if (!date) {
      alert("Silakan pilih tanggal terlebih dahulu.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get<{ data: any[] }>(
        `https://backend.sigapdriver.com/api/get_data_timesheet_api/${date}/-/1/33`
      );

      console.log("Response Data:", response.data.data);
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
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setDate("");
    setData([]);
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
                  onClick={handleFilter}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Filter"}
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
                    Lk Pp
                  </th>
                  <th
                    className="text-center align-middle sticky-column lk-pp-column"
                    style={{ backgroundColor: "#009879", color: "white" }}
                  >
                    Lk Inap
                  </th>
                  <th
                    className="text-center align-middle sticky-column"
                    style={{ backgroundColor: "#009879", color: "white" }}
                  >
                    Images <br /> Km In
                  </th>
                  <th
                    className="text-center align-middle sticky-column"
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
                {data.map((item, index) => (
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
                    <td className="text-start lk-pp-column">{item.lk_inap}</td>
                    <td>
                      <img
                        src={
                          "https://backend.sigapdriver.com/storage/" +
                          item.km_in_images
                        }
                        style={{ width: "50px", height: "50px" }}
                        alt=""
                      />
                    </td>
                    <td>
                      <img
                        src={
                          "https://backend.sigapdriver.com/storage/" +
                          item.km_out_images
                        }
                        style={{ width: "50px", height: "50px" }}
                        alt=""
                      />
                    </td>
                    <td className="text-center">
                      <Button className="btn btn-dark">Detail</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LaporanHarian;
