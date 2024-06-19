import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ModalKlaim from "./Modal_Klaim";
import ModalActivity from "./Modal_Activity";
import axios from "axios";

const style = {
  position: "absolute" as "absolute",
  top: "0%",
  left: "0%",
  transform: "translate(-20%, -0%)",
  width: 800,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 1,
};

interface Timesheet {
  jam_masuk: string;
  jam_keluar: string;
  km_in: string;
  km_out: string;
  lk_pp: string | null;
  lk_inap: string;
  lain_lain: string;
  nopol: string | null;
  name_users: string;
  km_in_images: string | null;
  km_out_images: string | null;
  lat_km_in: string | null;
  long_km_in: string | null;
  lat_km_out: string | null;
  long_km_out: string | null;
  lat_lk_pp: string | null;
  long_lk_pp: string | null;
  lat_lk_inap: string | null;
  long_lk_inap: string | null;
}

interface DriverData {
  nama: string | null;
  name_users: string;
  user_id: number | null;
  timesheet: { [key: string]: Timesheet };
}

interface DriverReportTableProps {
  data: DriverData[];
}

const DriverReportTable: React.FC<DriverReportTableProps> = ({ data }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState("");
  const [open, setOpen] = useState(false);
  const [openklaim, setOpenklim] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUserIdklaim, setSelectedUserIdklaim] = useState<number | null>(
    null
  );
  const [activity, setactifity] = useState(null);
  const [loading, setloading] = useState(true);
  const [loadingklaim, setloadingklaim] = useState(true);
  const [namedriver, setnamedriver] = useState(null);
  const [dataklaim, setklaim] = useState(null);
  const [totalklaim, settotalklaim] = useState(null);

  const openModal = (imageUrl: string) => {
    setModalImageUrl(imageUrl);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalImageUrl("");
  };

  const handleOpen = async (
    userId: number | null,
    date: string | null,
    name: string | null
  ) => {
    try {
      const response = await axios.get(
        `https://backend.sigapdriver.com/api/detail_activity/${userId}/${date}`
      );
      console.log("cekdancek", response.data.data);
      setactifity(response.data.data);
      setloading(false);
      setSelectedUserId(userId);
      setnamedriver(name);
    } catch (error) {
      console.error("Error fetching company info:", error);
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleOpenklaim = async (
    userId: number | null,
    date: string | null,
    name: string | null
  ) => {
    try {
      const response = await axios.get(
        `https://backend.sigapdriver.com/api/pengeluaran/${userId}/${date}`
      );
      console.log("cekdancek", response.data);
      setklaim(response.data.data);
      setloadingklaim(false);
      setSelectedUserIdklaim(userId);
      setnamedriver(name);
      settotalklaim(response.data.total[0].sum_expenses);
    } catch (error) {
      console.error("Error fetching company info:", error);
    }
    setOpenklim(true);
  };

  const handleCloseklaim = () => setOpenklim(false);

  const defaultDates = [new Date().toISOString().split("T")[0]];
  const allDates =
    data.length > 0
      ? Array.from(new Set(data.flatMap((item) => Object.keys(item.timesheet))))
      : defaultDates;

  return (
    <div className="table-responsive">
      <style>
        {`
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
            border: 1px solid red;
          }
        `}
      </style>
      <table className="table table-hover table-bordered">
        <thead>
          <tr className="header-row">
            <th
              colSpan={1}
              rowSpan={2}
              className="der text-center sticky-column align-middle"
              style={{ backgroundColor: "#009879", color: "white" }}
            >
              Nama
            </th>
            {allDates.map((date) => (
              <React.Fragment key={date}>
                <th
                  colSpan={10}
                  className="text-center"
                  style={{ backgroundColor: "#009879", color: "white" }}
                >
                  Tanggal {date}
                </th>
              </React.Fragment>
            ))}
          </tr>
          <tr className="sub-header-row text-center">
            {allDates.map((date) => (
              <React.Fragment key={date}>
                <th
                  className="align-middle"
                  style={{ backgroundColor: "#009879", color: "white" }}
                >
                  Jam Masuk
                </th>
                <th
                  className="align-middle"
                  style={{ backgroundColor: "#009879", color: "white" }}
                >
                  Jam Keluar
                </th>
                <th
                  className="align-middle"
                  style={{ backgroundColor: "#009879", color: "white" }}
                >
                  KM IN
                </th>
                <th
                  className="align-middle"
                  style={{ backgroundColor: "#009879", color: "white" }}
                >
                  KM OUT
                </th>
                <th
                  className="lk-pp-column align-middle"
                  style={{ backgroundColor: "#009879", color: "white" }}
                >
                  LK pp
                </th>
                <th
                  className="lk-pp-column align-middle"
                  style={{ backgroundColor: "#009879", color: "white" }}
                >
                  LK inap
                </th>
                <th
                  className="align-middle"
                  style={{ backgroundColor: "#009879", color: "white" }}
                >
                  Images Km In
                </th>
                <th
                  className="align-middle"
                  style={{ backgroundColor: "#009879", color: "white" }}
                >
                  Images Km Out
                </th>
                <th
                  className="align-middle"
                  style={{ backgroundColor: "#009879", color: "white" }}
                >
                  Nama Users
                </th>
                <th
                  className="align-middle"
                  style={{ backgroundColor: "#009879", color: "white" }}
                >
                  Laporan Opsi Detail
                </th>
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index}>
                <td className="sticky-column">{item.nama}</td>
                {allDates.map((date) => {
                  const timesheet = item.timesheet[date];
                  return timesheet ? (
                    <React.Fragment key={date}>
                      <td className="text-center">{timesheet.jam_masuk}</td>
                      <td className="text-center">{timesheet.jam_keluar}</td>
                      <td className="text-center">{timesheet.km_in}</td>
                      <td className="text-center">{timesheet.km_out}</td>
                      <td className="text-center lk-pp-column">
                        {timesheet.lk_pp || "-"}
                      </td>
                      <td className="text-center lk-pp-column">
                        {timesheet.lk_inap}
                      </td>
                      <td className="text-center">
                        {timesheet.km_in_images &&
                        timesheet.km_in_images !== "-" ? (
                          <img
                            src={`https://backend.sigapdriver.com/storage/${timesheet.km_in_images}`}
                            alt="Km In"
                            className="img-fluid"
                            style={{ width: "50px", height: "50px" }}
                            onClick={() =>
                              openModal(
                                `https://backend.sigapdriver.com/storage/${timesheet.km_in_images}`
                              )
                            }
                          />
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="text-center">
                        {timesheet.km_out_images &&
                        timesheet.km_out_images !== "-" ? (
                          <img
                            src={`https://backend.sigapdriver.com/storage/${timesheet.km_out_images}`}
                            alt="Km Out"
                            className="img-fluid"
                            style={{ width: "50px", height: "50px" }}
                            onClick={() =>
                              openModal(
                                `https://backend.sigapdriver.com/storage/${timesheet.km_out_images}`
                              )
                            }
                          />
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="text-center">{timesheet.name_users}</td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <Button
                            onClick={() =>
                              handleOpen(item.user_id, date, item.nama)
                            }
                            className="btn btn-dark btn-sm"
                          >
                            Activity
                          </Button>

                          <Modal
                            show={open && selectedUserId === item.user_id}
                            onHide={handleClose}
                          >
                            <Box sx={style}>
                              <Typography
                                id="modal-modal-title"
                                variant="h6"
                                component="h2"
                              >
                                <Box>Nama : {namedriver}</Box>
                              </Typography>
                              <div className="table-responsive">
                                <style>
                                  {`
            .table {
              width: 100%;
              background-color: #f8f9fa;
              border-collapse: collapse;
              border-radius: 0.25em;
              overflow: hidden;
              box-shadow: 0 0 0 1px #e0e0e0 inset;
              border-radius: 0.5em;
            }
            .table th,
            .table td {
              padding: 0.5em 1em;
              border-bottom: 1px solid #e0e0e0;
              border-right: 1px solid #e0e0e0;
              text-align: left;
              vertical-align: middle;
            }
            .table th {
              background-color: #009879;
              color: white;
              font-weight: bold;
            }
            .table td {
              background-color: #ffffff;
            }
          `}
                                </style>
                                <table className="table">
                                  <thead>
                                    <tr>
                                      <th>Kota</th>
                                      <th>Type</th>
                                      {/* <th>Lokasi</th> */}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {!loading ? (
                                      activity.map((val, index) => (
                                        <tr key={index}>
                                          <td>{val.city}</td>
                                          <td>{val.type}</td>
                                          {/* <td>{val.description}</td> */}
                                        </tr>
                                      ))
                                    ) : (
                                      <tr>
                                        <td colSpan="3">Loading...</td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </Box>
                          </Modal>

                          <Button
                            onClick={() =>
                              handleOpenklaim(item.user_id, date, item.nama)
                            }
                            className="btn btn-dark btn-sm"
                          >
                            Klaim
                          </Button>

                          <Modal
                            show={
                              openklaim && selectedUserIdklaim === item.user_id
                            }
                            onHide={handleCloseklaim}
                          >
                            <Box sx={style}>
                              <Typography
                                id="modal-modal-title"
                                variant="h6"
                                component="h2"
                              >
                                <Box>Nama : {namedriver}</Box>
                                <Box>Total : {new Intl.NumberFormat('id-ID').format(totalklaim)}</Box>
                              </Typography>
                              <div className="table-responsive">
                                <style>
                                  {`
            .table {
              width: 100%;
              background-color: #f8f9fa;
              border-collapse: collapse;
              border-radius: 0.25em;
              overflow: hidden;
              box-shadow: 0 0 0 1px #e0e0e0 inset;
              border-radius: 0.5em;
            }
            .table th,
            .table td {
              padding: 0.5em 1em;
              border-bottom: 1px solid #e0e0e0;
              border-right: 1px solid #e0e0e0;
              text-align: left;
              vertical-align: middle;
            }
            .table th {
              background-color: #009879;
              color: white;
              font-weight: bold;
            }
            .table td {
              background-color: #ffffff;
            }
          `}
                                </style>
                                <table className="table">
                                  <thead>
                                    <tr>
                                      <th>Tipe</th>
                                      <th>Nominal</th>
                                      <th>Keterangan</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {!loadingklaim ? (
                                      dataklaim.map((val, index) => (
                                        <tr key={index}>
                                          <td>
                                            {val.expenses_type === 0 &&
                                              "Parkir Umum"}
                                            {val.expenses_type === 1 && "Toll"}
                                            {val.expenses_type === 2 &&
                                              "Isi Bensin"}
                                            {val.expenses_type === 3 &&
                                              "Lain Lain"}
                                            {val.expenses_type === 4 &&
                                              "Parkir Liar"}
                                          </td>
                                          <td>
                                          {new Intl.NumberFormat('id-ID').format(val.expenses_value)}
                                          </td>
                                          <td>{val.expenses_notes}</td>
                                        </tr>
                                      ))
                                    ) : (
                                      <tr>
                                        <td colSpan="3">Loading...</td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </Box>
                          </Modal>
                        </div>
                      </td>
                    </React.Fragment>
                  ) : (
                    <React.Fragment key={date}>
                      <td className="text-center">-</td>
                      <td className="text-center">-</td>
                      <td className="text-center">-</td>
                      <td className="text-center">-</td>
                      <td className="text-center">-</td>
                      <td className="text-center">-</td>
                      <td className="text-center">-</td>
                      <td className="text-center">-</td>
                      <td className="text-center">-</td>
                      <td className="text-center">-</td>
                    </React.Fragment>
                  );
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td className="text-center" colSpan={allDates.length * 10 + 1}>
                Mohon untuk isi form date nya ..
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Modal untuk menampilkan gambar */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Gambar Detail</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <img
            src={modalImageUrl}
            alt="Gambar Detail"
            className="img-fluid"
            style={{ maxWidth: "50%" }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DriverReportTable;
