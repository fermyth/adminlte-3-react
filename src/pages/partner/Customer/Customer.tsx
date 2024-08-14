import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Table, Button, Dropdown, DropdownButton } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrashAlt, FaCar } from "react-icons/fa";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Company {
  id: number;
  nama_perusahaan: string;
  alamat: string;
  kontak: string;
  email: string;
  image?: string;
  _count: {
    tb_mobil: number;
  };
  partnerId?: number;
  createdAt?: string;
  updatedAt?: string;
}

const Customer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [idCompany, setIdCompany] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // get id company
        const userData = await AsyncStorage.getItem("userData");
        if (userData) {
          const getstorage = JSON.parse(userData);
          setIdCompany(getstorage.id_company);
        } else {
          setIdCompany(null);
        }
      } catch (error) {
        setError("Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (idCompany) {
      const fetchCompanies = async () => {
        try {
          const response = await fetch(
            `https://api_partner_staging.sigapdriver.com/api/v1/perusahaan/${idCompany}`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data: Company[] = await response.json();
          console.log("adada", data);

          setCompanies(data);
        } catch (error) {
          console.error("Failed to fetch companies:", error);
          toast.error("Gagal memuat data perusahaan.");
        }
      };

      fetchCompanies();
    }
  }, [idCompany, location.key]);

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

  const handleCompanyClick = (
    idcomp: string,
    nama_customer: string,
    idperusahaan: string,
    alamat: string,
    kontak: string,
    image:string
  ) => {
    const selectedCompany = {
      idcomp,
      nama_customer,
      idperusahaan,
      alamat,
      kontak,
      image,
    };
    // alert(idcomp)
    localStorage.setItem("selecteddataCompany", JSON.stringify(selectedCompany));
    navigate("/partner-dashboard/customer/costumer-detail");
  };

  const handleCarButtonClick = () => {
    navigate("/internal/mobil-internal");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4 text-dark font-weight-bold">Customer</h1>
      <div className="d-flex justify-content-end mb-3">
        <Link
          to={`/partner-dashboard/form-perusahaan/${idCompany}`}
          className={`btn btn-success ${
            location.pathname === `/internal/form-perusahaan-internal/${idCompany}`
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
            <th style={{ backgroundColor: "#009879", color: "white" }}>Nomor</th>
            <th style={{ backgroundColor: "#009879", color: "white" }}>
              Nama Perusahaan
            </th>
            <th style={{ backgroundColor: "#009879", color: "white" }}>Alamat</th>
            <th style={{ backgroundColor: "#009879", color: "white" }}>Kontak</th>
            <th style={{ backgroundColor: "#009879", color: "white" }}>Email</th>
            <th style={{ backgroundColor: "#009879", color: "white" }}>Mobil</th>
            <th style={{ backgroundColor: "#009879", color: "white" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company, index) => (
            <tr key={company.id}>
              <td>{index + 1}</td>
              <td className="align-middle">
                <span
                  // to="/partner-dashboard/customer/costumer-detail"
                  style={{ color: "#007bff", fontWeight: "bold" }}
                  onClick={() =>
                    handleCompanyClick(
                      company.id_company.toString(),
                      company.nama_perusahaan,
                      company.id,
                      company.alamat,
                      company.kontak,
                      company.image,
                    )
                  }
                >
                  {company.nama_perusahaan}
                </span>
              </td>
              <td className="align-middle">{company.alamat}</td>
              <td className="align-middle">{company.kontak}</td>
              <td className="align-middle">{company.email}</td>
              <td className="align-middle">{company._count.tb_mobil}</td>
              <td className="actions-cell align-middle">
                <DropdownButton
                  id="dropdown-basic-button"
                  title="Actions"
                  variant="info"
                  className="actions-dropdown"
                >
                  <Dropdown.Item
                    onClick={() =>
                      handleCompanyClick(
                        company.id_company.toString(),
                        company.nama_perusahaan,
                        company.id,
                        company.alamat,
                        company.kontak,
                        company.image
                      )
                    }
                  >
                    <FaCar style={{ marginRight: "5px" }} /> Detail Mobil
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleEditCompany(company)}>
                    <FaEdit style={{ marginRight: "5px" }} /> Edit
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleDeleteCompany(company.id)}>
                    <FaTrashAlt style={{ marginRight: "5px" }} /> Delete
                  </Dropdown.Item>
                </DropdownButton>
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
           .container {
            max-width: 1300px;
            }
          .table-bordered {
            border-radius: 15px 15px 0 0;
            border-top: 1px solid #009879;
            overflow: hidden;
          }
          .table tbody tr:last-of-type {
            border-bottom: 2px solid #009879;
          }
          .actions-cell .actions-dropdown {
            display: inline-block;
            margin-right: 5px;
          }
          .dropdown-item:hover {
            background-color: #17a2b8;
            color: white;
          }
        `}
      </style>
    </div>
  );
};

export default Customer;
