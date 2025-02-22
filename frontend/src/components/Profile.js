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
    Box
} from "@material-ui/core";

const Profile = () => {
    const history = useHistory();
    const token = localStorage.getItem("token");
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const baseUrl = "http://localhost:7000";

    useEffect(() => {

        const fetchUserDetails = async (asn) => {
            try {
                const response = await axios.get(`${baseUrl}/users/profile/${asn}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const userData = response.data.data.user;
                console.log("Fetched User:", response.data.data.user);
                setUser(userData);
                setFormData(userData);
            } catch (error) {
                console.error("Error fetching user details:", error);
                history.push("/login");
            }
        };


        if (token) {
            const decodedUser = jwt_decode(token);
            const asn = decodedUser.asn;

            if (asn) {
                fetchUserDetails(asn);
            } else {
                console.error("ASN is missing in the token.");
                history.push("/login");
            }

        } else {
            history.push("/login");
        }
    }, [token, history]);


    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    // Save changes
    const handleSave = async () => {
        console.log("Saved Data:", formData);
        const updatedFormData = { ...formData };  // Create a copy to avoid mutating the original
        delete updatedFormData.password;
        try {
            await axios.patch(`${baseUrl}/users/updateMe`, updatedFormData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUser(formData);
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating user details:", error);
        }
        
    };

    if (!user) {
        return <Typography variant="h6">Loading user data...</Typography>;
    }

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            bgcolor="#333"
        >
            <Paper
                elevation={3}
                style={{
                    padding: "30px",
                    width: "400px",
                    backgroundColor: "#424242",
                    borderRadius: "12px",
                    textAlign: "center"
                }}
            >
                <Avatar style={{ margin: "auto", width: 100, height: 100, backgroundColor: "#757575" }}>
                    {formData.name ? formData.name.charAt(0) : "U"} 
                </Avatar>

                <Typography variant="h4" style={{ margin: "20px 0", color: "white" }}>
                    {formData.name}
                </Typography>

                {/* ASN */}
                <Paper style={{ padding: "10px", marginBottom: "10px", backgroundColor: "#616161" }}>
                    {isEditing ? (
                        <TextField
                            fullWidth
                            label="ASN"
                            variant="outlined"
                            name="asn"
                            value={formData.asn}
                            onChange={handleInputChange}
                            size="small"
                            disabled 
                        />
                    ) : (
                        <Typography variant="body1" style={{ color: "white" }}>
                            <strong>ASN:</strong> {formData.asn}
                        </Typography>
                    )}
                </Paper>

                {/* Email */}
                <Paper style={{ padding: "10px", marginBottom: "10px", backgroundColor: "#616161" }}>
                    {isEditing ? (
                        <TextField
                            fullWidth
                            label="Email"
                            variant="outlined"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            size="small"
                            disabled
                        />
                    ) : (
                        <Typography variant="body1" style={{ color: "white" }}>
                            <strong>Email:</strong> {formData.email}
                        </Typography>
                    )}
                </Paper>

                {/* Website */}
                <Paper style={{ padding: "10px", marginBottom: "10px", backgroundColor: "#616161" }}>
                    {isEditing ? (
                        <TextField
                            fullWidth
                            label="Website"
                            variant="outlined"
                            name="webURL"
                            value={formData.webURL}
                            onChange={handleInputChange}
                            size="small"
                        />
                    ) : (
                        <Typography variant="body1" style={{ color: "white" }}>
                            <strong>Website:</strong>{" "}
                            <a href={formData.webURL} style={{ color: "#90caf9" }}>
                                {formData.webURL}
                            </a>
                        </Typography>
                    )}
                </Paper>

                {/* Button */}
                <Button
                    variant="contained"
                    color="primary"
                    style={{
                        marginTop: "20px",
                        backgroundColor: isEditing ? "#4caf50" : "#ffc107",
                        color: "black"
                    }}
                    onClick={isEditing ? handleSave : handleEditToggle}
                >
                    {isEditing ? "Save Changes" : "Edit Profile"}
                </Button>
            </Paper>
        </Box>
    );
};

export default Profile;