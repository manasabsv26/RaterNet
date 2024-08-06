package com.example.raternet_isp_app.models;

public class Company implements Comparable<Company>{
    private String Name;
    private String Url;
    private String photoUrl;
    private String Number;
    private String Address;
    private String TypeofService;
    private String noofUsers;
    private String  avgRating;

    public Company(String name, String noofUsers, String avgRating) {
        Name = name;
        this.noofUsers = noofUsers;
        this.avgRating = avgRating;
    }

    public Company(String name,
                   String url, String photoUrl, String number, String address, String typeofService, String noofUsers, String avgRating) {
        Name = name;
        Url = url;
        this.photoUrl = photoUrl;
        Number = number;
        Address = address;
        TypeofService = typeofService;
        this.noofUsers = noofUsers;
        this.avgRating = avgRating;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public String getName() {
        return Name;
    }

    public void setName(String name) {
        Name = name;
    }

    public String getUrl() {
        return Url;
    }

    public void setUrl(String url) {
        Url = url;
    }

    public String getNumber() {
        return Number;
    }

    public void setNumber(String number) {
        Number = number;
    }

    public String getAddress() {
        return Address;
    }

    public void setAddress(String address) {
        Address = address;
    }

    public String getTypeofService() {
        return TypeofService;
    }

    public void setTypeofService(String typeofService) {
        TypeofService = typeofService;
    }

    public String getNoofUsers() {
        return noofUsers;
    }

    public void setNoofUsers(String noofUsers) {
        this.noofUsers = noofUsers;
    }

    public String getAvgRating() {
        return avgRating;
    }

    public Integer getAvgRatingasInt(){
        float avg = Float.parseFloat(avgRating);
        return (int) avg;
    }

    public void setAvgRating(String avgRating) {
        this.avgRating = avgRating;
    }

    @Override
    public int compareTo(Company o) {
        if(o.getAvgRating()==null || getAvgRating()==null)
        { return 0; }
        return getAvgRatingasInt().compareTo(o.getAvgRatingasInt());
    }
}
