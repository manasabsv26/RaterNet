import React,{useEffect,useState} from "react";
import {useDispatch,useSelector} from "react-redux";
import {Typography,Grid,TextField,makeStyles,Paper,Divider} from "@material-ui/core";
import {Map,GoogleApiWrapper} from 'google-maps-react';
import Geocode from "react-geocode";

const useStyles = makeStyles(theme=>({
    map : {
        padding : 10
    }

}))

const CompanyProfile=(props)=>{
    const dispatch = useDispatch();
    return (
        <div>

        </div>
    )
}

export default CompanyProfile;