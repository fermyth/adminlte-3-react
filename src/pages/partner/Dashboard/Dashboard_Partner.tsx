import { Container, Row, Col } from "react-bootstrap";
import CustomerList from "./components/Costumer";

const DashboardPartner = () => {
  return (
    <>
      <style>
        {`
          .hover {
            transition: transform 0.3s;
          }

          .hover:hover {
            transform: scale(1.1);
          }
        `}
      </style>

      <Container>
        <Row className="mt-5">
          <Col>
            <div
              className="card hover p-5 rounded shadow-sm text-white"
              style={{ backgroundColor: "#009879" }}
            >
              <h5 className="card-title text-center font-weight-bold">
                No. Of Customer
              </h5>
              <h1 className="card-text text-center font-weight-bold">5</h1>
            </div>
          </Col>
          <Col>
            <div className="card hover p-5 rounded shadow-sm bg-danger text-white">
              <h5 className="card-title text-center font-weight-bold">
                No. Of Vehicle
              </h5>
              <h1 className="card-text text-center font-weight-bold">47</h1>
            </div>
          </Col>
          <Col>
            <div className="card hover p-5 rounded shadow-sm bg-primary text-white">
              <h5 className="card-title text-center font-weight-bold">
                New Contract This Month
              </h5>
              <h1 className="card-text text-center font-weight-bold">2</h1>
            </div>
          </Col>
        </Row>
      </Container>
      <div className="container mt-5">
        <div className="card">
          <div className="card-header text-dark">Updates</div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-12">
                <div
                  className=""
                  style={{
                    backgroundColor: "#009879",
                    color: "white",
                    padding: "10px",
                    width: "100%",
                    margin: "10px",
                    transition: "transform 0.3s ease-in-out",
                  }}
                >
                  <i className="fa fa-life-ring" aria-hidden="true"></i> 2
                  vehicle's contracts are due in 60 Days{" "}
                  <a href="#" className="alert-link">
                    details
                  </a>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div
                  className=""
                  style={{
                    backgroundColor: "#009879",
                    color: "white",
                    padding: "10px",
                    width: "100%",
                    margin: "10px",
                    transition: "transform 0.3s ease-in-out",
                  }}
                >
                  <i className="fa fa-life-ring" aria-hidden="true"></i> 5
                  vehicles are scheduled in maintenance in 20 days{" "}
                  <a href="#" className="alert-link">
                    details
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <CustomerList />
      </div>
    </>
  );
};

export default DashboardPartner;
