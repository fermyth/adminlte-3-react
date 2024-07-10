import React from "react";
import { Link } from "react-router-dom";

function CustomerDetail() {
  const vehicles = [
    {
      no: 1,
      policeNumber: "B1233KD",
      unitType: "Toyota Avanza 2018",
      contractEnd: "20 June 2025",
      rentPrice: "8,400,000",
      km: "2,300",
      ujiEmisi: "11 Nov 2023",
      notes: "",
    },
    {
      no: 2,
      policeNumber: "B1263KD",
      unitType: "Toyota Avanza Veloz 2018",
      contractEnd: "20 February 2025",
      rentPrice: "6,400,000",
      km: "1,300",
      ujiEmisi: "10 Nov 2023",
      notes: "",
    },
    {
      no: 3,
      policeNumber: "B1203KD",
      unitType: "Toyota Innova 2020",
      contractEnd: "20 February 2028",
      rentPrice: "9,400,000",
      km: "1,070",
      ujiEmisi: "10 Nov 2023",
      notes: "",
    },
  ];

  return (
    <>
      <div className="container  mt-3 mb-2 ">
        <Link to="/partner-dashboard">Back To Dashboard</Link>
      </div>
      <div className="container ">
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm bg-light">
              <div className="card-body text-center">
                <svg width="100" height="100">
                  <circle cx="50" cy="50" r="40" fill="#673AB7" />
                  <circle cx="50" cy="50" r="30" fill="#FFC107" />
                  <circle cx="50" cy="50" r="20" fill="#2196F3" />
                  <circle cx="50" cy="50" r="10" fill="#F44336" />
                </svg>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm bg-light">
              <div className="card-body">
                <h5 className="card-title text-primary">
                  Company Name: PT. CDEFG
                </h5>
                <p className="card-text mb-1">Phone: 62-77266386</p>
                <p className="card-text mb-1">
                  Address: Jalan Slipi Raya no. 3 Jakarta Barat
                </p>
                <p className="card-text mb-0">DKI Jakarta</p>
              </div>
            </div>
          </div>

          <div className="col-md-4"></div>
        </div>
        <h2 className="mt-5 text-dark font-weight-bold ">List Kendaraan</h2>
        <div className="table-responsive">
          <style>
            {`
            .table-bordered{
            border-radius: 15px 15px 0 0;
            border-top: 1px solid #009879;
            overflow: hidden;
          }
             .table tbody tr:last-of-type {
            border-bottom: 2px solid #009879;
          }
        `}
          </style>
          <table className="table table-bordered mt-3">
            <thead className="">
              <tr>
                <th
                  scope="col"
                  style={{ backgroundColor: "#009879", color: "white" }}
                >
                  No
                </th>
                <th
                  scope="col"
                  style={{ backgroundColor: "#009879", color: "white" }}
                >
                  Police Number
                </th>
                <th
                  scope="col"
                  style={{ backgroundColor: "#009879", color: "white" }}
                >
                  Unit Type
                </th>
                <th
                  scope="col"
                  style={{ backgroundColor: "#009879", color: "white" }}
                >
                  Contract Start
                </th>
                <th
                  scope="col"
                  style={{ backgroundColor: "#009879", color: "white" }}
                >
                  Contract End
                </th>
                <th
                  scope="col"
                  style={{ backgroundColor: "#009879", color: "white" }}
                >
                  Rent Price
                </th>
                <th
                  scope="col"
                  style={{ backgroundColor: "#009879", color: "white" }}
                >
                  KM
                </th>
                <th
                  scope="col"
                  style={{ backgroundColor: "#009879", color: "white" }}
                >
                  Uji Emisi
                </th>
                <th
                  scope="col"
                  style={{ backgroundColor: "#009879", color: "white" }}
                >
                  Nama Driver
                </th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle, index) => (
                <tr key={index}>
                  <td>{vehicle.no}</td>
                  <td>
                    <Link to="/partner-dashboard/customer/costumer-detail/detail-mobil">
                    {vehicle.policeNumber}
                    </Link>
                    </td>
                  <td>{vehicle.unitType}</td>
                  <td>{vehicle.contractEnd}</td>
                  <td>{vehicle.contractEnd}</td>
                  <td>{vehicle.rentPrice}</td>
                  <td>{vehicle.km}</td>
                  <td>{vehicle.ujiEmisi}</td>
                  <td>
                  <Link to="/partner-dashboard/profil_driver">
                  Agus</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default CustomerDetail;
