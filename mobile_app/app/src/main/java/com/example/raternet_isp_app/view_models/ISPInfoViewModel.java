package com.example.raternet_isp_app.view_models;

import com.example.raternet_isp_app.models.ObjectModel;
import com.example.raternet_isp_app.repositories.ISPInfoRepository;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.ViewModel;

public class ISPInfoViewModel extends ViewModel {
    private ISPInfoRepository repository;

    public ISPInfoViewModel() {
        super();
        this.repository = new ISPInfoRepository();
    }
    public LiveData<ObjectModel> getISPInfo(){
        return repository.getISPInfo();
    }
}
