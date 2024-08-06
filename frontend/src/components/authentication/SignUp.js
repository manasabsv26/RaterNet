import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from "@material-ui/core/IconButton";
import { useHistory } from "react-router";
import {Visibility, VisibilityOff} from "@material-ui/icons";
import { useSnackbar } from "notistack";
import {SignUpUser} from "../../redux/actions/auth"
import formValidation from '../utils/formValidation';

const initialValues = {
    asnNo : "",
    company_email : "",
    company_password : "",
    company_password_confirm : "",
    ISP_name : "",
    type_of_service : "",
    photoUrl : "",
    webUrl : ""
}

const fieldsValidation = {
    asnNo : {
        error: "",
        validate: "string",
        minLength : 7,
        maxLength : 10
    },
    company_email : {
        error: "",
        validate: "email"
    },
    company_password : {
        error: "",
        validate: "string",
        minLength : 6,
        maxLength : 10
    },
    company_password_confirm : {
        error: "",
        validate: "string",
        minLength : 6,
        maxLength : 10
    },
    ISP_name: {
        error: "",
        validate: "text",
        minLength: 2,
        maxLength: 20
    },
    type_of_service : {
        error: "",
        validate: "text"
    },
    photoUrl : {
        error: "",
        validate: "text"
    },
    webUrl : {
        error: "",
        validate: "text",
        minLength: 2,
        maxLength: 100
    }
}


