import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Table, Button, Row, Col } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";

interface Car {
  id: string;
  namaMobil: string;
  jenisMobil: string;
  tahun: string;
  warnaKendaraan: string;
  nopol: string;
  nomorRangka: string;
  nomorMesin: string;
  pilihanAksesoris: string;
  biayaSewa: string;
  perusahaan: string;
  photo1: string;
  photo2: string;
  photo3: string;
  photo4: string;
}

const MobilPartner: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [cars, setCars] = useState<Car[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      // Gantilah dengan pengambilan data mobil berdasarkan ID perusahaan
      const updatedCars: Car[] = [
        {
          id: "1",
          namaMobil: "Toyota Avanza",
          jenisMobil: "MPV",
          tahun: "2022",
          warnaKendaraan: "Hitam",
          nopol: "B 1234 CD",
          nomorRangka: "1234567890",
          nomorMesin: "0987654321",
          pilihanAksesoris: "GPS, AC",
          biayaSewa: "500000",
          perusahaan: "PT Toyota",
          photo1: "photo1_url",
          photo2: "photo2_url",
          photo3: "photo3_url",
          photo4: "photo4_url",
        },
      ];
      setCars(updatedCars);
    };

    fetchCars();
  }, [id]);

  const handleDeleteCar = (carId: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      setCars(cars.filter((car) => car.id !== carId));
      toast.success("Data berhasil dihapus!");
    }
  };

  return (
    <div className="container mt-5">
      <Row className="mb-4">
        <Col>
          <h1 className="text-dark font-weight-bold">Mobil Perusahaan</h1>
        </Col>
        <Col className="text-right">
          <Link
            to="/partner-dashboard/add-mobil-partner"
            className="btn btn-success d-inline-flex align-items-center font-weight-bold"
            style={{ textDecoration: "none" }}
          >
            <FaPlus className="mr-1" /> Create
          </Link>
        </Col>
      </Row>
      <Table
        striped
        bordered
        hover
        responsive
        className="text-center table-bordered"
      >
        <thead>
          <tr>
            {[
              "Tipe kendaraan",
              "Pembuat",
              "Tahun",
              "Warna Kendaraan",
              "Nopol",
              "Nomor Rangka",
              "Nomor Mesin",
              "Pilihan Aksesoris",
              "Biaya Sewa",
              "Perusahaan",
              "Photo 1",
              "Photo 2",
              "Photo 3",
              "Photo 4",
              "Actions",
            ].map((header) => (
              <th
                key={header}
                style={{ backgroundColor: "#009879", color: "white" }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            <tr key={car.id}>
              <td>{car.namaMobil}</td>
              <td>{car.jenisMobil}</td>
              <td>{car.tahun}</td>
              <td>{car.warnaKendaraan}</td>
              <td>{car.nopol}</td>
              <td>{car.nomorRangka}</td>
              <td>{car.nomorMesin}</td>
              <td>{car.pilihanAksesoris}</td>
              <td>{car.biayaSewa}</td>
              <td>{car.perusahaan}</td>
              {["photo1", "photo2", "photo3", "photo4"].map((photo, index) => (
                <td key={index}>
                  <img
                    src={car[photo as keyof Car]}
                    alt={`Photo ${index + 1}`}
                    style={{ width: "50px" }}
                  />
                </td>
              ))}
              <td>
                <Link
                  to={`/internal/update-form-mobil-internal`}
                  state={{ car }}
                  className="btn btn-primary d-inline-flex align-items-center font-weight-bold mr-2"
                  style={{ textDecoration: "none" }}
                >
                  <FaEdit className="mr-1" /> Edit
                </Link>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteCar(car.id)}
                  className="d-inline-flex align-items-center font-weight-bold"
                >
                  <FaTrashAlt className="mr-1" /> Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <ToastContainer />
      <style>
        {`
          .table-bordered {
            border-radius: 15px 15px 0 0;
            border-top: 1px solid #009879;
            overflow: hidden;
          }
          .table tbody tr:last-of-type {
            border-bottom: 2px solid #009879;
          }
          .btn {
            margin-right: 5px;
          }
        `}
      </style>
    </div>
  );
};

export default MobilPartner;
