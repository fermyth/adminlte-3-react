import React, { useState } from 'react';
import { Button, Container, Row, Col, Form } from 'react-bootstrap';

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
          <p className="text-uppercase font-weight-bold">2024-06-05</p>
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
          <p className="mt-5">Silahkan tentukan tanggal terlebih dahulu</p>
        </Col>
      </Row>
    </Container>
  );
};

export default LaporanHarian;