const SignUp = ({ open, setOpen }) => {
    const [values, setValues] = useState(initialValues);
    const [stage, setStage] = useState(0);
    const [url,setUrl] = useState(null);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [errors, setErrors] = useState({})
    const [visible, setVisible] = useState(false);
    const dispatch = useDispatch();
    const history = useHistory();
    const handleClose = () => setOpen(false);
    

    const handleChange=(e)=>{
        const { name, value } = e.target
        // Set values
        setValues(prev => ({
          ...prev,
          [name]: value
        }))
    
        // set errors
        const error = formValidation(name, value, fieldsValidation) || ""
    
        setErrors(prev => ({
          ...prev,
          [name]: error
        }))
    }

    const handlefileUpload = (event)=>{
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);

        reader.onloadend = function () {
            setUrl([reader.result]);
        }.bind(this);
       
        setValues(prev => ({
          ...prev,
          image : event.target.files[0]
        }))
    }
    

    useEffect(() => {
        setStage(0);
    }, [open])


    const handleSubmit = async () => {
        try{
            enqueueSnackbar('Getting Network Info....', {variant: 'info', key: 'verifying'});
            const data = await fetch("https://cors-anywhere.herokuapp.com/http://api.ipify.org/?format=json");
            const ip = await data.json();
            fetch(`http://ip-api.com/json/${ip.ip}?fields=isp,org,as,mobile`)
            .then(data=>data.json())
            .then(isp=>{
                closeSnackbar('verifying');
                setValues({
                    ...values,
                    asnNo:isp.as.split(' ')[0],
                    ISP_name : isp.isp
                })
                signup();
            });  
        }catch(error){
            setTimeout(() => enqueueSnackbar(error.message,{
                variant: 'error',
                key: 'err_asn'
            }),
              3000);
            setTimeout(() => closeSnackbar('err_asn'), 6000);
        }          
    }

    const signup = async ()=>{
        try {
            enqueueSnackbar('Signing Up....', {variant: 'info', key: 'signup'});
            await dispatch(
                SignUpUser(
                    values.email,
                    values.password,
                    values.asnNo,
                    values.ISP_name,
                    values.photoUrl,
                    values.webUrl,
                    values.type_of_service
                )
            );
            setStage((stage+1)%2);
            closeSnackbar('signup');
            history.push('/login')
         } catch (error) {
             setTimeout(() => enqueueSnackbar("Sign Up failed:(",{
                 variant: 'error',
                 key: 'err_su'
             }),
               3000);
             setTimeout(() => closeSnackbar('err_su'), 6000);
         }
    }

   

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-login">
                <DialogTitle id="form-dialog-login">
                    {stage===0 ? 'Sign Up Details' : 'Company Details'}
                </DialogTitle>
                <DialogContent>
                    {stage===0?(
                        <React.Fragment>
                            <TextField
                                name="company_email"
                                variant="outlined"
                                label="Email Address"
                                type="email"
                                value={values.company_email}
                                margin="normal"
                                error={!!errors.company_email}
                                helperText={errors.company_email}
                                onChange={handleChange}
                                fullWidth
                                autoFocus
                                required
                            />
                            <TextField
                                name="company_password"
                                variant="outlined"
                                label="Password"
                                margin="normal"
                                value={values.company_password}
                                type={visible? "text":"password"}
                                error={!!errors.company_password}
                                helperText={errors.company_password}
                                onChange={handleChange}
                                InputProps={{
                                    endAdornment:
                                        <IconButton
                                            aria-label="Toggle visibility"
                                            onClick={() => setVisible(!visible)}
                                        >
                                            {visible? <Visibility /> : <VisibilityOff /> }
                                        </IconButton>
                                }}
                                fullWidth
                                autoFocus
                                required
                            />
                            <TextField
                                name="company_password_confirm"
                                variant="outlined"
                                label="Confirm Password"
                                margin="normal"
                                error={!!errors.company_password_confirm}
                                helperText={errors.company_password_confirm}
                                type={visible? "text":"password"}
                                value={values.company_password_confirm}
                                onChange={handleChange}
                                InputProps={{
                                    endAdornment:
                                        <IconButton
                                            aria-label="Toggle visibility"
                                            onClick={() => setVisible(!visible)}
                                        >
                                            {visible? <Visibility /> : <VisibilityOff /> }
                                        </IconButton>
                                }}
                                fullWidth
                                autoFocus
                                required
                            />
                        </React.Fragment>
                    ):(
                        <React.Fragment>
                            <TextField
                                name="asnNo"
                                variant="outlined"
                                label="Autonomous System Number"
                                type="text"
                                margin="normal"
                                value={values.asnNo}
                                onChange={handleChange}
                                error={!!errors.asnNo}
                                helperText={errors.asnNo}
                                fullWidth
                                autoFocus
                                required
                            />
                            <TextField
                                name="ISP_name"
                                variant="outlined"
                                value={values.ISP_name}
                                label="ISP Company Name"
                                type="text"
                                margin="normal"
                                error={!!errors.ISP_name}
                                helperText={errors.ISP_name}
                                onChange={handleChange}
                                autoFocus
                                fullWidth
                                required/>
                            <TextField
                                name="type_of_service"
                                variant="outlined"
                                label="Type of Service"
                                type="text"
                                value={values.type_of_service}
                                margin="normal"
                                error={!!errors.type_of_service}
                                helperText={errors.type_of_service}
                                onChange={handleChange}
                                autoFocus
                                fullWidth
                                required/>
                             <TextField
                                name="photoUrl"
                                variant="outlined"
                                label="Photo URL"
                                value={values.photoUrl}
                                type="text"
                                margin="normal"
                                onChange={handleChange}
                                autoFocus
                                fullWidth
                                required/>
                             <TextField
                                name="webUrl"
                                variant="outlined"
                                label="ISP Company Website URL"
                                type="text"
                                value={values.webUrl}
                                error={!!errors.webUrl}
                                helperText={errors.webUrl}
                                margin="normal"
                                onChange={handleChange}
                                autoFocus
                                fullWidth
                                required/>
                                <Button
                                    fullWidth={true}
                                    margin="normal"
                                    onClick={() => setStage(stage-1)}
                                    color='primary'
                                    variant='contained'
                                > Back</Button>
                        </React.Fragment>
                    )}
                </DialogContent>
                {stage===0?(
                    <DialogActions>
                        <Button onClick={handleClose} variant='contained' color="secondary">Cancel</Button>
                        <Button onClick={()=>setStage(stage=>(stage+1)%2)} variant='contained' color="primary">Next</Button>
                    </DialogActions>
                ):(
                    <DialogActions>
                        <Button onClick={handleClose} variant='contained' color="secondary">Cancel</Button>
                        <Button onClick={handleSubmit} variant='contained' color="primary">Sign Up</Button>
                    </DialogActions>
                )}
            </Dialog>
        </div>
    );
}

export default SignUp;