package com.example.raternet_isp_app.fragments;

import android.app.Activity;
import android.app.Dialog;
import android.graphics.drawable.ColorDrawable;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.TextView;
import android.widget.Toast;

import com.example.raternet_isp_app.R;
import com.example.raternet_isp_app.auth_preferences.SaveSharedPreferences;
import com.example.raternet_isp_app.models.User;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

import androidx.annotation.NonNull;

public class Profile {
   private User user;
   private Activity activity;
   private TextView name,email,number,reviews;
   private Dialog dialog;

    public Profile(User user, Activity activity) {
        this.user = user;
        this.activity = activity;
    }

    public void showProfileDialog(){
        dialog = new Dialog(activity);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        dialog.setCancelable(false);
        dialog.setContentView(R.layout.activity_user_profile);
        dialog.getWindow().setLayout(WindowManager.LayoutParams.MATCH_PARENT,
                WindowManager.LayoutParams.WRAP_CONTENT);
        dialog.getWindow().setBackgroundDrawable(new ColorDrawable(android.graphics.Color.TRANSPARENT));

        name = (TextView)dialog.findViewById(R.id.yourname);
        email = dialog.findViewById(R.id.youremail);
        number = dialog.findViewById(R.id.yourPhoneNo);
        reviews = dialog.findViewById(R.id.yourReviews);
        TextView dismiss = dialog.findViewById(R.id.dismiss);
        dismiss.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                clearProfileDialog();
            }
        });

        name.setText(user.getUserName());
        email.setText(user.getEmailId());
        number.setText(user.getPhoneNumber());
        reviews.setText("Getting your Review Count");
        setReviewsCount();
        dialog.show();
    }
    public void setReviewsCount(){
        DatabaseReference  databaseReference = FirebaseDatabase.getInstance().getReference("Reviews");
        databaseReference.orderByChild("userEmail").equalTo(user.getEmailId()).addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                int count = (int) snapshot.getChildrenCount();
                SaveSharedPreferences.setReviewCount(activity.getApplicationContext(),count);
                reviews.setText(String.valueOf(count) + " Reviews Given");
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {
                Toast.makeText(activity.getApplicationContext(),error.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }
    public void clearProfileDialog(){
        dialog.dismiss();
    }
}
