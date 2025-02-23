import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { makeStyles } from "@mui/styles";
import Paper from "@mui/material/Paper";
import Typography from '@mui/material/Typography';

const useStyles = makeStyles(theme => ({
    paper:{
      padding: theme.spacing(5),
      width : '100%',
      justifyContent:'center',
      alignItems : 'center',
      textAlign:'center'
    }
}))

const Loading = (props)=>{
    const classes = useStyles();
    return (
        <Paper elevation={2} className={classes.paper}>
            <CircularProgress/>
            <Typography variant='h6'>
                {props.message}
            </Typography>
        </Paper>
    )
}

export default Loading;