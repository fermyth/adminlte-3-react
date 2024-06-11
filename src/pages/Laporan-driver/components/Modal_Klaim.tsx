import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import axios from 'axios'; // Import axios for making HTTP requests

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function ModalKlaim() {
  const [open, setOpen] = React.useState(false);
  const [claimsData, setClaimsData] = React.useState([]); // State to store claims data

  const fetchClaimsData = async () => {
    try {
      const response = await axios.get('https://backend.sigapdriver.com/api/pengeluaran/294/2024-06-05');
      setClaimsData(response.data.data);
    } catch (error) {
      console.error('Error fetching claims data:', error);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    fetchClaimsData(); 
  };

  const handleClose = () => setOpen(false);

  const modalContent = (
    <Box sx={style}>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        <Box>
          Nama :
        </Box>
        <Box>
          Total :
        </Box>
      </Typography>
      <div className="table-responsive">
        <style>
          {`
            .table {
              width: 100%;
              background-color: #f8f9fa;
              border-collapse: collapse;
              border-radius: 0.25em;
              overflow: hidden;
              box-shadow: 0 0 0 1px #e0e0e0 inset;
              border-radius: 0.5em;
            }
            .table th,
            .table td {
              padding: 0.5em 1em;
              border-bottom: 1px solid #e0e0e0;
              border-right: 1px solid #e0e0e0;
              text-align: left;
              vertical-align: middle;
            }
            .table th {
              background-color: #009879;
              color: white;
              font-weight: bold;
            }
            .table td {
              background-color: #ffffff;
            }
          `}
        </style>
        <table className="table">
          <thead>
            <tr>
              <th>Nominal</th>
              <th>Foto</th>
              <th>Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {/* Render claims data here */}
            {claimsData.map((claim, index) => (
              <tr key={index}>
                <td>{claim.nominal}</td>
                <td><img src={claim.foto} alt="Claim" style={{ width: '50px', height: '50px' }} /></td>
                <td>{claim.keterangan}</td>
              </tr>
            ))}
            <tr>
              <td>Rp 10.000.000</td>
              <td><img src="link_gambar_modal_1.jpg" alt="Modal 1" style={{ width: '50px', height: '50px' }} /></td>
              <td>Modal awal yang disiapkan untuk memulai usaha.</td>
            </tr>
            <tr>
              <td>Rp 20.000.000</td>
              <td><img src="link_gambar_modal_2.jpg" alt="Modal 2" style={{ width: '50px', height: '50px' }} /></td>
              <td>Penambahan modal untuk ekspansi dan pengembangan usaha.</td>
            </tr>
            <tr>
              <td>Rp 15.000.000</td>
              <td><img src="link_gambar_modal_3.jpg" alt="Modal 3" style={{ width: '50px', height: '50px' }} /></td>
              <td>Investasi untuk pembelian peralatan dan perlengkapan usaha.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Box>
  );

  return (
    <div>
      <Button onClick={handleOpen}>Klaim</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {modalContent}
      </Modal>
    </div>
  );
}
