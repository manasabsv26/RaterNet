package com.example.raternet_isp_app.models;

public class ISPInfoModel {
    private String ispName;
    private String ispOrg;
    private String ispASN;

    public ISPInfoModel(String ispName, String ispOrg, String ispASN) {
        this.ispName = ispName;
        this.ispOrg = ispOrg;
        this.ispASN = ispASN;
    }

    public String getIspName() {
        return ispName;
    }

    public void setIspName(String ispName) {
        this.ispName = ispName;
    }

    public String getIspOrg() {
        return ispOrg;
    }

    public void setIspOrg(String ispOrg) {
        this.ispOrg = ispOrg;
    }

    public String getIspASN() {
        return ispASN;
    }

    public void setIspASN(String ispASN) {
        this.ispASN = ispASN;
    }
}
