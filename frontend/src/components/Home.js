import React,{useEffect, useState} from "react";
import {useDispatch,useSelector} from "react-redux";
import {
    Typography,
    Grid,
    TextField,
    Paper,
    Divider,
    Box,
    Button
} from "@material-ui/core";
import { BarChart,Bar, XAxis, YAxis,CartesianGrid,Tooltip,Legend,LineChart,Line} from 'recharts';
import {Map,GoogleApiWrapper} from 'google-maps-react';
import jwt_decode from "jwt-decode";
import Rating from '@material-ui/lab/Rating';
import Chip from '@material-ui/core/Chip';
import {fetchReviews} from '../redux/actions/reviews'
import Loading from './Loading/Loading'
import Error from './Error/Error';
import Geocode from 'react-geocode'
import axios from 'axios'
import { useHistory } from "react-router";
require('dotenv').config({ debug: true })

const Home = (props) => {
    const history = useHistory();
    const token = localStorage.getItem('token');
    const [location,setlocation] = React.useState("Erandwane");
    const [reviews, setReviews] = useState([]);
    const [barData,setbarData] = React.useState([]);
    const [lineData,setlineData] = React.useState(null)
    const [loading,setLoading] = React.useState(false);
    const [error,setError] = React.useState(null);
    const [services,setServices] = React.useState({});

    const setInitialLocation = async (id)=>{
        /*Geocode.setApiKey(`${process.env.REACT_APP_API_URL}`);
        Geocode.enableDebug();
        navigator.geolocation.getCurrentPosition(function(position) {
            Geocode.fromLatLng(position.coords.latitude, position.coords.longitude).then(
                response => {
                  console.log(response.results[0].formatted_address);
                  const address = response.results[0].formatted_address;
                  await getReviews(id,address.split(",")[2]);
                },
                error => {
                  return "Erandwane"
                }
              );
          });*/
          return "Erandwane";
    }
    
    const renderReviews = () => {
        if (!reviews || reviews.length === 0) {
            return <Typography variant="h6" color="textSecondary">No reviews available.</Typography>;
        }
    
        return (
            <React.Fragment>
                {reviews.filter(review => review.locality === location).map(review => (
                    <Paper key={review._id} elevation={2} style={{ margin: 10, padding: 10 }}>
                        <Typography variant='h5'>{review.isp_Name}</Typography>
                        <Typography variant='h5' color='textSecondary'>{review.locality}</Typography>
                        <Divider fullWidth />
                        <Typography variant="h6">{review.feedback}</Typography>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Rating name="read-only" value={review.overallRating} readOnly />
                            <Button variant='contained' color='primary'>Know More</Button>
                        </div>
                    </Paper>
                ))}
            </React.Fragment>
        );
    };

    const renderServices = () => {
        return (
            <div style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Chip 
                    size='large' 
                    label={`WiFi: ${isNaN(services['WiFi']) ? 0 : services['WiFi']}%`} 
                    color='secondary' 
                />
                <Chip 
                    size='large' 
                    label={`Data: ${isNaN(services['Data']) ? 0 : services['Data']}%`} 
                    color='secondary' 
                />
                <Chip 
                    size='large' 
                    label={`BroadBand: ${isNaN(services['Broadband']) ? 0 : services['Broadband']}%`} 
                    color='secondary' 
                />
            </div>
        );
    };
    
   
    const getReviews = async (asn,location)=>{
        try{
          const reviews = await fetchReviews(asn,location);
          displayData(reviews);
          setLoading(false)
        } catch(e){
          setError(e.message);
          setLoading(false);
        }
    }

    useEffect(() => {
        const fetchReviews = async () => {
            if (token) {
                try {
                    const user = jwt_decode(token);
                    const data = await getReviews(user.id, setInitialLocation());
                    setReviews(data); 
                    
                } catch (error) {
                    console.error('Error fetching reviews:', error);
                }
            } else {
                history.push('/login');
            }
        };

        fetchReviews();
    }, [token, history]);

    const displayData = () => {
        let averages = {
            overallRating: 0,
            priceRating: 0,
            speedRating: 0,
            serviceRating: 0
        };
        let service = {
            'WiFi': 0,
            'Broadband': 0,
            'Data': 0
        };
        let noofUsers = {};
        let data1 = [];
        let data2 = [];
        let ratings = reviews || [];
    
        if (ratings.length === 0) {
            //
            data1 = [
                { name: 'overallRating', ratings: 0 },
                { name: 'priceRating', ratings: 0 },
                { name: 'speedRating', ratings: 0 },
                { name: 'serviceRating', ratings: 0 }
            ];
    
            data2 = [{ name: 'No Data', users: 0 }];
            service = { 'WiFi': 0, 'Broadband': 0, 'Data': 0 };
    
            setbarData(data1);
            setlineData(data2);
            setServices(service);
            return; //Exit early since there's no data to process
        }
    
        //Calculate averages and user counts if reviews exist
        ratings.forEach(review => {
            averages.overallRating += Number(review.overallRating);
            averages.priceRating += Number(review.priceRating);
            averages.speedRating += Number(review.speedRating);
            averages.serviceRating += Number(review.serviceRating || 0);
            service[review.type] += 1;
            noofUsers[review.reviewDate] = noofUsers.hasOwnProperty(review.reviewDate)
                ? noofUsers[review.reviewDate] + 1
                : 1;
        });
    
        //Prepare data for Bar Chart
        for (let key in averages) {
            averages[key] /= ratings.length;
            data1.push({
                name: key,
                ratings: isNaN(averages[key]) ? 0 : averages[key] // ✅ Handle NaN
            });
        }
    
        // ✅ Prepare data for Line Chart
        for (let key in noofUsers) {
            data2.push({
                name: key,
                users: noofUsers[key]
            });
        }
    
        // ✅ Calculate service usage percentages
        for (let key in service) {
            service[key] = ratings.length ? (service[key] * 100) / ratings.length : 0;
        }
    
        setbarData(data1);
        setlineData(data2);
        setServices(service);
    };    
    
    const handleLocChange = (e)=>setlocation(e.target.value);
    const handleSearch = async ()=>{
        let user = jwt_decode(token);
        await getReviews(user.id,location);
    }

    if(error){
        return <Error message = {error}/>
    }

    if(loading){
        return <Loading message = "Loading Your Plans"/>
    }

    return (
        <Grid container justify="center" spacing={2}>
            <Grid item xs={6}>
                <Grid container spacing={2} style={{marginTop : 10}} >
                    <div style={{
                        width : '100%',
                        display:'flex',
                        justifyContent : 'space-between'
                    }}>
                        <TextField onChange={handleLocChange} label="Search location..." variant="outlined" fullWidth/>
                        <Button variant='contained' color='primary' onClick={handleSearch}>Search</Button>
                    </div>
                    <Grid item xs={12} style={{position: 'relative', height: '50vh'}}>
                        <Map 
                        google={props.google} 
                        zoom={4}
                        style={{marginTop: 10,marginRight:15}}>
                        </Map>  
                    </Grid>
                    <Grid item xs={12} style={{position: 'relative',marginTop : 20}}>
                        <Box elevation={1} style={{padding:20,height: '45vh',overflow:'auto',scrollBehavior : 'smooth'}}>
                            {renderReviews()}
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={6}>
                <Paper elevation={2} style={{padding: 30,margin : 10}} justify="center">
                <Typography variant="h4">
                    {reviews && reviews.length > 0
                        ? `${((reviews.filter(review => review.locality === location).length / reviews.length) * 100).toFixed(1)}% Users in ${location}`
                        : `No users in ${location}`}
                </Typography>
                    <br></br>
                    <Divider/>
                    <br></br>
                    {renderServices()}
                </Paper>
                <br></br>
                <Paper elevation={2} style={{padding: 10,margin : 10}} justify="center">       
                <BarChart width={600} height={250} data={barData.length > 0 ? barData : [{ name: 'No Data', ratings: 0 }]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 5]} /> {/* Set Y-axis to 5 for ratings out of 5 */}
                    <Tooltip />
                    <Bar dataKey="ratings" fill={barData.length > 0 ? "#64b5f6" : "#ccc"} />
                </BarChart>
                </Paper>
                <br></br>
                <Paper elevation={2} style={{padding: 10,margin : 10}} justify="center">  
                        {lineData && lineData.length > 1 ? (
                            <LineChart 
                                width={600} 
                                height={250} 
                                data={lineData}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <XAxis dataKey="name" />
                                <YAxis domain={[0, 5]} />
                                <Tooltip />
                                <Legend />
                                <Line 
                                    type="monotone" 
                                    dataKey="users" 
                                    stroke="#ffc107" 
                                    activeDot={{ r: 8 }} 
                                />
                            </LineChart>
                        ) : (
                            <div style={{
                                width: '600px',
                                height: '250px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#333',  // Match chart background
                                borderRadius: '8px',
                                color: '#8884d8',
                                fontSize: '18px'
                            }}>
                                No User Data Available
                            </div>
                        )}
                </Paper> 
            </Grid>
        </Grid>
    )
}

export default GoogleApiWrapper({
    apiKey: process.env.REACT_APP_API_URL,
    language: 'en',
    v: '3',                       // API version
    loading: 'async'              //This enables async loading
})(Home);