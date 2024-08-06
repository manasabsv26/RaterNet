package com.example.raternet_isp_app.view_models;

import android.app.Application;

import com.example.raternet_isp_app.repositories.LocationRepository;
import com.google.android.gms.maps.model.LatLng;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;


public class LocationViewModel extends AndroidViewModel{
    private LocationRepository repository;
    private LiveData<LatLng> coordinates;

    public LiveData<LatLng> getCoordinates() {
        return coordinates;
    }

    public LocationViewModel(@NonNull Application application) {
        super(application);
        repository = new LocationRepository(application);
        coordinates = repository.getCoordinates();
    }

    public void startLocationUpdates(){
        repository.startLocationUpdates();
    }
    public void stopLocationUpdates(){
        repository.stopLocationUpdates();
    }
}
