package com.example.raternet_isp_app.auth_preferences;

import android.content.Context;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;

import com.example.raternet_isp_app.models.User;

import com.google.gson.Gson;


public class SaveSharedPreferences {
    static final String PREF_USER= null;

    static SharedPreferences getSharedPreferences(Context ctx) {
        return PreferenceManager.getDefaultSharedPreferences(ctx);
    }

    public static void setUser(Context ctx, User user)
    {
        Gson gson = new Gson();
        SharedPreferences.Editor editor = getSharedPreferences(ctx).edit();
        editor.putString("User",gson.toJson(user));
        editor.apply();
    }
    public static User getUser(Context ctx){
        Gson gson = new Gson();
        return gson.fromJson(getSharedPreferences(ctx).getString("User",""),User.class);
    }

    public static void setReviewCount(Context ctx,int count){
        SharedPreferences.Editor editor = getSharedPreferences(ctx).edit();
        editor.putInt("count",count);
        editor.apply();
    }

    public static int getReviewCount(Context ctx){
        return getSharedPreferences(ctx).getInt("count",0);
    }

    public static void clearUser(Context ctx)
    {
        SharedPreferences.Editor editor = getSharedPreferences(ctx).edit();
        editor.clear(); //clear all stored data
        editor.apply();
    }


}
