import { Container, Row, Col } from "react-bootstrap";
import CustomerList from "./components/Costumer";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocation } from "react-router-dom";

const DashboardPartner = () => {
  const [companies , setCompanies] = useState([]);
  const [mobilContarct , setmobilContarct] = useState([]);
  const [mobilContarct2 , setmobilContarct2] = useState([]);
  const [idCompany, setIdCompany] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

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
    if(idCompany){
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5182/api/v1/perusahaan/${idCompany}`);
        const data = await response.json();
        console.log("asasas", data);
        
        setCompanies(data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }
  }, [idCompany, location.key]);
  useEffect(() => {
    if(idCompany){
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5182/api/v1/mobil-ending-soon/${idCompany}`);
        const data = await response.json();
        console.log("asasas", data);
        
        setmobilContarct(data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }
  }, [idCompany, location.key]);
  useEffect(() => {
    if(idCompany){
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5182/api/v1/mobil-ending-soon2/${idCompany}`);
        const data = await response.json();
        console.log("asasas", data);
        
        setmobilContarct2(data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }
  }, [idCompany, location.key]);

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
              <h1 className="card-text text-center font-weight-bold">{companies ? companies.totalPerusahaan : "-" }</h1>
            </div>
          </Col>
          <Col>
            <div className="card hover p-5 rounded shadow-sm bg-danger text-white">
              <h5 className="card-title text-center font-weight-bold">
                No. Of Vehicle
              </h5>
              <h1 className="card-text text-center font-weight-bold">{companies ? companies.totalMobil : "-" }</h1>
            </div>
          </Col>
          <Col>
            <div className="card hover p-5 rounded shadow-sm bg-primary text-white">
              <h5 className="card-title text-center font-weight-bold">
              expiring Contract
              </h5>
              <h1 className="card-text text-center font-weight-bold">{mobilContarct ? mobilContarct.totalMobilEndingSoon : "-"}</h1>
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
                  <i className="fa fa-life-ring" aria-hidden="true"></i> {mobilContarct2 ? mobilContarct2.totalMobilEndingSoon : "-"}
                 {" "} vehicle's contracts are due in 60 Days{" "}
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
