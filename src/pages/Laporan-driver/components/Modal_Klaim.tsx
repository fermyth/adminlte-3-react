import * as React from 'react';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface Film {
  title: string;
  year: number;
}

function sleep(duration: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  backgroundColor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  p: 4,
};

export default function ModalKlaim() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);
  const [autoCompleteOpen, setAutoCompleteOpen] = React.useState(false);
  const [options, setOptions] = React.useState<readonly Film[]>([]);
  const loading = autoCompleteOpen && options.length === 0;

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      await sleep(1000); 

      if (active) {
        setOptions([...topFilms]);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!autoCompleteOpen) {
      setOptions([]);
    }
  }, [autoCompleteOpen]);

  return (
    <div>
      <button onClick={handleOpen} className="btn btn-custom btn-sm">Klaim</button>
      <Modal
        open={modalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Autocomplete
            id="asynchronous-demo"
            sx={{ width: 300 }}
            open={autoCompleteOpen}
            onOpen={() => {
              setAutoCompleteOpen(true);
            }}
            onClose={() => {
              setAutoCompleteOpen(false);
            }}
            isOptionEqualToValue={(option, value) => option.title === value.title}
            getOptionLabel={(option) => option.title}
            options={options}
            loading={loading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Pilih"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
          />
          <Box mt={2} >
       <TextField
          id="outlined-multiline-flexible"
          label="Nominal"
          multiline
          maxRows={4}
          sx={{ width: 300 }}
          />
          </Box>
          <Box mt={2} >
        <TextField
            id="outlined-multiline-flexible"
            label="Deskripsi"
            multiline
            maxRows={4}
            sx={{ width: 300 }}
            />
          </Box>
          <Button variant="contained" sx={{ mt: 2 , width: 300 }}  endIcon={<SendIcon />}>
        Send
      </Button>
        </Box>
      </Modal>
    </div>
  );
}

const topFilms: readonly Film[] = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
];
