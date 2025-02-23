import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useTheme from "@mui/styles/useTheme";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

const Logout = ({ open, setOpen, setLoggedIn,setDrawerOpen ,setTitle}) => {
    const theme = useTheme();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const navigate = useNavigate();

    const handleClose = () => setOpen(false);

    const handleSubmit = () => {
        enqueueSnackbar('Logging out....', {variant: 'info', key: 'logging_out'});
        localStorage.clear();
        //setTitle("RaterNet")
        setTimeout(() => closeSnackbar('logging_out'), 3000);
        setTimeout(() => enqueueSnackbar('Logged out Successfully!', {variant: 'success', key: 'logged_out'}), 3000);
        setTimeout(() => closeSnackbar('logged_out'), 6000);
        setTimeout(() => setLoggedIn(false), 3000);
        //setTimeout(() => navigate('/login'),3000);
        setDrawerOpen(false);
        setOpen(false);
    }

    return (
        <div>
             <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-logout">
                <DialogTitle id="form-dialog-logout">Logout</DialogTitle>
                <DialogContent>
                    <DialogContentText style={{ color: theme.palette.text.primary }}>
                        Are you sure you want to logout?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant="outlined" color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} variant="outlined" color="primary">
                        Logout
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Logout;