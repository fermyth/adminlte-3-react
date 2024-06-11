import React, { useState } from 'react';
import { Button, Container, Row, Col, Form, Table } from 'react-bootstrap';

const LaporanHarian = () => {
  const [date, setDate] = useState('2024-06-05');

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const handleFilter = () => {
    // Handle filter logic here, e.g., fetch data based on date
    console.log('Filter clicked', date);
  };

  const handleRefresh = () => {
    // Handle refresh logic here, e.g., fetch latest data
    console.log('Refresh clicked');
  };

  return (
    <Container>
      <Row className="mt-5">
        <Col className="text-center">
          <h1 className="text-uppercase font-weight-bold">Laporan Harian Driver</h1>
          <p className="text-uppercase font-weight-bold">{date}</p>
          <div className="d-flex justify-content-center align-items-center mt-4 flex-column">
            <Form.Control
              type="date"
              value={date}
              onChange={handleDateChange}
              className="mb-3"
              style={{ width: '200px' }}
            />
            <Row className="justify-content-center">
              <Col xs="auto" className="mb-3">
                <Button variant="primary" onClick={handleFilter}>
                  Filter
                </Button>
              </Col>
              <Col xs="auto" className="mb-3">
                <Button variant="warning" onClick={handleRefresh}>
                  Refresh
                </Button>
              </Col>
            </Row>
          </div>
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
        `}
      </style>
          <Table className="table table-hover table-bordered">
            <thead>
              <tr>
                <th className="der text-center sticky-column" style={{ backgroundColor: "#009879", color: "white" }}>No</th>
                <th className="der text-center sticky-column" style={{ backgroundColor: "#009879", color: "white" }}>Nama Pt</th>
                <th className="der text-center sticky-column" style={{ backgroundColor: "#009879", color: "white" }}>Nama</th>
                <th className="der text-center sticky-column" style={{ backgroundColor: "#009879", color: "white" }}>Nama User</th>
                <th className="der text-center sticky-column" style={{ backgroundColor: "#009879", color: "white" }}>Nopol</th>
                <th className="der text-center sticky-column" style={{ backgroundColor: "#009879", color: "white" }}>Jam Masuk</th>
                <th className="der text-center sticky-column" style={{ backgroundColor: "#009879", color: "white" }}>Jam Keluar</th>
                <th className="der text-center sticky-column" style={{ backgroundColor: "#009879", color: "white" }}>Km In</th>
                <th className="der text-center sticky-column" style={{ backgroundColor: "#009879", color: "white" }}>Km Out</th>
                <th className="der text-center sticky-column" style={{ backgroundColor: "#009879", color: "white" }}>Lk Pp</th>
                <th className="der text-center sticky-column" style={{ backgroundColor: "#009879", color: "white" }}>Lk Inap</th>
                <th className="der text-center sticky-column" style={{ backgroundColor: "#009879", color: "white" }}>Images Km In</th>
                <th className="der text-center sticky-column" style={{ backgroundColor: "#009879", color: "white" }}>Images Km Out</th>
                <th className="der text-center sticky-column" style={{ backgroundColor: "#009879", color: "white" }}>Opsi</th>
              </tr>
            </thead>
            <tbody>
              {/* Render your table rows here */}
            </tbody>
          </Table>

          </div>
          <p className="mt-5">Silahkan tentukan tanggal terlebih dahulu</p>
        </Col>
      </Row>
    </Container>
  );
};

export default LaporanHarian;
