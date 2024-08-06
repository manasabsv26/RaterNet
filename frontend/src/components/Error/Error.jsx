import React from 'react';
import ErrorIcon from '@material-ui/icons/Error';
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
    paper:{
        padding: theme.spacing(5),
        width : '100%',
        justifyContent:'center',
        alignItems : 'center',
        textAlign:'center',
        backgroundColor : 'red'
    }
}))

const Error = (props)=>{
    const classes = useStyles();
    return (
        <Paper elevation={2} className={classes.paper}>
            <ErrorIcon fontSize='large' color='white'/>
            <Typography variant='h4' color='white'>
                {props.message}
            </Typography>
        </Paper>
    )
}

export default Error;