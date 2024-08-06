package com.example.raternet_isp_app.adapters;

import android.content.Context;
import android.os.Build;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.RatingBar;
import android.widget.TextView;

import com.example.raternet_isp_app.R;
import com.example.raternet_isp_app.models.Company;
import com.squareup.picasso.Picasso;

import java.util.List;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.recyclerview.widget.RecyclerView;

public class CompanyAdapter extends RecyclerView.Adapter<CompanyAdapter.CompanyViewHolder> {
    private Context context;
    private List<Company> companyList;

    @RequiresApi(api = Build.VERSION_CODES.N)
    public CompanyAdapter(Context context, List<Company> companyList) {
            this.context = context;
            this.companyList = companyList;
    }

    @NonNull
    @Override
    public CompanyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.company,parent,false);
            return new CompanyViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull CompanyViewHolder holder, int position) {
            Company company = companyList.get(position);
            holder.companyName.setText(company.getName());
            String line = company.getNoofUsers().equals("1")
                    ?" User in your Area":" Users in your Area";
            holder.noofUsers.setText(company.getNoofUsers() + line);
            holder.overallCompanyRating.setRating(Float.parseFloat(company.getAvgRating().toString()));
            String imageUrl = company.getPhotoUrl();
            final float scale = context.getResources().getDisplayMetrics().density;
            int Width  = (int) (120 * scale);
            int Height = (int) (120 * scale);
            Picasso.with(context).load(imageUrl).resize(Width,Height).into(holder.companyImage);
    }

    @Override
    public int getItemCount() {
            return companyList.size();
    }

    public class CompanyViewHolder extends RecyclerView.ViewHolder{
        TextView companyName,noofUsers;
        RatingBar overallCompanyRating;
        ImageView companyImage;

        public CompanyViewHolder(@NonNull View itemView) {
            super(itemView);
            companyName = itemView.findViewById(R.id.companyName);
            companyImage = itemView.findViewById(R.id.companyImage);
            overallCompanyRating = itemView.findViewById(R.id.overallCompany);
            noofUsers = itemView.findViewById(R.id.noofUsers);
        }
    }
}
