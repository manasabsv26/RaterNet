import React,{useState} from 'react';
import {useDispatch} from 'react-redux'
import Button from '@material-ui/core/Button';
import {Grid,Paper,Typography} from '@material-ui/core'
import { useSnackbar } from "notistack";
import TextField from '@material-ui/core/TextField';
import IconButton from "@material-ui/core/IconButton";
import {Visibility, VisibilityOff} from "@material-ui/icons";
import { useHistory } from "react-router";
import {ThemeContext} from "../../context/ThemeContext";
import { makeStyles } from '@material-ui/core/styles';
import {loginUser} from '../../redux/actions/auth';
import formValidation from '../utils/formValidation';

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
    const history = useHistory();
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


    const handleSubmit = async ()=>{
        if (errors.emailError || errors.passwordError) {
            return;
         }else{
             enqueueSnackbar('Logging in....', {variant: 'info', key: 'logging_in'});
             try{
                 await dispatch(loginUser(values.email,values.password));
                 setTimeout(() => closeSnackbar('logging_in'), 3000);
                 setTimeout(() => enqueueSnackbar('Logged in Successfully!',{
                     variant: 'success',
                     key: 'logged_in'
                 }),
                 3000);
                 setTimeout(() => closeSnackbar('logged_in'), 6000);
                 setloggedIn();
                 setToken(localStorage.getItem('token'))
                 history.push('/');
             }catch(e){
                 setTimeout(() => closeSnackbar('logging_in'), 3000);
                 setTimeout(() => enqueueSnackbar(e.message, {variant: 'error', key: 'error'}), 3000);
                 setTimeout(() => closeSnackbar('error'), 6000);
             }
         }
    }

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
                        name="email"
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
                        name="password"
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
                <Grid item md={6} xs={0} align="center" className={classes.logo}>
                {dark ? <img src='rnlogod.png'/> 
                : <img src='rnlogo.png'/>}
                </Grid>
            </Grid>
        </div>
    );
}

//}
                    

export default Login;