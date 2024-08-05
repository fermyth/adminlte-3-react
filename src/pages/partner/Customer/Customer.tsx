import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Table, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrashAlt, FaCar } from "react-icons/fa";

interface Company {
  id: number;
  nama_perusahaan: string;
  alamat: string;
  kontak: string;
  email: string;
  image?: string;
  partnerId?: number;
  createdAt?: string;
  updatedAt?: string;
}

const Customer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [companies, setCompanies] = useState<Company[]>([]);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch("http://localhost:5182/api/v1/perusahaan");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: Company[] = await response.json();
        setCompanies(data);
      } catch (error) {
        console.error("Failed to fetch companies:", error);
        toast.error("Gagal memuat data perusahaan.");
      }
    };

    fetchCompanies();
  }, [location.key]);

  const handleEditCompany = (company: Company) => {
    navigate(`/partner-dashboard/update-form-perusahaan`, {
      state: { company },
    });
  };

  const handleDeleteCompany = (id: number) => {
    const confirmDelete = window.confirm(
      "Apakah Anda yakin ingin menghapus data ini?"
    );
    if (confirmDelete) {
      setCompanies(companies.filter((company) => company.id !== id));
      toast.success("Data berhasil dihapus!");
    }
  };

  const handleCarButtonClick = () => {
    navigate("/internal/mobil-internal");
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4 text-dark font-weight-bold">
        Perusahaan
      </h1>
      <div className="d-flex justify-content-end mb-3">
        <Link
          to="/partner-dashboard/form-perusahaan"
          className={`btn btn-success ${
            location.pathname === "/internal/form-perusahaan-internal"
              ? "active"
              : ""
          }`}
          style={{
            fontWeight: "bold",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          <i className="fas fa-plus"></i> Tambah Baru
        </Link>
      </div>

      <Table
        striped
        bordered
        hover
        responsive
        className="text-center table-bordered"
      >
        <thead>
          <tr>
            <th style={{ backgroundColor: "#009879", color: "white" }}></th>
            <th style={{ backgroundColor: "#009879", color: "white" }}>
              Nama Perusahaan
            </th>
            <th style={{ backgroundColor: "#009879", color: "white" }}>
              Alamat
            </th>
            <th style={{ backgroundColor: "#009879", color: "white" }}>
              Kontak
            </th>
            <th style={{ backgroundColor: "#009879", color: "white" }}>
              Email
            </th>
            <th style={{ backgroundColor: "#009879", color: "white" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.id}>
              <td>
                <Form.Check type="checkbox" />
              </td>
              <td>
                <Link
                  to={`/internal/perusahaan_internal/${company.id}`}
                  style={{ color: "#007bff", fontWeight: "bold" }}
                >
                  {company.nama_perusahaan}
                </Link>
              </td>
              <td>{company.alamat}</td>
              <td>{company.kontak}</td>
              <td>{company.email}</td>
              <td className="actions-cell">
                <Button
                  variant="info"
                  onClick={() =>
                    navigate(`/partner-dashboard/add-mobil/${company.id}`)
                  }
                  className={`btn btn-info ${
                    location.pathname.includes("add-mobil") ? "active" : ""
                  }`}
                  style={{
                    fontWeight: "bold",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  <FaCar style={{ marginRight: "5px" }} /> Mobil
                </Button>

                <Button
                  variant="primary"
                  onClick={() => handleEditCompany(company)}
                  className={`btn btn-primary ${
                    location.pathname.includes("update-form-perusahaan")
                      ? "active"
                      : ""
                  }`}
                  style={{
                    fontWeight: "bold",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  <FaEdit style={{ marginRight: "5px" }} /> Edit
                </Button>

                <Button
                  variant="danger"
                  onClick={() => handleDeleteCompany(company.id)}
                  style={{
                    fontWeight: "bold",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  <FaTrashAlt style={{ marginRight: "5px" }} /> Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <p className="text-center mt-2">
        Showing 1 to {companies.length} of {companies.length} entries
      </p>

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
          .actions-cell .btn {
            margin-right: 5px;
          }
        `}
      </style>
    </div>
  );
};

export default Customer;
