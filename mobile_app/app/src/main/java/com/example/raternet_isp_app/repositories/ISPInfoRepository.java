package com.example.raternet_isp_app.repositories;

import com.example.raternet_isp_app.endpoints.GetDataService;
import com.example.raternet_isp_app.models.ISPInfoModel;
import com.example.raternet_isp_app.models.ObjectModel;
import com.example.raternet_isp_app.network.IPInstance;
import com.example.raternet_isp_app.network.ISPInstance;
import com.google.gson.JsonObject;

import org.json.JSONObject;

import androidx.lifecycle.MutableLiveData;
import kotlin.io.TextStreamsKt;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ISPInfoRepository {
    final MutableLiveData<ObjectModel> ISPinfo;
    final GetDataService getIPService,getISPService;

    public ISPInfoRepository(){
        ISPinfo = new MutableLiveData<ObjectModel>();
        getIPService = IPInstance.getRetrofitInstance().create(GetDataService.class);
        getISPService = ISPInstance.getRetrofitInstance().create(GetDataService.class);
    }

    public MutableLiveData<ObjectModel> getISPInfo(){
        getIPService.getIP().enqueue(new Callback<String>() {
            @Override
            public void onResponse(Call<String> call, Response<String> response) {
                try {
                    String ip = response.body();
                    getISPService.getIPInfo(ip).enqueue(new Callback<JsonObject>() {
                        @Override
                        public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
                            if(response.isSuccessful()){
                                JsonObject jsonObject = response.body();
                                String ispOrg =jsonObject.get("org").getAsString();
                                String ispName = jsonObject.get("isp").getAsString();
                                String ispASN = jsonObject.get("as").getAsString().split(" ")[0];
                                ISPInfoModel info = new ISPInfoModel(ispName,ispOrg,ispASN);
                                ISPinfo.postValue(new ObjectModel(true,info,response.message()));
                            } else {
                                try {
                                    if (response.errorBody() != null) {
                                        JSONObject errObj = new JSONObject(TextStreamsKt.readText(response.errorBody().charStream()));
                                        ISPinfo.postValue(new ObjectModel(false, response.body(), errObj.optString("message")));
                                    } else{
                                        ISPinfo.postValue(new ObjectModel(false, response.body(), response.message()));
                                    }
                                } catch (Exception e) {
                                    e.printStackTrace();
                                    ISPinfo.postValue(new ObjectModel(false, response.body(), response.message()));
                                }
                            }
                        }

                        @Override
                        public void onFailure(Call<JsonObject> call, Throwable t) {
                            ISPinfo.postValue(new ObjectModel(false, null, t.getMessage()));
                        }
                    });

                } catch (Exception e) {
                    try {
                        if (response.errorBody() != null) {
                            JSONObject errObj = new JSONObject(TextStreamsKt.readText(response.errorBody().charStream()));
                            ISPinfo.postValue(new ObjectModel(false, response.body(), errObj.optString("message")));
                        } else{
                            ISPinfo.postValue(new ObjectModel(false, response.body(), response.message()));
                        }
                    } catch (Exception e1) {
                        e1.printStackTrace();
                        ISPinfo.postValue(new ObjectModel(false, response.body(), response.message()));
                    }
                }
            }

            @Override
            public void onFailure(Call<String> call, Throwable t) {
                ISPinfo.postValue(new ObjectModel(false, null, t.getMessage()));
            }
        });
        return ISPinfo;
    }

}
