import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Table, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

interface Company {
  id: string;
  namaPerusahaan: string;
  alamat: string;
  kontak: string;
  email: string;
}

const LaporanPartnerInternal: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([
    {
      id: "1",
      namaPerusahaan: "PT Epson",
      alamat: "Jl. Epson No.1",
      kontak: "021-12345678",
      email: "contact@epson.co.id",
    },
  ]);

  const location = useLocation();

  const handleCompanyClick = (id: string, namaPerusahaan: string) => {
    // Implementasi fungsi handleCompanyClick
  };

  const handleEditModalShow = (company: Company) => {
    // Implementasi fungsi handleEditModalShow
  };

  const handleDeleteCompany = (id: string) => {
    // Implementasi fungsi handleDeleteCompany
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4 text-dark font-weight-bold">Partner</h1>
      <div className="d-flex justify-content-end mb-3">
        <Link
          to="/internal/form-partner-internal"
          className={`btn btn-success ${
            location.pathname === "/internal/form-partner-internal" ? "active" : ""
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

      <Table striped bordered hover responsive className="text-center table-bordered">
        <thead>
          <tr>
            <th style={{ backgroundColor: "#009879", color: "white" }}></th>
            <th style={{ backgroundColor: "#009879", color: "white" }}>Nama Perusahaan</th>
            <th style={{ backgroundColor: "#009879", color: "white" }}>Alamat</th>
            <th style={{ backgroundColor: "#009879", color: "white" }}>Kontak</th>
            <th style={{ backgroundColor: "#009879", color: "white" }}>Email</th>
            <th style={{ backgroundColor: "#009879", color: "white" }}>Actions</th>
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
                  to="/partner-dashboard/company/company-detail"
                  style={{ color: "#007bff", fontWeight: "bold" }}
                  onClick={() => handleCompanyClick(company.id, company.namaPerusahaan)}
                >
                  {company.namaPerusahaan}
                </Link>
              </td>
              <td>{company.alamat}</td>
              <td>{company.kontak}</td>
              <td>{company.email}</td>
              <td className="actions-cell">
                <Button variant="primary" onClick={() => handleEditModalShow(company)} className="mr-2">
                  <i className="fas fa-edit"></i> Edit
                </Button>
                <Button variant="danger" onClick={() => handleDeleteCompany(company.id)}>
                  <i className="fas fa-trash-alt"></i> Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <p className="text-center mt-2">
        Showing 1 to {companies.length} of {companies.length} entries
      </p>

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
          .company-details {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .company-details .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e9ecef;
          }
          .company-details .detail-row:last-child {
            border-bottom: none;
          }
          .company-details .detail-label {
            font-weight: bold;
            color: #495057;
          }
          .company-details .detail-value {
            color: #212529;
          }
        `}
      </style>
    </div>
  );
};

export default LaporanPartnerInternal;
