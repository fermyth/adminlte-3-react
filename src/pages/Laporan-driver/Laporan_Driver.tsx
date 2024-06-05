import React, { useState } from 'react';
import DriverReportTable from './components/Driver_Report_Table';

function LaporanDriver() {
  const [type, setType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleTypeChange = (event : React.ChangeEvent<HTMLSelectElement>) => {
    setType(event.target.value);
  };

  const handleStartDateChange = (event : React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event :React.ChangeEvent<HTMLInputElement> ) => {
    setEndDate(event.target.value);
  };

  const handleSubmit = (event : React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission here
    console.log('Type:', type);
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);
  };

  return (
    <>
   
    <div className="container">
      <h1 className="text-center mb-4 font-weight-bold text-uppercase mb-3 mt-5">LAPORAN DRIVER</h1>
      <form onSubmit={handleSubmit} className='d-flex justify-content-center align-items-center'>
        <div className="row mb-3">
          <div className="col-md-4">
            <label htmlFor="type" className="form-label">Type</label>
            <select className="form-select" id="type" value={type} style={{ width: '200px' }} onChange={handleTypeChange} >
              <option value="">Pilih</option>
              <option value="daily">Harian</option>
              <option value="weekly">Mingguan</option>
              <option value="monthly">Bulanan</option>
            </select>
          </div>
          <div className="col-md-4">
            <label htmlFor="startDate" className="form-label">Dari Tanggal</label>
            <div className="input-group">
              <input
                type="date"
                className="form-control"
                id="startDate"
                style={{ width: '200px' }}
                value={startDate}
                onChange={handleStartDateChange}
              />
             
            </div>
          </div>
          <div className="col-md-4">
            <label htmlFor="endDate" className="form-label">Sampai Tanggal</label>
            <div className="input-group">
              <input
                type="date"
                className="form-control"
                id="endDate"
                style={{ width: '200px' }}
                value={endDate}
                onChange={handleEndDateChange}
              />
             
            </div>
          </div>
        </div>
        <div className="d-grid gap-2 d-md-flex justify-content-md-end ml-3 mt-3">
          <button type="submit" className="btn btn-primary me-md-2">Filter</button>
          <button type="button" className="btn btn-success">Download Excel</button>
        </div>
      </form>
    </div>
    <div className="info-box">
      <DriverReportTable />
    </div>
    </>
  );
}

export default LaporanDriver;