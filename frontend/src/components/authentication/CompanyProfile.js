import React,{useEffect,useState} from "react";
import {useDispatch,useSelector} from "react-redux";
import {Typography,Grid,TextField,Paper,Divider} from "@mui/material";
import { makeStyles } from '@mui/styles';
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