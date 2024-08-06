import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from '@material-ui/core/Typography';

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