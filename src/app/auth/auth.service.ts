import { Injectable } from  '@angular/core';
import { HttpClient } from  '@angular/common/http';
import { tap } from  'rxjs/operators';
import { Observable, BehaviorSubject } from  'rxjs';

import { Storage } from  '@ionic/storage';
import { User } from  './user';
import { AuthResponse } from  './auth-response';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  server_url=  'http://157.230.107.10:5000';
  authSubject  =  new  BehaviorSubject(false);

  constructor(private  httpClient:  HttpClient, private  storage:  Storage) { }
  register(user: User): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(this.server_url + '/register', user).pipe(
      tap(async (res:  AuthResponse ) => {
        if (res) {
          console.log(res);
          await this.storage.set("ACCESS_TOKEN", res.api_key);
          this.authSubject.next(true);
          return res;
        }
      })

    );
  }

  login(user: User): Observable<AuthResponse> {
    return this.httpClient.post('http://157.230.107.10:5000/login', user).pipe(
      tap(async (res: AuthResponse) => {
        if (res.api_key) {
          console.log("User", res)
          await this.storage.set("ACCESS_TOKEN", res.api_key);
          this.authSubject.next(true);
          return res;
        }
      })
    );
  }

  login_api(user: AuthResponse): Observable<AuthResponse> {
    return this.httpClient.post('http:/157.230.107.10:5000/login', user).pipe(
      tap(async (res: AuthResponse) => {
        if (res.api_key) {
          this.authSubject.next(true);
          return res;
        }
      })
    );
  }
  async logout() {
    await this.storage.remove("api_key");
    this.authSubject.next(false);
  }

  isLoggedIn() {
    return localStorage.getItem('api_key');
  }
}
