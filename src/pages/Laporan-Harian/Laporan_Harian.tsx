import React, { useState } from 'react';
import { Button, Container, Row, Col, Form } from 'react-bootstrap';


const LaporanHarian = () => {
    const [date, setDate] = useState('06/05/20');

    const handleDateChange = (e : React.ChangeEvent<HTMLInputElement>) => {
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
       <>
       <Container>
      <Row className="mt-5">
        <Col className="text-center">
          <h1 className="text-center mb-1 font-weight-bold text-uppercase ">Laporan Harian Driver</h1>
          <p className="text-center font-weight-bold text-uppercase ">2024-06-05</p>
          <div className="d-flex justify-content-center align-items-center mt-4"> 
          <Form.Control
            type="date"
            value={date}
            onChange={handleDateChange}
            className="mb-3"
            placeholder="06/05/20"
            style={{ width: '200px' }}
          />
          <Row className="justify-content-center">
            <Col md={3} className="mb-3 mr-4">
              <Button variant="primary" onClick={handleFilter}>
                Filter
              </Button>
            </Col>
            <Col md={3} className="mb-3">
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
       </>
    );
};
export default LaporanHarian