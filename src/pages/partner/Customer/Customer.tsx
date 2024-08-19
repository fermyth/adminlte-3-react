import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Table, Button, Dropdown, DropdownButton } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrashAlt, FaCar } from "react-icons/fa";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import { ApiPartner,UrlServer } from "@app/libs/Api";

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
  const url_partner = ApiPartner()
  const url = UrlServer()

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
            `${url_partner}/perusahaan/${idCompany}`
          );
          console.log('rescus',response)
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data: Company[] = await response.json();
          console.log("adada", data.perusahaanList);

          setCompanies(data.perusahaanList);
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
    image: string
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
    localStorage.setItem(
      "selecteddataCompany",
      JSON.stringify(selectedCompany)
    );
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

  const columns = [
    {
      dataField: "id",
      text: "No",
      headerStyle: { backgroundColor: "#009879", color: "white" },
      sort: true,
    },
    {
      dataField: "nama_perusahaan",
      text: "Company Name",
      headerStyle: { backgroundColor: "#009879", color: "white" },
      sort: true,
      formatter: (cell: string, row: Company) => (
        <span
          style={{ color: "#007bff", fontWeight: "bold", cursor: "pointer" }}
          onClick={() =>
            handleCompanyClick(
              row.id.toString(),
              row.nama_perusahaan,
              row.id.toString(),
              row.alamat,
              row.kontak,
              row.image || ""
            )
          }
        >
          {cell}
        </span>
      ),
    },
    {
      dataField: "alamat",
      text: "Address",
      headerStyle: { backgroundColor: "#009879", color: "white" },
      sort: true,
      formatter: (cell: string | null) => (!cell || cell === "0" ? "-" : cell),
    },
    {
      dataField: "kontak",
      text: "Contact",
      headerStyle: { backgroundColor: "#009879", color: "white" },
      sort: true,
      formatter: (cell: string | null) => (!cell || cell === "0" ? "-" : cell),
    },
    {
      dataField: "email",
      text: "Email",
      headerStyle: { backgroundColor: "#009879", color: "white" },
      sort: true,
      formatter: (cell: string | null) => (!cell || cell === "0" ? "-" : cell),
    },
    {
      dataField: "_count.tb_mobil",
      text: "Total Car",
      headerStyle: { backgroundColor: "#009879", color: "white" },
      sort: true,
      formatter: (cell: number | null) => (!cell || cell === 0 ? "-" : cell),
    },
    {
      dataField: "actions",
      text: "Actions",
      headerStyle: { backgroundColor: "#009879", color: "white" },
      formatter: (cell: any, row: Company) => (
        <DropdownButton
          id="dropdown-basic-button"
          title="Actions"
          variant="info"
          className="actions-dropdown"
        >
          <Dropdown.Item
            onClick={() =>
              handleCompanyClick(
                row.id.toString(),
                row.nama_perusahaan,
                row.id.toString(),
                row.alamat,
                row.kontak,
                row.image || ""
              )
            }
          >
            <FaCar style={{ marginRight: "5px" }} /> Detail Mobil
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleEditCompany(row)}>
            <FaEdit style={{ marginRight: "5px" }} /> Edit
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleDeleteCompany(row.id)}>
            <FaTrashAlt style={{ marginRight: "5px" }} /> Delete
          </Dropdown.Item>
        </DropdownButton>
      ),
    },
  ];

  const { SearchBar } = Search;

  return (
    <div className="container mt-5mb-5 ">
      <h1 className="text-center mb-4 text-dark font-weight-bold">Customer</h1>
      <div className="d-flex justify-content-end mb-3">
        <Link
          to={`/partner-dashboard/form-perusahaan/${idCompany}`}
          className={`btn btn-success ${
            location.pathname ===
            `/internal/form-perusahaan-internal/${idCompany}`
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
          <i className="fas fa-plus"></i> Add New
        </Link>
      </div>
      
      <ToolkitProvider keyField="id" data={companies} columns={columns} search>
        {(props) => (
          <div>
            <div className="mb-3">
              <SearchBar
                {...props.searchProps}
                placeholder="Search"
                className="form-control"
              />
            </div>
            <BootstrapTable
              {...props.baseProps}
              bootstrap4
              striped
              hover
              bordered={false}
              pagination={paginationFactory({
                sizePerPage: 10,
                showTotal: true,
              })}
              classes="table"
            />
          </div>
        )}
      </ToolkitProvider>

      <ToastContainer />
      <br></br>
      <br></br>
      <br></br>

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
