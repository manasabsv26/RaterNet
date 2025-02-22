import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import jwt_decode from "jwt-decode";
import axios from "axios";
import {
    Typography,
    Grid,
    Paper,
    Avatar,
    Button,
    Divider,
    TextField,
    Box,
    MenuItem,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from "@material-ui/core";

const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const Profile = () => {
    const history = useHistory();
    const token = localStorage.getItem("token");
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [locations, setLocations] = useState([]);
    const [isAddLocationOpen, setIsAddLocationOpen] = useState(false);
    const [newLocation, setNewLocation] = useState({ address_line1: "", city: "", state: "", pincode: "" });
    const baseUrl = "http://localhost:7000";

    useEffect(() => {
        const fetchUserDetails = async (asn) => {
            try {
                const response = await axios.get(`${baseUrl}/users/profile/${asn}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const userData = response.data.data.user;
                setUser(userData);
                setFormData(userData);
                fetchLocations(userData._id);
            } catch (error) {
                console.error("Error fetching user details:", error);
                history.push("/login");
            }
        };

        const fetchLocations = async (company_id) => {
            try {
                const response = await axios.get(`${baseUrl}/locations/options/${company_id}`);
                console.log("Fetched locations:", response.data.data.locations);
                setLocations(response.data.data.locations);
            } catch (error) {
                console.error("Error fetching locations:", error);
            }
        };

        if (token) {
            const decodedUser = jwt_decode(token);
            const asn = decodedUser.asn;

            if (asn) {
                fetchUserDetails(asn);
            } else {
                history.push("/login");
            }
        } else {
            history.push("/login");
        }
    }, [token, history]);

    const handleEditToggle = () => setIsEditing(!isEditing);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLocationChange = (e) => {
        const { name, value } = e.target;
        setNewLocation((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        const updatedFormData = { ...formData }; 
        delete updatedFormData.password;
        try {
            await axios.patch(`${baseUrl}/users/updateMe`, updatedFormData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(formData);
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating user details:", error);
        }
    };

    const handleAddLocation = async () => {
        if (!newLocation.address_line1 || !newLocation.city || !newLocation.state || !/^\d{6}$/.test(newLocation.pincode)) {
            alert("Please fill all fields correctly.");
            return;
        }
    
        try {
                await axios.post(`${baseUrl}/locations`, { 
                ...newLocation, 
                company_id: user._id 
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            // Ensure locations state is always an array before updating
            // setLocations((prev) => (Array.isArray(prev) ? [...prev, response.data] : [response.data]));

            const res = await axios.get(`${baseUrl}/locations/options/${user._id}`);
            setLocations(res.data.data.locations); // ✅ Update locations list
    
            setIsAddLocationOpen(false);
            setNewLocation({ addressLine1: "", city: "", state: "", pincode: "" });
        } catch (error) {
            console.error("Error adding location:", error);
        }
    };
    

    if (!user) return <Typography>Loading user data...</Typography>;

    return (
        <Box display="flex" bgcolor="#333" p={4}>
            <Paper style={{ padding: 20, width: "40%", backgroundColor: "#424242" }}>
                <Avatar style={{ margin: "auto", width: 100, height: 100 }}>{formData.name?.charAt(0)}</Avatar>
                <Typography variant="h4" style={{ margin: "20px 0", color: "white" }}>{formData.name}</Typography>

                {['asn', 'email', 'webURL'].map((field) => (
                    <Paper key={field} style={{ padding: 10, backgroundColor: "#616161", marginBottom: 10 }}>
                        {isEditing ? (
                            <TextField
                                fullWidth
                                label={field.toUpperCase()}
                                name={field}
                                value={formData[field] || ''}
                                onChange={handleInputChange}
                                size="small"
                                disabled={field !== 'webURL'}
                            />
                        ) : (
                            <Typography style={{ color: "white" }}>
                                <strong>{field.toUpperCase()}:</strong> {formData[field]}
                            </Typography>
                        )}
                    </Paper>
                ))}

                <Button variant="contained" style={{ backgroundColor: isEditing ? "#4caf50" : "#ffc107" }} onClick={isEditing ? handleSave : handleEditToggle}>
                    {isEditing ? "Save Changes" : "Edit Profile"}
                </Button>
            </Paper>

            <Box ml={4} flex={1}>
                <Typography variant="h5" style={{ color: "white" }}>ISP Locations</Typography>
                <Button variant="contained" color="primary" onClick={() => setIsAddLocationOpen(true)} style={{ marginBottom: 10 }}>
                    Add Location
                </Button>

                {/* Render Locations */}
                    {locations && locations.length > 0 ? (
                        <Paper style={{ padding: 10, backgroundColor: "#616161", marginTop: 10 }}>
                            {locations.map((location, index) => (
                                <Box key={index} p={2} mb={2} bgcolor="#424242">
                                    <Typography style={{ color: "white" }}>
                                        <strong>Address:</strong> {location.address_line1}, {location.city}, {location.state}, {location.pincode}
                                    </Typography>
                                </Box>
                            ))}
                        </Paper>
                    ) : (
                        <Typography style={{ color: "white", marginTop: 10 }}>No locations added yet.</Typography>
                    )}

                {/* Add Location Popup */}
                <Dialog open={isAddLocationOpen} onClose={() => setIsAddLocationOpen(false)}>
                    <DialogTitle>Add New Location</DialogTitle>
                    <DialogContent>
                        <TextField fullWidth label="Address Line 1" name="address_line1" value={newLocation.address_line1} onChange={handleLocationChange} margin="dense" />
                        <TextField fullWidth label="City" name="city" value={newLocation.city} onChange={handleLocationChange} margin="dense" />
                        <TextField select fullWidth label="State" name="state" value={newLocation.state} onChange={handleLocationChange} margin="dense">
                            {indianStates.map((state) => (
                                <MenuItem key={state} value={state}>{state}</MenuItem>
                            ))}
                        </TextField>
                        <TextField fullWidth label="Pincode" name="pincode" value={newLocation.pincode} onChange={handleLocationChange} margin="dense" />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setIsAddLocationOpen(false)} color="secondary">Cancel</Button>
                        <Button onClick={handleAddLocation} color="primary" variant="contained">Submit</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
};

export default Profile;
