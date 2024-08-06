package com.example.raternet_isp_app.fragments;

import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.location.Address;
import android.location.Geocoder;
import android.net.ConnectivityManager;
import android.net.NetworkCapabilities;
import android.net.wifi.WifiManager;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;

import com.example.raternet_isp_app.models.Constants;
import com.example.raternet_isp_app.R;
import com.example.raternet_isp_app.models.ISPInfoModel;
import com.example.raternet_isp_app.models.ObjectModel;
import com.example.raternet_isp_app.ratings.SearchNetworkActivity;
import com.example.raternet_isp_app.endpoints.GetDataService;
import com.example.raternet_isp_app.motionlisteners.OnSwipeTouchListener;
import com.example.raternet_isp_app.network.IPInstance;
import com.example.raternet_isp_app.network.ISPInstance;
import com.example.raternet_isp_app.view_models.ISPInfoViewModel;
import com.example.raternet_isp_app.view_models.LocationViewModel;
import com.google.android.gms.maps.model.LatLng;
import com.google.gson.JsonObject;

import java.io.IOException;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProvider;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ISPInfo extends Fragment implements View.OnClickListener{
    private TextView ISPView;
    private ProgressDialog progressDialog;
    private ViewGroup ispDetails;
    private TextView ispSpeedUp,organization,addressView;
    private ConnectivityManager cm;
    private Geocoder geocoder;
    private AlertDialog.Builder alertDialogBuilder;
    private LocationViewModel locationViewModel;
    private ISPInfoViewModel ispInfoViewModel;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view =  inflater.inflate(R.layout.isp_view, container, false);
        ISPView = view.findViewById(R.id.ISP);
        locationViewModel = new ViewModelProvider(this).get(LocationViewModel.class);
        ispInfoViewModel = new ViewModelProvider(this).get(ISPInfoViewModel.class);
        geocoder = new Geocoder(this.getContext());
        alertDialogBuilder = new AlertDialog.Builder(getContext());
        return view;
    }

    @Override
    @SuppressLint("NewApi")
    public void onActivityCreated(@Nullable Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        ispDetails = getView().findViewById(R.id.details);
        ispSpeedUp = ispDetails.findViewById(R.id.isp_speed_up);
        organization = ispDetails.findViewById(R.id.org);
        addressView = getView().findViewById(R.id.address);
        cm = (ConnectivityManager)  getContext().getSystemService(Context.CONNECTIVITY_SERVICE);
        //should check null because in airplane mode it will be null
        NetworkCapabilities nc = cm.getNetworkCapabilities(cm.getActiveNetwork());
        try {
            ispSpeedUp.setText(getWifiLevel().toString() + " Mbps");
        } catch (Exception e){
            if(nc!=null){
                Integer upSpeed = nc.getLinkUpstreamBandwidthKbps();
                Double speed = (double) upSpeed * 0.0010;
                ispSpeedUp.setText(speed.toString() + " Mbps");
            }
        }
        fetchIPInfo();
        locationViewModel.startLocationUpdates();
        locationViewModel.getCoordinates().observe(getActivity(), new Observer<LatLng>() {
            @Override
            public void onChanged(final LatLng latLng) {
                final Double latitude = latLng.latitude;
                final Double longitude = latLng.longitude;
                try {
                    Address address = geocoder.getFromLocation(
                            latitude,
                            longitude,
                            1).get(0);
                    String displayAddress = address.getSubLocality()+ " " + address.getLocality() + " " + address.getPostalCode();
                    addressView.setText(displayAddress);
                } catch (IOException e) {
                    displayError(e.getMessage());
                    e.printStackTrace();
                }
            }
        });
        getView().setOnTouchListener(new OnSwipeTouchListener(getContext()){
            public void onSwipeTop() {
                ispDetails.setVisibility(View.VISIBLE);
            }
            public void onSwipeBottom() {
                ispDetails.setVisibility(View.GONE);
            }
        });
        getView().findViewById(R.id.btnSearchNetwork).setOnClickListener(this);
        getView().findViewById(R.id.Refresh).setOnClickListener(this);
        getView().findViewById(R.id.discuss).setOnClickListener(this);
    }

    @Override
    public void onResume() {
        super.onResume();
        //fetchIPInfo();
    }

    public void fetchIPInfo(){
        progressDialog = new ProgressDialog(getContext());
        progressDialog.setMessage("Getting your Network Info..."); // show progess dialog till server responds
        progressDialog.show();
        ispInfoViewModel.getISPInfo().observe(getActivity(),new Observer<ObjectModel>(){
            @Override
            public void onChanged(ObjectModel objectModel) {
                progressDialog.dismiss();
                if(objectModel.isStatus()){
                    ISPInfoModel ispInfo = (ISPInfoModel) objectModel.getObj();
                    ISPView.setText(ispInfo.getIspName());
                    organization.setText(ispInfo.getIspASN());

                }else {
                    displayError(objectModel.getMessage());
                }
            }
        });

    }

    public void displayError(String message){
        alertDialogBuilder.setTitle("Error")
                .setMessage(message)
               .setNegativeButton("Ok", new DialogInterface.OnClickListener() {
                   @Override
                   public void onClick(DialogInterface dialog, int which) {
                       dialog.cancel();
                   }
               });
    }


    public Integer getWifiLevel()
    {
        WifiManager wifiManager = (WifiManager) getContext().getApplicationContext().getSystemService(Context.WIFI_SERVICE);
        int linkSpeed = wifiManager.getConnectionInfo().getRssi();
        int level = WifiManager.calculateSignalLevel(linkSpeed, 5);
        return level;
    }



    @Override
    public void onClick(View v) {
        switch (v.getId()){
            case R.id.btnSearchNetwork:
                startActivity(new Intent(getContext(), SearchNetworkActivity.class));
                break;
            case R.id.Refresh :
                ispDetails.setVisibility(View.VISIBLE);
                break;
            default: break;
        }
    }
}

