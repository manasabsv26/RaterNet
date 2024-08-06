package com.example.raternet_isp_app.models;

import java.io.Serializable;

public class User implements Serializable
{
    private String emailId=null;
    private String userName=null;
    private String photoURL = null;
    private String phoneNumber = null;

    public User() {}

    public User(String emailId,String userName, String photoURL, String phoneNumber) {
        this.emailId = emailId;
        this.userName = userName;
        this.photoURL = photoURL;
        this.phoneNumber = phoneNumber;
    }

    //Without Profile Picture for Now.
    public User(String emailId, String userName, String phoneNumber) {
        this.emailId = emailId;
        this.userName = userName;
        this.phoneNumber = phoneNumber;
    }

    public String getEmailId() {
        return emailId;
    }

    public String getPhotoURL() {
        return photoURL;
    }

    public void setPhotoURL(String photoURL) {
        this.photoURL = photoURL;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public void setEmailId(String emailId) {
        this.emailId = emailId;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserName() {
        return userName;
    }
}
