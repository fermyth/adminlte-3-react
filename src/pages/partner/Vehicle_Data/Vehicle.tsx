import React, { useState } from "react";
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
import { AnyNaptrRecord } from "dns";

function VehicleData() {
  const [customers, setCustomers] = useState([
    {
      id: "JJSHHD",
      namaCustomer: "PT. JJSHHD",
      jumlahKendaraan: 2,
      status: "Aktif",
    },
    {
      id: "GGHSG",
      namaCustomer: "PT. GGHSG",
      jumlahKendaraan: 2,
      status: "Aktif",
    },
    {
      id: "CDEFG",
      namaCustomer: "PT. CDEFG",
      jumlahKendaraan: 3,
      status: "Aktif",
    },
    {
      id: "ABCDS",
      namaCustomer: "PT. ABCDS",
      jumlahKendaraan: 10,
      status: "Aktif",
    },
    {
      id: "EPPSJ",
      namaCustomer: "PT. EPPSJ",
      jumlahKendaraan: 30,
      status: "Aktif",
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [dropdownValue1, setDropdownValue1] = useState("Nama Customers");
  const [dropdownValue2, setDropdownValue2] = useState("Contains");

  const handleSearch = (event: any) => {
    setSearchTerm(event.target.value);
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.namaCustomer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddModalShow = () => setShowAddModal(true);
  const handleAddModalClose = () => setShowAddModal(false);

  const handleEditModalShow = (customer: any) => {
    setSelectedCustomer(customer);
    setShowEditModal(true);
  };
  const handleEditModalClose = () => setShowEditModal(false);

  const handleAddCustomer = (newCustomer: any) => {
    setCustomers([...customers, newCustomer]);
    handleAddModalClose();
  };

  const handleEditCustomer = (updatedCustomer: any) => {
    const updatedCustomers = customers.map((customer) =>
      customer.id === updatedCustomer.id ? updatedCustomer : customer
    );
    setCustomers(updatedCustomers);
    handleEditModalClose();
  };

  const handleDeleteCustomer = (id: any) => {
    const updatedCustomers = customers.filter((customer) => customer.id !== id);
    setCustomers(updatedCustomers);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4 text-dark font-weight-bold">
        Vehicle Leasing
      </h1>
      <Row className="mb-3 justify-content-between">
        <Col md="4">
          <Button variant="success" onClick={handleAddModalShow}>
            <i className="fas fa-plus"></i> Add New
          </Button>
        </Col>
        <Col md="4" className="text-right">
          <Button variant="danger" className="mr-2">
            <i className="fas fa-trash"></i> Bulk Delete
          </Button>
          <Button variant="info">
            <i className="fas fa-sort"></i> Order
          </Button>
        </Col>
      </Row>
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Search"
          aria-label="Search"
          aria-describedby="basic-addon2"
          value={searchTerm}
          onChange={handleSearch}
        />
        <DropdownButton
          as={InputGroup.Append}
          variant="outline-secondary"
          title={dropdownValue1}
          id="input-group-dropdown-1"
          onSelect={(eventKey: any) => setDropdownValue1(eventKey)}
        >
          <Dropdown.Item eventKey="Option 1">Option 1</Dropdown.Item>
          <Dropdown.Item eventKey="Option 2">Option 2</Dropdown.Item>
          <Dropdown.Item eventKey="Option 3">Option 3</Dropdown.Item>
        </DropdownButton>
        <DropdownButton
          as={InputGroup.Append}
          variant="outline-secondary"
          title={dropdownValue2}
          id="input-group-dropdown-2"
          onSelect={(eventKey: any) => setDropdownValue2(eventKey)}
        >
          <Dropdown.Item eventKey="Option A">Option A</Dropdown.Item>
          <Dropdown.Item eventKey="Option B">Option B</Dropdown.Item>
          <Dropdown.Item eventKey="Option C">Option C</Dropdown.Item>
        </DropdownButton>
        <InputGroup.Append>
          <Button variant="outline-secondary">
            <i className="fas fa-search"></i>
          </Button>
        </InputGroup.Append>
      </InputGroup>
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
      <Table striped bordered hover className="text-center table-bordered">
        <thead className="">
          <tr>
            <th style={{ backgroundColor: "#009879", color: "white" }}></th>
            <th style={{ backgroundColor: "#009879", color: "white" }}>
              Nama Customer
            </th>
            <th style={{ backgroundColor: "#009879", color: "white" }}>
              Customer Id
            </th>
            <th style={{ backgroundColor: "#009879", color: "white" }}>
              Jumlah Kendaraan
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
          {filteredCustomers.map((customer) => (
            <tr key={customer.id}>
              <td>
                <Form.Check type="checkbox" />
              </td>
              <td>{customer.namaCustomer}</td>
              <td>{customer.id}</td>
              <td>{customer.jumlahKendaraan}</td>
              <td>{customer.status}</td>
              <td>
                <Button
                  variant="warning"
                  className="mr-2"
                  onClick={() => handleEditModalShow(customer)}
                >
                  <i className="fa-regular fa-eye"></i>View
                </Button>
                <Button
                  variant="primary"
                  className="mr-2"
                  onClick={() => handleEditModalShow(customer)}
                >
                  <i className="fas fa-edit"></i> Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteCustomer(customer.id)}
                >
                  <i className="fas fa-trash-alt"></i> Delete
                </Button>
              </td>
            </tr>
          ))}
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
          <Button variant="success" onClick={() => handleAddCustomer()}>
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
            onClick={() => handleEditCustomer(selectedCustomer)}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default VehicleData;
