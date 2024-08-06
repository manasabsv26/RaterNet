package com.example.raternet_isp_app.main;
import androidx.appcompat.app.AppCompatActivity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import com.example.raternet_isp_app.R;
import com.example.raternet_isp_app.auth.LoginActivity;
import com.example.raternet_isp_app.auth.RegisterActivity;
import com.example.raternet_isp_app.auth_preferences.SaveSharedPreferences;

public class MainActivity extends AppCompatActivity implements View.OnClickListener{

    public Button btnLogin;
    public Button btnRegister;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if(SaveSharedPreferences.getUser(MainActivity.this)!=null){
            startActivity(new Intent(MainActivity.this,HomeActivity.class));
            this.finish();
        }

        setContentView(R.layout.activity_main);
        btnLogin=findViewById(R.id.btnLogin);
        btnRegister=findViewById(R.id.btnRegister);
        btnLogin.setOnClickListener(this);
        btnRegister.setOnClickListener(this);
    }

    @Override
    public void onClick(View view)
    {
        switch (view.getId())
        {
            case R.id.btnLogin:
                startActivity(new Intent(MainActivity.this, LoginActivity.class));
                this.finish();
                break;
            case R.id.btnRegister:
                startActivity(new Intent(MainActivity.this, RegisterActivity.class));
                this.finish();
                break;
        }
    }

    @Override
    public void onBackPressed ()
    {
        this.finishAffinity();
    }
}