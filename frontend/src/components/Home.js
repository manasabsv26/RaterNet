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
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
require('dotenv').config({ debug: true })

const mapContainerStyle = {
    width: "100%",
    height: "50vh",
};

const defaultCenter = { lat: 19.076, lng: 72.8777 };

const Home = (props) => {
    const history = useHistory();
    const token = localStorage.getItem('token');
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [barData,setbarData] = React.useState([]);
    const [lineData,setlineData] = React.useState(null)
    const [loading,setLoading] = React.useState(false);
    const [error,setError] = React.useState(null);
    const [services,setServices] = React.useState({});

    const baseUrl = "http://localhost:7000"; 

    const setInitialLocation = async (userId) => {
        try {
            // ✅ Fetch user's locations
            const response = await axios.get(`${baseUrl}/locations/options/${userId}`);
            const locations = response.data.data.locations; 
    
            console.log("User locations:", locations); // Debugging
    
            if (locations.length === 0) {
                return { lat: 19.076, lng: 72.8777 }; // Default to Mumbai if no locations found
            }
    
            // ✅ Convert addresses to coordinates using Geocode API
            Geocode.setApiKey(process.env.REACT_APP_API_URL);
            Geocode.setLanguage("en");
            
            const locationPromises = locations.map(async (location) => {
                const address = `${location.address_line1}, ${location.city}, ${location.state}, ${location.pincode}`;
                try {
                    const geoResponse = await Geocode.fromAddress(address);
                    const { lat, lng } = geoResponse.results[0].geometry.location;
                    return { lat, lng };
                } catch (error) {
                    console.error("Error fetching coordinates for:", address, error);
                    return null; // If error, return null (it will be filtered out later)
                }
            });
    
            const coordinates = (await Promise.all(locationPromises)).filter(coord => coord !== null);
            
            console.log("Mapped coordinates:", coordinates); // Debugging
    
            return coordinates; // Return all locations as an array of { lat, lng }
        } catch (error) {
            console.error("Error fetching user locations:", error);
            return [{ lat: 19.076, lng: 72.8777 }]; // Default to Mumbai
        }
    };
    
    const renderReviews = () => {
        if (!reviews || reviews.length === 0) {
            return <Typography variant="h6" color="textSecondary">No reviews available.</Typography>;
        }
    
        return (
            <React.Fragment>
                {reviews.filter(review => review.locality === selectedLocation).map(review => (
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
                    size='medium' 
                    label={`WiFi: ${isNaN(services['WiFi']) ? 0 : services['WiFi']}%`} 
                    color='secondary' 
                />
                <Chip 
                    size='medium' 
                    label={`Data: ${isNaN(services['Data']) ? 0 : services['Data']}%`} 
                    color='secondary' 
                />
                <Chip 
                    size='medium' 
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

        const fetchLocations = async () => {
            if(token){
                try{
                    const user =jwt_decode(token);
                    const coords = await setInitialLocation(user.id);
                    setLocations(coords);

                    if (coords.length > 0) {
                        setSelectedLocation(coords[0]); 
                    }
                } catch (error){
                    console.error('Error fetching locations');
                }
            } else {
                history.push('/login')
            }  
        };

        fetchReviews();
        fetchLocations();
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
    
    const handleLocChange = (e)=>setSelectedLocation(e.target.value);
    const handleSearch = async ()=>{
        let user = jwt_decode(token);
        await getReviews(user.id,selectedLocation);
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
                    <Grid item xs={12} style={{ position: "relative", height: "50vh" }}>
                        <LoadScript googleMapsApiKey={process.env.REACT_APP_API_URL}>
                            <GoogleMap
                                mapContainerStyle={mapContainerStyle}
                                zoom={10}
                                center={locations[0] || defaultCenter} // Center on first location
                            >
                                {/* Render markers for all locations */}
                                {locations.map((coord, index) => (
                                    <Marker key={index} position={coord} />
                                ))}
                            </GoogleMap>
                        </LoadScript>
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
                        ? `${((reviews.filter(review => review.locality === selectedLocation).length / reviews.length) * 100).toFixed(1)}% Users in ${selectedLocation}`
                        : `No users in ${selectedLocation}`}
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