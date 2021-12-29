import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of, tap, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { authResponse, Usuario } from '../interfaces/auth.interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private baseUrl:string=environment.baseUrl;
  private _usuario!:Usuario;

  get usuario(){
    return{...this._usuario};
  }

  constructor(private http:HttpClient,) { }


  //registra un nuevo usuario
  registro(name:string, email:string, password:string){
    const url=`${this.baseUrl}/auth/register`;
    const body={name,email,password};

    return this.http.post<authResponse>(url,body)
      .pipe(
        tap(resp =>{
          if(resp.ok){
            localStorage.setItem('token', resp.token!);//enviar el token al local storage
          }
        }),
        map(resp=>resp.ok),
        catchError(err=>of(err.error.msg) )
      )
  }
  

  //login de usuarios ya existentes en la DB
  login(email:string, password:string){
    const url=`${this.baseUrl}/auth`
    const body={email,password}

    return this.http.post<authResponse>(url,body)
      .pipe(
        tap(resp =>{
          if(resp.ok){
            localStorage.setItem('token', resp.token!);//enviar el token al local storage
          }
        }),
        map(resp=>resp.ok),//mustra  una de las respuestas definidas en la interface  ok(true o false)
        catchError(err => of(err.error.msg) )
      )
  }


  //validar el token de autenticacion del usuario a la hora de hacer login
  validarToken():Observable<boolean>{
    const url=`${this.baseUrl}/auth/renew`;
    const headers = new HttpHeaders()
      .set('x-api-key', localStorage.getItem('token') || '' );
    return this.http.get<authResponse>(url, {headers} )
       .pipe(
         map(resp=>{
          localStorage.setItem('token', resp.token!);
          this._usuario={
            uid:resp.uid!,
            name:resp.name!,
            email:resp.email!
          }
           return resp.ok
         }),
         catchError(err=>of(false) )
       )
    };


    //eliminar el token del usuario al cerrar la sesión
    logout(){
      localStorage.clear()
    }
}
