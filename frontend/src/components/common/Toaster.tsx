import React from "react";

import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";

import { useAppDispatch, useAppSelector } from "store/hooks";

import { closeToast, selectToastState } from "store/ui/slice";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

const Toaster = (): React.ReactElement => {
  const dispatch = useAppDispatch();
  const { open, message, severity } = useAppSelector(selectToastState);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(closeToast());
  };
  

  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toaster;