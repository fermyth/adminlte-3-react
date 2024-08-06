import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Table, Button, Row, Col } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";

interface Car {
  id: string;
  tipe_kendaraan: string;
  pembuat: string;
  tahun: string;
  warna_kendaraan: string;
  nopol: string;
  biaya_sewa: string;
  jangka_waktu_sewa: string;
  tb_perusahaan: {
    nama_perusahaan: string;
  };
}

const MobilPartner: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const navigate = useNavigate();
  const { perusahaanID } = useParams();

  useEffect(() => {
    if (perusahaanID) {
      const fetchCars = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5182/api/v1/mobil/${perusahaanID}`
          );
          if (Array.isArray(response.data)) {
            setCars(response.data);
          } else {
            toast.error("Invalid data format received");
          }
        } catch (error) {
          console.error("Error fetching car data:", error);
          toast.error("Error fetching car data");
        }
      };

      fetchCars();
    } else {
      toast.error("Perusahaan ID tidak ditemukan di URL");
    }
  }, [perusahaanID]);

  const handleDeleteCar = async (carId: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        await axios.delete(`http://localhost:5182/api/v1/mobil/${carId}`);
        setCars(cars.filter((car) => car.id !== carId));
        toast.success("Data berhasil dihapus!");
      } catch (error) {
        console.error("Error deleting car data:", error);
        toast.error("Error deleting car data");
      }
    }
  };

  return (
    <div className="p-4 mt-5">
      <Row className="mb-4">
        <Col>
          <h1 className="text-dark font-weight-bold">Mobil Perusahaan</h1>
        </Col>
        <Col className="text-right">
          <Link
            to="/partner-dashboard/add-mobil-partner"
            className="btn btn-success d-inline-flex align-items-center font-weight-bold"
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
              "Biaya Sewa",
              "jangkwa_waktu_sewa",
              "Perusahaan",
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
              <td>{car.tipe_kendaraan}</td>
              <td>{car.pembuat}</td>
              <td>{car.tahun}</td>
              <td>{car.warna_kendaraan}</td>
              <td>{car.nopol}</td>
              <td>{car.biaya_sewa}</td>
              <td>{car.jangka_waktu_sewa}</td>
              <td>{car.tb_perusahaan.nama_perusahaan}</td>
              {/* {["photo1", "photo2", "photo3", "photo4"].map((photo, index) => (
                <td key={index}>
                  {car[photo as keyof Car] ? (
                    <img
                      src={car[photo as keyof Car]}
                      alt={`Photo ${index + 1}`}
                      style={{ width: "50px" }}
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </td>
              ))} */}
              <td>
                <Link
                  to={`/internal/update-form-mobil-internal`}
                  state={{ car }}
                  className="btn btn-primary d-inline-flex align-items-center font-weight-bold mr-2"
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
