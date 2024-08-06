package com.example.raternet_isp_app.adapters;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.RatingBar;
import android.widget.TextView;

import com.example.raternet_isp_app.R;
import com.example.raternet_isp_app.models.ReviewDetails;

import java.util.List;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

public class  UserReviewAdapter extends RecyclerView.Adapter<UserReviewAdapter.UserReviewHolder> {

    private Context context;
    private List<ReviewDetails> userReviews;

    public UserReviewAdapter(Context context, List<ReviewDetails> userReviews) {
        this.context = context;
        this.userReviews = userReviews;
    }

    @NonNull
    @Override
    public UserReviewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.user_review,parent,false);
        return new UserReviewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull UserReviewHolder holder, int position) {
        ReviewDetails reviewDetails = userReviews.get(position);
        holder.ispName.setText(reviewDetails.getISP_Name());
        holder.useremail.setText(reviewDetails.getUserEmail());
        holder.feedback.setText(reviewDetails.getFeedback());
        holder.overallUserRating.setRating(Float.parseFloat(reviewDetails.getOverallRating()));
    }

    @Override
    public int getItemCount() {
        return userReviews.size();
    }

    public class UserReviewHolder extends RecyclerView.ViewHolder{
        TextView ispName,useremail,feedback;
        RatingBar overallUserRating;

        public UserReviewHolder(@NonNull View itemView) {
            super(itemView);
            ispName = itemView.findViewById(R.id.ispname);
            useremail = itemView.findViewById(R.id.useremail);
            overallUserRating = itemView.findViewById(R.id.overall);
            feedback = itemView.findViewById(R.id.feedback);
        }
    }
}
