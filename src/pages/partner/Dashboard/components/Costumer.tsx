import "bootstrap/dist/css/bootstrap.min.css";
import ChartComponent from "./Cart";
import { Link } from "react-router-dom";

const customers = [
  { name: "PT. EPPSJ", vehicles: 30 },
  { name: "PT. ABCDS", vehicles: 10 },
  { name: "PT. CDEFG", vehicles: 3 },
  { name: "PT. GGHSG", vehicles: 2 },
  { name: "PT. JJSHHD", vehicles: 2 },
];

const CustomerList = () => {
  const totalVehicles = customers.reduce(
    (total, customer) => total + customer.vehicles,
    0
  );

  return (
    <div className="container  d-flex justify-content-center  align-items-center">
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
      <div className="row " style={{ width: "100%" }}>
        <div className="col">
          <div className="card-header text-dark">Costumer</div>
          <table className="table table-striped table-bordered">
            <thead className="">
              <tr>
                <th
                  scope="col"
                  style={{ backgroundColor: "#009879", color: "white" }}
                >
                  Nama Pelanggan
                </th>
                <th
                  scope="col"
                  style={{ backgroundColor: "#009879", color: "white" }}
                >
                  Jumlah Kendaraan
                </th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.name}>
                  <td>{customer.name}</td>
                  <td>
                    <Link
                      to="/partner-dashboard/customer"
                      className="text-dark hover font-weight-bold"
                    >
                      {customer.vehicles} {""}Vehicle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="col">
        <ChartComponent />
      </div>
    </div>
  );
};

export default CustomerList;
