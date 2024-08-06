package com.example.raternet_isp_app.ratings;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.app.ProgressDialog;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.RatingBar;
import android.widget.TextView;
import android.widget.Toast;

import com.basgeekball.awesomevalidation.AwesomeValidation;
import com.basgeekball.awesomevalidation.ValidationStyle;
import com.basgeekball.awesomevalidation.utility.RegexTemplate;
import com.example.raternet_isp_app.main.HomeActivity;
import com.example.raternet_isp_app.R;
import com.example.raternet_isp_app.auth_preferences.SaveSharedPreferences;
import com.example.raternet_isp_app.models.Constants;
import com.example.raternet_isp_app.models.ReviewDetails;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;


public class IspRatingsActivity extends AppCompatActivity {

    public FirebaseAuth auth;
    public DatabaseReference databaseReference;
    //Insert Review
    public RadioGroup RdoGrpType;
    public RadioButton RdoBtnType;
    public Button btnSubmitReview;
    public EditText txtFeedback;
    public TextView headerText;
    public RatingBar RbPrice;
    public RatingBar RbService;
    public RatingBar RbSpeed;
    public RatingBar RbOverall;
    private ProgressDialog progressDialog;

    //Update Review
    public ReviewDetails curReview;

    //General Required Variables
    public boolean typeFlag=false;
    public boolean priceRatingFlag=false;
    public boolean serviceRatingFlag=false;
    public boolean speedRatingFlag=false;
    public boolean overallRatingFlag=false;

    private AwesomeValidation awesomeValidation;

