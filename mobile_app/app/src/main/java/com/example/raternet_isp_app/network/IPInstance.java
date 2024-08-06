package com.example.raternet_isp_app.network;

import android.content.Context;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.io.IOException;

import okhttp3.Interceptor;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class IPInstance {
    private static Retrofit retrofitIP;
    private static final String IP_URL = "https://api.ipify.org/?format=json";

    public static synchronized Retrofit getRetrofitInstance() {
        if (retrofitIP == null) {
            HttpLoggingInterceptor interceptor = new HttpLoggingInterceptor();
            interceptor.level(HttpLoggingInterceptor.Level.BODY);
            OkHttpClient okHttpClient = new OkHttpClient.Builder()
                    .addInterceptor(interceptor).build();

            Gson gson = new GsonBuilder()
                    .setLenient()
                    .create();
            retrofitIP = new Retrofit.Builder()
                    .baseUrl(IP_URL)
                    .client(okHttpClient)
                    .addConverterFactory(GsonConverterFactory.create(gson)) // converts json obj-> java obj
                    .build();
        }
        return retrofitIP;
    }
}
