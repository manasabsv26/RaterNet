package com.example.raternet_isp_app.adapters;

import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.cardview.widget.CardView;
import androidx.recyclerview.widget.RecyclerView;

import com.example.raternet_isp_app.models.Constants;
import com.example.raternet_isp_app.ratings.IspRatingsActivity;
import com.example.raternet_isp_app.R;
import com.example.raternet_isp_app.models.ReviewDetails;
import com.firebase.ui.database.FirebaseRecyclerAdapter;
import com.firebase.ui.database.FirebaseRecyclerOptions;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.database.FirebaseDatabase;

public class ReviewViewAdapter extends FirebaseRecyclerAdapter<ReviewDetails,ReviewViewAdapter.ViewHolder>
{
    /**
     * Initialize a {@link RecyclerView.Adapter} that listens to a Firebase query. See
     * {@link FirebaseRecyclerOptions} for configuration options.
     *
     * @param options
     */

    private Context context;

    public ReviewViewAdapter(@NonNull FirebaseRecyclerOptions<ReviewDetails> options,Context context)
    {
        super(options);
        this.context=context;
    }

    @Override
    protected void onBindViewHolder(@NonNull ViewHolder holder, final int position, @NonNull final ReviewDetails model) {
        holder.ispName.setText(model.getISP_Name());
        holder.typeName.setText(model.getType());
        holder.dateName.setText(model.getReviewDate());

        final ReviewDetails curReview = model;

        holder.parent.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(context, IspRatingsActivity.class);
                intent.putExtra("CurrentReview", curReview);
                //Setting Position
                Constants.reviewPosition = position;
                //Setting Key
                Constants.reviewKey = getRef(position).getKey();
                view.getContext().startActivity(intent);
            }
        });

        holder.deleteReview.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                FirebaseDatabase.getInstance().getReference()
                        .child("Reviews").child(getRef(position).getKey()).removeValue().addOnCompleteListener(new OnCompleteListener<Void>() {
                    @Override
                    public void onComplete(@NonNull Task<Void> task) {
                        if (task.isSuccessful()) {
                            Toast.makeText(context, "Successfully Deleted Review", Toast.LENGTH_SHORT);
                        } else {
                            Toast.makeText(context, task.getException().getMessage(), Toast.LENGTH_SHORT);
                        }
                    }
                });
            }
        });
    }

            @NonNull
            @Override
            public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
                View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.single_review, parent, false);
                return new ViewHolder(view);
            }

            class ViewHolder extends RecyclerView.ViewHolder {
                TextView ispName;
                TextView typeName;
                TextView dateName;
                ImageButton deleteReview;
                CardView parent;

                public ViewHolder(@NonNull View itemView) {
                    super(itemView);

                    ispName = (TextView) itemView.findViewById(R.id.ispText);
                    typeName = (TextView) itemView.findViewById(R.id.typeText);
                    dateName = (TextView) itemView.findViewById(R.id.dateText);
                    deleteReview = itemView.findViewById(R.id.deleteReview);
                    parent = (CardView) itemView.findViewById(R.id.parent);
                }
            }
        }


