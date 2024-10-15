import React, { useState,useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ModalKlaim from "./Modal_Klaim";
import ModalActivity from "./Modal_Activity";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import ApiConfig from "@app/libs/Api";

const icon = L.icon({
  iconUrl: "/img/mobil.png",
  shadowUrl: "https://leafletjs.com/examples/custom-icons/leaf-shadow.png",
  iconSize: [50, 50],
  shadowSize: [50, 50],
  iconAnchor: [25, 50],
  shadowAnchor: [25, 50],
  popupAnchor: [0, -50],
});

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
  loadingdata:boolean;
}

const DriverReportTable: React.FC<DriverReportTableProps> = ({ data,loadingdata }) => {
  const [showModal, setShowModal] = useState(false);
  const [show, setShow] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState("");
  const [open, setOpen] = useState(false);
  const [openklaim, setOpenklim] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUserIdklaim, setSelectedUserIdklaim] = useState<number | null>(
    null
  );
  const [activity, setactifity] = useState<any | null>(null);
  const [loading, setloading] = useState(true);
  const [loadingklaim, setloadingklaim] = useState(true);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showLoadingModalactivity, setShowLoadingModalactivity] = useState(false);
  const [namedriver, setnamedriver] = useState<string | null>(null);
  const [dataklaim, setklaim] = useState<any | any>(null);
  const [totalklaim, settotalklaim] = useState<any | any>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: any;
    long: any;
  } | null>({ lat: 0, long: 0 });

  // useEffect(() => {
  //     console.log()
  // }, []);

  const handleLokasiClick = (lat: any, long: any) => {
    if (lat && long) {
      setSelectedLocation({ lat, long });
      window.open(`maps/${lat}/${long}`, '_blank');
      //setShow(true);
    } else {
      alert("Data lokasi tidak tersedia");
    }
  };

  const handleCloseModal = () => {
    setShow(false);
    setSelectedLocation(null);
  };

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
    setloading(true);
    setShowLoadingModalactivity(true);

    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      const response = await ApiConfig.get(`activity/${userId}/${date}`);
      console.log("vvv", response.data.data);

      setactifity(response.data.data);
      setShowLoadingModalactivity(false);
      setloading(false);
      setSelectedUserId(userId);
      setnamedriver(name);
    } catch (error) {
      setloading(false);
      setShowLoadingModalactivity(false);
      console.error("Error fetching company info:", error);
    }
    ``;
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleOpenklaim = async (
    userId: number | null,
    date: string | null,
    name: string | null
  ) => {
    setloadingklaim(true);
    setShowLoadingModal(true); // Tampilkan modal loading

    // Tambahkan delay 3 detik (3000 ms)
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const response = await ApiConfig.get(`pengeluaran/${userId}/${date}`);
      console.log("cekdancek", response.data.data);
      setklaim(response.data.data);
      setloadingklaim(false);
      setShowLoadingModal(false); // Sembunyikan modal loading
      setSelectedUserIdklaim(userId);
      setnamedriver(name);
      settotalklaim(response.data.total_expenses);
    } catch (error) {
      console.error("Error fetching company info:", error);
      setloadingklaim(false);
      setShowLoadingModal(false); // Pastikan untuk mengubah loading state jika ada error
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
          .der {
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
          .spinner {
           border: 4px solid #f3f3f3; 
           border-top: 4px solid #009879;
           border-radius: 50%;
           width: 40px;
           height: 40px;
           animation: spin 2s linear infinite;
          }
          @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
          }
            
        `}
      </style>
      <table className="table table-hover table-bordered">
        <thead>
          <tr className="header-row der">
            <th
              colSpan={1}
              rowSpan={2}
              className=" text-center sticky-column align-middle"
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
                        {timesheet.lk_pp &&
                        timesheet.lk_pp.split(",").includes("null")
                          ? "-"
                          : timesheet.lk_pp}
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
                                      <th>Lokasi</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {!loading ? (
                                      Array.from(new Set(activity.map(item => item.city)))
                                        .map(city => {
                                          const val = activity.find(item => item.city === city);
                                          if (val.lat && val.long) {
                                            return (
                                              <tr key={city}>
                                                <td>{city}</td>
                                                <td>{val.type}</td>
                                                <td>
                                                  <Button
                                                    className="btn btn-dark btn-sm"
                                                    onClick={() =>
                                                      handleLokasiClick(
                                                        val.lat,
                                                        val.long
                                                      )
                                                    }
                                                  >
                                                    Lihat Lokasi
                                                  </Button>
                                                </td>
                                              </tr>
                                            );
                                          }
                                          return null;
                                        }).filter(Boolean)
                                    ) : (
                                      <tr>
                                        <td colSpan={3}>Loading...</td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                              <Modal show={show} onHide={handleCloseModal} centered>
                                <Modal.Header closeButton>
                                  <Modal.Title>Lokasi</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                  {selectedLocation && (
                                    <div style={{ height: '400px', width: '100%' }}>
                                      <MapContainer
                                        center={[selectedLocation.lat, selectedLocation.long]}
                                        zoom={15}
                                        style={{ height: '100%', width: '100%' }}
                                      >
                                        {(map) => {
                                          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                                            attribution: '',
                                          }).addTo(map);
                                          return null;
                                        }}
                                        <Marker position={[selectedLocation.lat, selectedLocation.long]} icon={icon}>
                                          <Popup>
                                            Lokasi yang dipilih
                                          </Popup>
                                        </Marker>
                                      </MapContainer>
                                    </div>
                                  )}
                                </Modal.Body>
                              </Modal>
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
                                <Box>
                                  Total :{" "}
                                  {new Intl.NumberFormat("id-ID").format(
                                    totalklaim
                                  )}
                                </Box>
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
                                      <th>Foto</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {!loadingklaim ? (
                                      dataklaim.map((val: any, index: any) => (
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
                                            {new Intl.NumberFormat(
                                              "id-ID"
                                            ).format(val.expenses_value)}
                                          </td>
                                          <td>{val.expenses_notes}</td>
                                          <td>
                                            <img
                                              src={`http://backend.sigapdriver.com/storage/${val.expenses_photo}`}
                                              alt="Foto Pengeluaran"
                                              style={{ width: '100px', height: 'auto' }}
                                              onClick={() => handleImageClick(`http://backend.sigapdriver.com/storage/${val.expenses_photo}`)}
                                            />
                                          </td>
                                        </tr>
                                      ))
                                    ) : (
                                      <tr>
                                        <td colSpan={4}><center><div className="spinner"></div></center></td>
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
      <Modal show={showLoadingModal} backdrop="static" keyboard={false} centered>
        <Modal.Body className="d-flex justify-content-center align-items-center">
          <div>
            <center>
              <h5>Loading...</h5>
              <div className="spinner"></div>
            </center>
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={showLoadingModalactivity} backdrop="static" keyboard={false} centered>
        <Modal.Body className="d-flex justify-content-center align-items-center">
          <div>
            <center>
              <h5>Loading...</h5>
              <div className="spinner"></div>
            </center>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DriverReportTable;
