import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent {

  public name:string='([a-zA-Z]+) ([a-zA-Z]+)'; 
  public emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";

  registerForm:FormGroup=this.formBuilder.group({
    name:['',[Validators.required,Validators.pattern(this.name),Validators.minLength(4)]],
    email:['',[Validators.required, Validators.pattern(this.emailPattern)]],
    password:['',[Validators.required, Validators.minLength(6)]]
  });

  constructor( private formBuilder:FormBuilder,
               private router:Router,
               private authServices:AuthService) { }

  registrar(){
    const{name,email,password}=this.registerForm.value;
    this.authServices.registro(name,email,password)
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
         console.log(ok);
      });
    //console.log(this.registerForm.value);
  }

  campoInvalido(campo:string){
    return this.registerForm.get(campo)?.invalid
              && this.registerForm.get(campo)?.touched;
   }

   get nameMsgError():string{
     const errors = this.registerForm.get('name')?.errors;
     if(errors?.['required']){
       return 'ingrese nombre de usuario'
     }else if(errors?.['pattern']){
       return 'Es en formato nombre y apellido'
     }
     return '';
   }

   get emailErrorMsg():string{
    const errors = this.registerForm.get('email')?.errors;
    if(errors?.['required']){
      return 'Por favor ingrese un correo electronico'
    }else if(errors?.['pattern']){
      return 'Por favor ingrese un coreo valido'
     }
    return '';
  }

}
