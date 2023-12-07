import * as React from 'react';
import { useDispatch } from 'react-redux';
import { underControl } from '../state-management/userState/userSlice';
import MuiAlert from '@mui/material/Alert';
import { Snackbar } from '@mui/material';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Popup = ({ message, setShowPopup, showPopup}) => {
  const dispatch = useDispatch();

  const vertical = 'top';
  const horizontal = 'center';

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowPopup(false);
    dispatch(underControl());
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={showPopup}
        autoHideDuration={6000}
        onClose={handleClose}
        message={message}
        key={vertical + horizontal}
      >
        {
          (message == 'Successful' ?
            <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
              {typeof message == 'string' ? message : message && message.map((item, index) => <li key={index}>{item}</li>) }
            </Alert>
            :
            <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
              {typeof message == 'string' ? message : message && message.map((item, index) => <li key={index}>{item}</li>) }
            </Alert>
          )
        }
      </Snackbar>
    </div>
  )
}

export default Popup;