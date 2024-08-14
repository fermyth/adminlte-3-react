import React from 'react';
import { Table } from 'react-bootstrap';

const Vehicle = () => {
  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4 text-dark font-weight-bold">Vehicle</h1>

      <div className="table-responsive mb-5">
        <Table striped bordered hover responsive className="w-100 table-bordered">
          <thead>
            <tr>
              <th style={{ backgroundColor: "#009879", color: "white" }}>No</th>
              <th style={{ backgroundColor: "#009879", color: "white" }}>Police Number</th>
              <th style={{ backgroundColor: "#009879", color: "white" }}>Unit Type</th>
              <th style={{ backgroundColor: "#009879", color: "white" }}>Contract End</th>
              <th style={{ backgroundColor: "#009879", color: "white" }}>Rent Price</th>
              <th style={{ backgroundColor: "#009879", color: "white" }}>Total</th>
            </tr>
          </thead>
          <tbody>

          </tbody>
        </Table>
      </div>

      <style>
        {`
          .container {
            max-width: 1300px;
          }
          .table-bordered {
            border-radius: 15px 15px 0 0;
            border-top: 1px solid #009879;
            overflow: hidden;
            width: 100%;
          }
          .table {
            margin-bottom: 0; /* Remove bottom margin for better alignment */
          }
          .table tbody tr:last-of-type {
            border-bottom: 2px solid #009879;
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

export default Vehicle;
