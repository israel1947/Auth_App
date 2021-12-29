import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent {

  loginForm:FormGroup=this.formBuilder.group({
    email:['',[Validators.required, Validators.email] ],
    password:['',[Validators.required,Validators.minLength(6)]]
  });

  constructor( private formBuilder:FormBuilder,
               private router:Router,
               private authServices:AuthService) { }


  login(){
    const{email,password}=this.loginForm.value;
    this.authServices.login(email,password)
    .subscribe(ok =>{
      if(ok===true){ 
      this.router.navigateByUrl('/dashboard');
       }else{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: ok,
        });
       }
    //console.log(ok);
    });
    //console.log(this.loginForm.value);
  }

}