    @Override
    protected void onCreate(Bundle savedInstanceState) 
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_isp_ratings);
        Intent intent=getIntent();
        btnSubmitReview=findViewById(R.id.btnSubmitReview);
        txtFeedback=findViewById(R.id.txtFeedback);
        auth= FirebaseAuth.getInstance();
        awesomeValidation=new AwesomeValidation(ValidationStyle.BASIC);
        awesomeValidation.addValidation(this,R.id.txtFeedback, RegexTemplate.NOT_EMPTY,R.string.feedback_error);
        RdoGrpType=findViewById(R.id.RdoGrpType);
        RbPrice=findViewById(R.id.RbPrice);
        RbService=findViewById(R.id.RbService);
        RbSpeed=findViewById(R.id.RbSpeed);
        RbOverall=findViewById(R.id.RbOverall);
        headerText = findViewById(R.id.txtViewHeader);
        headerText.setText("Give Ratings");

        if(intent.hasExtra("CurrentReview"))
        {
            this.curReview=(ReviewDetails)intent.getSerializableExtra("CurrentReview");
            headerText.setText("Update Ratings");

            RdoGrpType=findViewById(R.id.RdoGrpType);
            RdoGrpType.setVisibility(View.INVISIBLE);

            priceRatingFlag=true;
            serviceRatingFlag=true;
            speedRatingFlag=true;
            overallRatingFlag=true;

            RbPrice.setRating(Float.parseFloat(curReview.getPriceRating()));
            RbSpeed.setRating(Float.parseFloat(curReview.getSpeedRating()));
            RbService.setRating(Float.parseFloat(curReview.getServiceRating()));
            RbOverall.setRating(Float.parseFloat(curReview.getOverallRating()));

            txtFeedback.setText(curReview.getFeedback());
        }

        RbPrice.setOnRatingBarChangeListener(new RatingBar.OnRatingBarChangeListener() {
            @Override
            public void onRatingChanged(RatingBar ratingBar, float rating, boolean b)
            {
                priceRatingFlag=true;
                Constants.priceRating=String.valueOf(rating);
                Toast.makeText(IspRatingsActivity.this, rating+" Stars for Price.", Toast.LENGTH_SHORT).show();
            }
        });

        RbService.setOnRatingBarChangeListener(new RatingBar.OnRatingBarChangeListener() {
            @Override
            public void onRatingChanged(RatingBar ratingBar, float rating, boolean b)
            {
                serviceRatingFlag=true;
                Constants.serviceRating=String.valueOf(rating);
                Toast.makeText(IspRatingsActivity.this, rating+" Stars for Service.", Toast.LENGTH_SHORT).show();
            }
        });

        RbSpeed.setOnRatingBarChangeListener(new RatingBar.OnRatingBarChangeListener() {
            @Override
            public void onRatingChanged(RatingBar ratingBar, float rating, boolean b)
            {
                speedRatingFlag=true;
                Constants.speedRating=String.valueOf(rating);
                Toast.makeText(IspRatingsActivity.this, rating+" Stars for Speed.", Toast.LENGTH_SHORT).show();
            }
        });

        RbOverall.setOnRatingBarChangeListener(new RatingBar.OnRatingBarChangeListener() {
            @Override
            public void onRatingChanged(RatingBar ratingBar, float rating, boolean b)
            {
                overallRatingFlag=true;
                Constants.overallRating=String.valueOf(rating);
                Toast.makeText(IspRatingsActivity.this, rating+" Stars Overall.", Toast.LENGTH_SHORT).show();
            }
        });

        btnSubmitReview.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view)
            {
                //Setting Feedback
                Constants.feedback=txtFeedback.getText().toString().trim();

                //Setting Date
                Date date=new Date();
                SimpleDateFormat curDate=new SimpleDateFormat("dd/MM/yyyy");
                String getDate=curDate.format(date);
                Constants.reviewDate=getDate;

                boolean validateFeedback=awesomeValidation.validate();

                if(validateFeedback)
                {
                    if(typeFlag || curReview!=null)
                    {
                        if(priceRatingFlag && speedRatingFlag && serviceRatingFlag && overallRatingFlag)
                        {
                            //Enabled ProgressDialog
                            progressDialog = new ProgressDialog(IspRatingsActivity.this);
                            progressDialog.setMessage("Submitting your Feedback...");
                            progressDialog.show();

                            //Enter Review here
                            final String ISP_Name = Constants.ISP_Name;
                            final String MAP_Latitude = Constants.MAP_Latitude;
                            final String MAP_Longitude = Constants.MAP_Longitude;
                            final String city = Constants.city;
                            final String locality = Constants.locality;
                            final String UserEmail = Constants.UserEmail;
                            final String reviewDate=Constants.reviewDate;
                            final String type = Constants.type;
                            final String priceRating = Constants.priceRating;
                            final String speedRating = Constants.speedRating;
                            final String serviceRating = Constants.serviceRating;
                            final String overallRating = Constants.overallRating;
                            final String feedback = Constants.feedback;

                            if(curReview==null){
                                //Adding Review
                                final ReviewDetails review=new ReviewDetails(ISP_Name,
                                        MAP_Latitude,
                                        MAP_Longitude,
                                        city,locality,
                                        UserEmail,
                                        type,speedRating,priceRating,serviceRating,overallRating,feedback,reviewDate);

                                databaseReference = FirebaseDatabase.getInstance().getReference("Reviews");
                                        databaseReference.push().setValue(review).addOnCompleteListener(new OnCompleteListener<Void>() {
                                    @Override
                                    public void onComplete(@NonNull Task<Void> task) {
                                        if(task.isSuccessful())
                                        {
                                            //Disable ProgressDialog
                                            progressDialog.dismiss();
                                            Toast.makeText(IspRatingsActivity.this, "Successfully Added Review",
                                                    Toast.LENGTH_SHORT).show();
                                            //startActivity(new Intent(IspRatingsActivity.this,MainActivity2.class));
                                            finish();
                                        }
                                        else
                                        {
                                            progressDialog.dismiss();
                                            Toast.makeText(IspRatingsActivity.this, "Adding Review Failed!", Toast.LENGTH_SHORT).show();
                                        }
                                    }
                                });
                                databaseReference.orderByChild("userEmail").equalTo(UserEmail).addValueEventListener(new ValueEventListener() {
                                    @Override
                                    public void onDataChange(@NonNull DataSnapshot snapshot) {
                                        int count = (int) snapshot.getChildrenCount();
                                        SaveSharedPreferences.setReviewCount(IspRatingsActivity.this,count);
                                    }

                                    @Override
                                    public void onCancelled(@NonNull DatabaseError error) {
                                        Toast.makeText(IspRatingsActivity.this,error.getMessage(), Toast.LENGTH_SHORT).show();
                                    }
                                });

                            } else {

                                //Updating Review
                                Map<String,Object>map=new HashMap<>();

                                map.put("feedback",Constants.feedback);
                                map.put("reviewDate",Constants.reviewDate);
                                map.put("priceRating",Constants.priceRating);
                                map.put("speedRating",Constants.speedRating);
                                map.put("serviceRating",Constants.serviceRating);
                                map.put("overallRating",Constants.overallRating);

                                FirebaseDatabase.getInstance().getReference().child("Reviews")
                                        .child(Constants.reviewKey).updateChildren(map).addOnCompleteListener(new OnCompleteListener<Void>() {
                                    @Override
                                    public void onComplete(@NonNull Task<Void> task)
                                    {
                                        if(task.isSuccessful())
                                        {
                                            //Disable ProgressDialog
                                            progressDialog.dismiss();
                                            Toast.makeText(IspRatingsActivity.this, "Successfully Updated Review", Toast.LENGTH_SHORT).show();
                                            startActivity(new Intent(IspRatingsActivity.this, HomeActivity.class));
                                            finish();
                                        }
                                        else
                                        {
                                            //Disable ProgressDialog
                                            progressDialog.dismiss();
                                            Toast.makeText(IspRatingsActivity.this, "Failed to Update Review", Toast.LENGTH_SHORT).show();
                                            startActivity(new Intent(IspRatingsActivity.this,HomeActivity.class));
                                            finish();
                                        }
                                    }
                                });
                            }
                        }
                        else {
                            Toast.makeText(IspRatingsActivity.this, "Please Provide all Ratings!", Toast.LENGTH_SHORT).show();
                        }
                    }
                    else {
                        Toast.makeText(IspRatingsActivity.this, "Please Select Type of Connection!", Toast.LENGTH_SHORT).show();
                    }
                }
                else {
                    Toast.makeText(IspRatingsActivity.this, "Please Provide Feedback!", Toast.LENGTH_SHORT).show();
                }
            }
        });
    }

    public void checkType(View v)
    {
        int radioId=RdoGrpType.getCheckedRadioButtonId();
        RdoBtnType=findViewById(radioId);
        Constants.type=RdoBtnType.getText().toString().trim();
        typeFlag=true;
        Toast.makeText(this, "Selected "+RdoBtnType.getText(), Toast.LENGTH_SHORT).show();
    }

    @Override
    public void onBackPressed ()
    {
        startActivity(new Intent(IspRatingsActivity.this,HomeActivity.class));
        this.finish();
    }
}