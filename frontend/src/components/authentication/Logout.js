import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useTheme from "@material-ui/core/styles/useTheme";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router";

const Logout = ({ open, setOpen, setLoggedIn,setDrawerOpen ,setTitle}) => {
    const theme = useTheme();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    let history = useHistory();

    const handleClose = () => setOpen(false);

    const handleSubmit = () => {
        enqueueSnackbar('Logging out....', {variant: 'info', key: 'logging_out'});
        localStorage.clear();
        //setTitle("RaterNet")
        setTimeout(() => closeSnackbar('logging_out'), 3000);
        setTimeout(() => enqueueSnackbar('Logged out Successfully!', {variant: 'success', key: 'logged_out'}), 3000);
        setTimeout(() => closeSnackbar('logged_out'), 6000);
        setTimeout(() => setLoggedIn(false), 3000);
        //setTimeout(() => history.push('/login'),3000);
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