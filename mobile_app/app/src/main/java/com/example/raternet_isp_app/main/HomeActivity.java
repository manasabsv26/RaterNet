package com.example.raternet_isp_app.main;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.fragment.app.FragmentTransaction;

import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.Gravity;
import android.view.MenuItem;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import com.example.raternet_isp_app.R;
import com.example.raternet_isp_app.fragments.ISPInfo;
import com.example.raternet_isp_app.fragments.LocationService;
import com.example.raternet_isp_app.fragments.Profile;
import com.example.raternet_isp_app.auth_preferences.SaveSharedPreferences;
import com.example.raternet_isp_app.models.Constants;
import com.example.raternet_isp_app.models.User;
import com.example.raternet_isp_app.ratings.IspRatingsActivity;
import com.example.raternet_isp_app.ratings.ViewReviewActivity;
import com.google.android.material.navigation.NavigationView;
import com.google.firebase.auth.FirebaseAuth;

public class HomeActivity extends AppCompatActivity implements View.OnClickListener,
        NavigationView.OnNavigationItemSelectedListener{

    private TextView btnWriteReview;
    private TextView btnSearchNetwork;
    private TextView userNameDrawer,EmailDrawer;
    private User currentUser;
    public FirebaseAuth firebaseAuth;
    private ImageView openDrawer,userPic;
    private DrawerLayout drawerLayout;
    private ActionBarDrawerToggle drawerToggle;
    private FragmentTransaction fragmentTransaction;
    private NavigationView navigationView;
    private View headerView;
    private Uri imageUri;
    private Profile profile;
    public static final int GALLERY_KITKAT_INTENT_CALLED = 2;

    @RequiresApi(api = Build.VERSION_CODES.M)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main2);
        firebaseAuth = FirebaseAuth.getInstance();

        drawerLayout = findViewById(R.id.drawer_layout);
        navigationView = findViewById(R.id.navigationView);
        openDrawer = findViewById(R.id.open_drawer);

        headerView = navigationView.getHeaderView(0);
        userNameDrawer = headerView.findViewById(R.id.nameTxt);
        EmailDrawer = headerView.findViewById(R.id.emailTxt);
        userPic = headerView.findViewById(R.id.profileImageView);
        initDrawer();
        navigationView.setNavigationItemSelectedListener(this);

        btnWriteReview = findViewById(R.id.btnWriteReview);
        btnSearchNetwork = findViewById(R.id.btnSearchNetwork);

        btnWriteReview.setOnClickListener(this);
        //btnSearchNetwork.setOnClickListener(this);

        currentUser = SaveSharedPreferences.getUser(HomeActivity.this);
        String photoURI = currentUser.getPhotoURL();

        /*if(photoURI!=null){
            imageUri = Uri.parse(photoURI);
            userPic.setImageURI(imageUri);
        }*/

        userNameDrawer.setText(currentUser.getUserName());
        EmailDrawer.setText(currentUser.getEmailId());
        //Setting email in Constants.
        Constants.UserEmail=currentUser.getEmailId();

        fragmentTransaction = getSupportFragmentManager().beginTransaction();
        fragmentTransaction.replace(R.id.map_placeholder,new LocationService());
        fragmentTransaction.replace(R.id.isp_placeholder,new ISPInfo());
        fragmentTransaction.commit();

        // karan@gmail.com karan345
    }

    private void initDrawer() {
        drawerToggle = new ActionBarDrawerToggle(this, drawerLayout,R.string.drawer_open, R.string.drawer_close);
        drawerLayout.addDrawerListener(drawerToggle);
        drawerToggle.syncState();
        openDrawer.setOnClickListener(this);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if(drawerToggle.onOptionsItemSelected(item))
            return true;
        return super.onOptionsItemSelected(item);
    }

    @Override
    public void onClick(View view) {
        switch (view.getId()) {
            case R.id.btnWriteReview:
                startActivity(new Intent(HomeActivity.this, IspRatingsActivity.class));
                this.finish();
                break;

            case R.id.open_drawer:
                drawerLayout.openDrawer(Gravity.LEFT);
                break;
        }
    }

    @Override
    public boolean onNavigationItemSelected(@NonNull MenuItem item) {
        int id = item.getItemId();
        switch(id)
        {
            case R.id.drawer_update:
                startActivity(new Intent(HomeActivity.this, ViewReviewActivity.class));
                break;
            case R.id.drawer_logout:
                firebaseAuth.signOut();
                SaveSharedPreferences.clearUser(HomeActivity.this);
                startActivity(new Intent(HomeActivity.this, MainActivity.class));
                this.finish();
                break;
            case R.id.drawer_profile:
                profile = new Profile(currentUser,this);
                profile.showProfileDialog();
            default:
                return true;
        }
        return true;
    }

    @Override
    public void onBackPressed ()
    {
        if(profile!=null){
            profile.clearProfileDialog();
        }
        this.finishAffinity();
    }

}





