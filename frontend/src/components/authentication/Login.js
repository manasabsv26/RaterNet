import React,{useState} from 'react';
import {useDispatch} from 'react-redux'
import Button from '@mui/material/Button';
import {Grid,Paper,Typography} from '@mui/material'
import { useSnackbar } from "notistack";
import TextField from '@mui/material/TextField';
import IconButton from "@mui/material/IconButton";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {ThemeContext} from "../../context/ThemeContext";
import { makeStyles } from '@mui/styles';
import {loginUser} from '../../redux/actions/auth';
import formValidation from '../utils/formValidation';
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";


const useStyles = makeStyles(theme=>({
    logo : {
        [theme.breakpoints.down('md')] : {
            display : 'none'
        }
    },
    paper :{
        padding : 30,
        [theme.breakpoints.up('md')] : {
            marginLeft:30,
            marginRight:30
        }
    }
}))

const fieldsValidation = {
    email : {
        error: "",
        validate: "email"
    },
    password : {
        error: "",
        validate: "string",
        minLength : 0
    },
}

const Login = ({setloggedIn,setToken}) => {
    const navigate = useNavigate();
    const classes = useStyles();
    const {dark, toggleTheme} = React.useContext(ThemeContext);
    const dispatch = useDispatch();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const [values, setValues] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({})
    const [visible, setVisible] = useState(false);


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


    const handleSubmit = async () => {
        if (errors.emailError || errors.passwordError) {
            return;
        } else {
            enqueueSnackbar('Logging in...', { variant: 'info', key: 'logging_in' });
    
            try {
                const response = await fetch('http://localhost:7000/users/login', { // Adjust URL if needed
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: values.email,
                        password: values.password
                    })
                });
    
                const responseData = await response.json();
    
                if (!response.ok) {
                    throw new Error(responseData.message || 'Invalid Credentials');
                }
    
                closeSnackbar('logging_in');
                enqueueSnackbar('Logged in Successfully!', {
                    variant: 'success',
                    key: 'logged_in'
                });
    
                // Store the token
                localStorage.setItem('token', responseData.token);
    
                setloggedIn();
                setToken(responseData.token);
    
                navigate('/'); // Redirect to homepage
            } catch (e) {
                closeSnackbar('logging_in');
                enqueueSnackbar(e.message, { variant: 'error', key: 'error' });
            }
        }
    };
    
    return (
        <div>
            <Grid container spacing={2} direction="row" alignItems="center">
                <Grid item md={6} xs={12} >
                    <Paper elevation={2} className={classes.paper}>
                    <Typography variant='caption'>
                        The company can login into this portal if they have officially registered.
                    </Typography>
                    <TextField
                        name="email"
                        variant="outlined"
                        label="Company Email Address"
                        type="email"
                        value={values.email}
                        margin="normal"
                        onChange={handleChange}
                        helperText={errors.email}
                        error={!!errors.email}
                        fullWidth
                        autoFocus
                        required
                    />
                    <TextField
                        name="password"
                        variant="outlined"
                        label="Password"
                        value={values.password}
                        margin="normal"
                        type={visible? "text":"password"}
                        helperText={errors.password}
                        error={!!errors.email}
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
                    <Button onClick={handleSubmit} color="primary" variant="contained" style={{width:'100%',marginTop:10}}>
                        Login
                    </Button>
                    </Paper>
                </Grid>
                <Grid item md={6} xs={0} justifyContent="center" className={classes.logo}>
                {dark ? <img src='rnlogod.png'/> 
                : <img src='rnlogo.png'/>}
                </Grid>
            </Grid>
        </div>
    );
}

//}
                    

export default Login;