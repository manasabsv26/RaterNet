package com.example.raternet_isp_app.auth;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.MediaStore;
import android.util.Patterns;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.basgeekball.awesomevalidation.AwesomeValidation;
import com.basgeekball.awesomevalidation.ValidationStyle;
import com.basgeekball.awesomevalidation.utility.RegexTemplate;
import com.example.raternet_isp_app.main.MainActivity;
import com.example.raternet_isp_app.R;
import com.example.raternet_isp_app.models.User;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.storage.FirebaseStorage;

import java.io.ByteArrayOutputStream;

public class RegisterActivity extends AppCompatActivity implements View.OnClickListener {

    public EditText edtRegEmailId;
    public EditText edtRegName;
    public EditText edtRegPass;
    public EditText edtRegVerifyPass;
    public EditText edtRegPhoneNumber;
    public Button btnReg,setProfilePic;
    public ImageView imageView;
    public TextView txtRegAlreadyUser;
    public ProgressDialog progressDialog;
    private User user;
    public AlertDialog.Builder dialogBuilder;
    private Uri mImageUri = null;
    private static final int CAMERA_REQUEST_CODE=1;
    private static final int OPEN_GALLERY_CODE=2;
    private FirebaseAuth auth;
    private FirebaseStorage firebaseStorage;
    private AwesomeValidation awesomeValidation;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);

        edtRegEmailId=findViewById(R.id.edtRegEmailId);
        edtRegName=findViewById(R.id.edtRegName);
        edtRegPass=findViewById(R.id.edtRegPass);
        edtRegVerifyPass=findViewById(R.id.edtRegVerifyPass);
        edtRegPhoneNumber=findViewById(R.id.edtRegPhoneNumber);

        btnReg=findViewById(R.id.btnReg);
        txtRegAlreadyUser=findViewById(R.id.txtRegAlreadyUser);
        imageView = findViewById(R.id.ProfilePic);
        //setProfilePic = findViewById(R.id.setProfilePic);

        auth=FirebaseAuth.getInstance();
        firebaseStorage = FirebaseStorage.getInstance();

        awesomeValidation=new AwesomeValidation(ValidationStyle.BASIC);

        awesomeValidation.addValidation(this, R.id.edtRegEmailId, Patterns.EMAIL_ADDRESS, R.string.emailerror);
        awesomeValidation.addValidation(this,R.id.edtRegName, RegexTemplate.NOT_EMPTY,R.string.namerror);
        awesomeValidation.addValidation(this,R.id.edtRegPass,RegexTemplate.NOT_EMPTY,R.string.passerror);
        awesomeValidation.addValidation(this,R.id.edtRegVerifyPass,RegexTemplate.NOT_EMPTY,R.string.passerror);

        progressDialog = new ProgressDialog(RegisterActivity.this);
        progressDialog.setMessage("Creating an account...");

        btnReg.setOnClickListener(this);
        txtRegAlreadyUser.setOnClickListener(this);
        imageView.setOnClickListener(this);
    }

    @Override
    public void onClick(View view) {
        switch (view.getId())
        {
            case R.id.btnReg:
                boolean validated=awesomeValidation.validate();
                if(validated)//Checked empty fields and email address
                {
                    boolean checker=checkPassMatch();
                    if(checker)//checked matching of passwords
                    {
                        boolean passLen=checkPassLength();
                        if(passLen)//check length of pass (must be >6)
                        {

                            final String email=edtRegEmailId.getText().toString().trim();
                            final String name=edtRegName.getText().toString().trim();
                            final String phNumber=edtRegPhoneNumber.getText().toString().trim();
                            String pass=edtRegPass.getText().toString().trim();

                            progressDialog.show();

                            auth.createUserWithEmailAndPassword(email,pass)
                                    .addOnCompleteListener(new OnCompleteListener<AuthResult>() {
                                        @Override
                                        public void onComplete(@NonNull Task<AuthResult> task) {
                                            if(task.isSuccessful())
                                            {
                                                if(mImageUri==null)
                                                    user=new User(email,name,phNumber);
                                                else
                                                    user = new User(email,name,mImageUri.toString(),phNumber);

                                                FirebaseDatabase.getInstance().getReference("Users")
                                                        .child(FirebaseAuth.getInstance().getCurrentUser().getUid())
                                                        .setValue(user).addOnCompleteListener(new OnCompleteListener<Void>() {
                                                    @Override
                                                    public void onComplete(@NonNull Task<Void> task) {
                                                        if(task.isSuccessful())
                                                        {
                                                            progressDialog.dismiss();
                                                            Toast.makeText(RegisterActivity.this, "Registration Successful!", Toast.LENGTH_SHORT).show();
                                                            startActivity(new Intent(RegisterActivity.this,LoginActivity.class));
                                                            finish();
                                                        }
                                                        else
                                                        {
                                                            progressDialog.dismiss();
                                                            Toast.makeText(RegisterActivity.this, "Registration Failed", Toast.LENGTH_SHORT).show();
                                                        }
                                                    }
                                                });
                                            }
                                            else
                                            {
                                                progressDialog.dismiss();
                                                Toast.makeText(RegisterActivity.this, "Registration Failed", Toast.LENGTH_SHORT).show();
                                            }
                                        }
                                    });
                        }
                        else
                        {
                            Toast.makeText(this, "Enter a Password more than 6 characters", Toast.LENGTH_SHORT).show();
                        }
                    }
                    else
                    {
                        Toast.makeText(this, "Passwords Don't Match", Toast.LENGTH_SHORT).show();
                    }
                }
                else
                {
                    Toast.makeText(this, "Unsuccessful Registration", Toast.LENGTH_SHORT).show();
                }
                break;

            case R.id.txtRegAlreadyUser:
                Toast.makeText(this, "Redirecting to Login Page", Toast.LENGTH_SHORT).show();
                startActivity(new Intent(RegisterActivity.this,LoginActivity.class));
                this.finish();
                break;

            case R.id.ProfilePic:
                dialogBuilder = new AlertDialog.Builder(this);
                dialogBuilder.setTitle("Choose option");
                dialogBuilder.setPositiveButton("Capture", new DialogInterface.OnClickListener(){
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        if(hasCamera()){
                            Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                            if(intent.resolveActivity(getPackageManager())!=null){
                                startActivityForResult(intent,CAMERA_REQUEST_CODE); // start camera on tapping on imageview
                            }
                        }
                    }
                });
                dialogBuilder.setNegativeButton("Choose", new DialogInterface.OnClickListener(){
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        Intent intent = new Intent();
                        intent.setType("image/*");
                        intent.setAction(Intent.ACTION_GET_CONTENT);
                        startActivityForResult(Intent.createChooser(intent,
                                "Select Picture"),OPEN_GALLERY_CODE);
                    }
                });
                AlertDialog dialog = dialogBuilder.create();
                dialog.show();
                break;
        }
    }

    private boolean hasCamera(){
        return getPackageManager().hasSystemFeature(PackageManager.FEATURE_CAMERA_ANY);
    }

    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if(requestCode==CAMERA_REQUEST_CODE && resultCode==RESULT_OK) {
            Bitmap bitmap = (Bitmap) data.getExtras().get("data");
            ByteArrayOutputStream bytes = new ByteArrayOutputStream();
            bitmap.compress(Bitmap.CompressFormat.JPEG, 100, bytes);
            imageView.setImageBitmap(bitmap);
            /*String path = MediaStore.Images.Media.insertImage(getApplicationContext().getContentResolver(),
                    bitmap, "Title", null);
            mImageUri = Uri.parse(path);
            imageView.setImageURI(mImageUri);*/ // crashing app

        }
        else {
            mImageUri = data.getData();
            final int takeFlags = data.getFlags()
                    & (Intent.FLAG_GRANT_READ_URI_PERMISSION
                    | Intent.FLAG_GRANT_WRITE_URI_PERMISSION);

            try {
                this.getContentResolver().takePersistableUriPermission(mImageUri, takeFlags);
            } catch (SecurityException e) {
                e.printStackTrace();
            }
            imageView.setImageURI(mImageUri);// set captured image in imageView
        }
    }
    //dhoni11

    private boolean checkPassLength()
    {
        String pass=edtRegPass.getText().toString().trim();
        if(pass.length()<6) {
            return false;
        }
        return true;
    }

    private boolean checkPassMatch()
    {
        String pass=edtRegPass.getText().toString().trim();
        String verifyPass=edtRegVerifyPass.getText().toString().trim();

        if(pass.equals(verifyPass))
        {
            return true;
        }
        return false;
    }

    @Override
    public void onBackPressed ()
    {
        startActivity(new Intent(RegisterActivity.this, MainActivity.class));
        this.finish();
    }
}