import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Form,
  InputGroup,
  FormControl,
  Row,
  Col,
  Modal,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

interface Customer {
  id: string;
  namaCustomer: string;
  jumlahKendaraan: number;
  status: string;
}

const Jadwal: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [dropdownValue1, setDropdownValue1] = useState("Nama Customers");
  const [dropdownValue2, setDropdownValue2] = useState("Contains");

  useEffect(() => {
    axios
      .get(
        "https://script.googleusercontent.com/macros/echo?user_content_key=7l50tKxm7LttPBwsKp-MF4f83WxvCkEoOIzH3o8yxBjwlJzi1DP9CRx5CAa02BlZiBC0MyRv7-up4QSk0FSvqfsGZfbnUEhpm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnA6TbSQwDFUfgFv57b0G3tPh6pgILo1YeQNwRYadkWyi-zrouKT9cz6WJ4u5GLwbVmmq5NABqKJxetNufYzzpgifdKykPxaUEQ&lib=MfofOVY_nfGl5ZIOpjnzaaifRHul_JHjD"
      )
      .then((response) => {
        const fetchedCustomers = response.data.map((customer: any) => ({
          id: customer.customer_id,
          namaCustomer: customer.nama_customer,
          jumlahKendaraan: parseInt(customer.jumlah_kendaraan, 10) || 0,
          status: customer.status,
        }));
        setCustomers(fetchedCustomers);
      })
      .catch((error) => {
        console.error("Error fetching data from API", error);
      });
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.namaCustomer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddModalShow = () => setShowAddModal(true);
  const handleAddModalClose = () => setShowAddModal(false);

  const handleEditModalShow = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowEditModal(true);
  };
  const handleEditModalClose = () => setShowEditModal(false);

  const handleViewModalShow = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowViewModal(true);
  };
  const handleViewModalClose = () => setShowViewModal(false);

  const handleAddCustomer = (newCustomer: Customer) => {
    setCustomers([...customers, newCustomer]);
    handleAddModalClose();
  };

  const handleEditCustomer = (updatedCustomer: Customer) => {
    const updatedCustomers = customers.map((customer) =>
      customer.id === updatedCustomer.id ? updatedCustomer : customer
    );
    setCustomers(updatedCustomers);
    handleEditModalClose();
  };

  const kirim = () => {
   alert('Pesan Berhasil Terkirim ke Driver')
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4 text-dark font-weight-bold">
        Jadwal
      </h1>
      
      
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
        `}
      </style>
      <Table striped bordered hover className="text-center table-bordered">
        <thead className="">
          <tr>
          <th style={{ backgroundColor: "#009879", color: "white" }}>
              Tanggal
            </th>
            <th style={{ backgroundColor: "#009879", color: "white" }}>
              Nopol Customer
            </th>
            <th style={{ backgroundColor: "#009879", color: "white" }}>
              Lokasi Service
            </th>
            <th style={{ backgroundColor: "#009879", color: "white" }}>
              Status
            </th>
            <th style={{ backgroundColor: "#009879", color: "white" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
            <tr> 
                <td>
                    16 Februari 2024
                </td> 
              <td>
                <p>
                <Link to="/partner-dashboard/customer/costumer-detail/detail-mobil">
                B 12345 AC
                </Link>
                </p>
                <h5>
                <Link to="/partner-dashboard/customer/costumer-detail"
                className="text-dark hover font-weight-bold">
                    PT Keyence Indonesia
                </Link>
                </h5>
                
                </td>
              <td style={{textAlign:'left'}}>
                <p><b>Service Rutin</b></p>
                <hr style={{marginTop: -10}}></hr>
                <p style={{marginTop: -10,color:'blue'}}><b>Lokasi : Jakarta</b></p>
                <p style={{fontSize:13}}>Lorem Ipsum is simply dummy text </p>
                
                </td>
                <td><span className="alert-primary">Sudah dilakuan</span></td>
              <td>
              <Button
                  variant="primary"
                  className="mr-2"
                  onClick={() => kirim()}
                >
                  <i className="fas fa-paper-plane"></i> Kirim ke Driver
                </Button>
              </td>
            </tr>
            <tr>  
            <td>
                    20 Maret 2024
                </td> 
                <td>
                <p>
                <Link to="/partner-dashboard/customer/costumer-detail/detail-mobil">
                B 894754 DD
                </Link>
                </p>
                <h5>
                <Link to="/partner-dashboard/customer/costumer-detail"
                className="text-dark hover font-weight-bold">
                    PT Keyence Indonesia
                </Link>
                </h5>
                
                </td>
              <td style={{textAlign:'left'}}>
                <p><b>Service Kecelakaan</b></p>
                <hr style={{marginTop: -10}}></hr>
                <p style={{marginTop: -10,color:'blue'}}><b>Lokasi : Tanggerang</b></p>
                <p style={{fontSize:13}}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
                     </p>
                
                </td>
              <td><span className="alert-warning">Belum dilakukan</span></td>
              <td>
              <Button
                  variant="primary"
                  className="mr-2"
                  onClick={() => kirim()}
                >
                  <i className="fas fa-paper-plane"></i> Kirim ke Driver
                </Button>
              </td>
            </tr>
            <tr>  
            <td>
                    12 Juni 2024
                </td> 
                <td>
                <p>
                <Link to="/partner-dashboard/customer/costumer-detail/detail-mobil">
                F 894778 ZX
                </Link>
                </p>
                <h5>
                <Link to="/partner-dashboard/customer/costumer-detail"
                className="text-dark hover font-weight-bold">
                    PT Keyence Indonesia
                </Link>
                </h5>
                
                </td>
              <td style={{textAlign:'left'}}>
                <p><b>Uji Emisi</b></p>
                <hr style={{marginTop: -10}}></hr>
                <p style={{marginTop: -10, color:'blue'}}><b>Lokasi : Bengkel Toyota</b></p>
                <p style={{fontSize:13}}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
                     the industry's </p>
                
                </td>
                <td><span className="alert-success">Sedang diproses</span></td>
              <td>
              <Button
                  variant="primary"
                  className="mr-2"
                  onClick={() => kirim()}
                >
                  <i className="fas fa-paper-plane"></i> Kirim ke Driver
                </Button>
              </td>
            </tr>
        </tbody>
      </Table>
      <p className="text-center mt-2">
        Showing 1 to {customers.length} of {customers.length} entries
      </p>

      {/* Add Modal */}
      <Modal show={showAddModal} onHide={handleAddModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNamaCustomer">
              <Form.Label>Nama Customer</Form.Label>
              <Form.Control type="text" placeholder="Enter Nama Customer" />
            </Form.Group>
            <Form.Group controlId="formCustomerId">
              <Form.Label>Customer Id</Form.Label>
              <Form.Control type="text" placeholder="Enter Customer Id" />
            </Form.Group>
            <Form.Group controlId="formJumlahKendaraan">
              <Form.Label>Jumlah Kendaraan</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Jumlah Kendaraan"
              />
            </Form.Group>
            <Form.Group controlId="formStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control as="select">
                <option value="Aktif">Aktif</option>
                <option value="Tidak Aktif">Tidak Aktif</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleAddModalClose}>
            Close
          </Button>
          <Button
            variant="success"
            onClick={() =>
              handleAddCustomer({
                id: "newId",
                namaCustomer: "newCustomer",
                jumlahKendaraan: 0,
                status: "Aktif",
              })
            }
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={handleEditModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCustomer && (
            <Form>
              <Form.Group controlId="formNamaCustomer">
                <Form.Label>Nama Customer</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Nama Customer"
                  defaultValue={selectedCustomer.namaCustomer}
                />
              </Form.Group>
              <Form.Group controlId="formCustomerId">
                <Form.Label>Customer Id</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Customer Id"
                  defaultValue={selectedCustomer.id}
                  readOnly
                />
              </Form.Group>
              <Form.Group controlId="formJumlahKendaraan">
                <Form.Label>Jumlah Kendaraan</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Jumlah Kendaraan"
                  defaultValue={selectedCustomer.jumlahKendaraan}
                />
              </Form.Group>
              <Form.Group controlId="formStatus">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  as="select"
                  defaultValue={selectedCustomer.status}
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Tidak Aktif">Tidak Aktif</option>
                </Form.Control>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEditModalClose}>
            Close
          </Button>
          <Button
            variant="success"
            onClick={() => handleEditCustomer(selectedCustomer!)}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* View Modal */}
      <Modal show={showViewModal} onHide={handleViewModalClose} centered>
        <Modal.Header
          closeButton
          className=" text-white"
          style={{ backgroundColor: "#009879" }}
        >
          <Modal.Title>Customer Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {selectedCustomer && (
            <div className="customer-details">
              <div className="detail-row">
                <span className="detail-label">Nama Customer:</span>
                <span className="detail-value">
                  {selectedCustomer.namaCustomer}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Customer Id:</span>
                <span className="detail-value">{selectedCustomer.id}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Jumlah Kendaraan:</span>
                <span className="detail-value">
                  {selectedCustomer.jumlahKendaraan}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span className="detail-value">{selectedCustomer.status}</span>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleViewModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <style>
        {`
    .customer-details {
      background-color: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .customer-details .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #e9ecef;
    }
    .customer-details .detail-row:last-child {
      border-bottom: none;
    }
    .customer-details .detail-label {
      font-weight: bold;
      color: #495057;
    }
    .customer-details .detail-value {
      color: #212529;
    }
    .modal-header.bg-primary {
      background-color: #007bff;
    }
    .modal-header.bg-primary .modal-title {
      color: white;
    }
  `}
      </style>
    </div>
  );
};

export default Jadwal;
