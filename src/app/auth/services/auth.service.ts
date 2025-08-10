import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { SessionService } from './sessionService';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser$: BehaviorSubject<any> = localStorage.getItem('token') ? new BehaviorSubject<any>(localStorage.getItem('token')) : new BehaviorSubject<any>(null);
  isHero = true;
  constructor(private http: HttpClient, private sessionService: SessionService) {
  }

  registerUser(body: any) {
    const _url = environment.apibaseurl + "/api/auth/local/register";

    return this.http.post(_url, body)
  }

  public isSignedIn() {
    return !!this.sessionService.accessToken;
  }
  login(email: string, password: string) {
    const _url = environment.apibaseurl + "/api/auth/local";

    const data = {
      identifier: email,
      password: password
    }

    return this.http.post(_url, data)
  }
  forgotPassword(email: string) {
    const _url = environment.apibaseurl + "/api/users-permissions/custom-forgot-password";
    const data = {
      email: email
    }

    return this.http.post(_url, data)
  }

  resetPassword(body: any) {
    const _url = environment.apibaseurl + "/api/auth/reset-password";

    return this.http.post(_url, body)
  }

  resendEmail(email: any) {
    const _url = environment.apibaseurl + "/api/auth/send-email-confirmation";
    const data = {
      email: email
    }

    return this.http.post(_url, data)

  }

  getCountries() {
    const _url = "https://countriesnow.space/api/v0.1/countries/capital";

    return this.http.get(_url)
  }

  getStates(country: any) {
    const data = {
      country: country
    }
    const _url = "https://countriesnow.space/api/v0.1/countries/states";

    return this.http.post(_url, data)

  }

  userInfo() {
    const _url = environment.apibaseurl + "/api/users/me";

    return this.http.get(_url)
  }
  updateUserInfo(data: any) {

    const _url = environment.apibaseurl + "/api/profile";

    return this.http.put(_url, data)
  }

  // GET USER CART DATA
  getCart(userId: any) {
    const _url = environment.apibaseurl + "/api/carts/getUserCart/" + userId;
    return this.http.get(_url)
  }

  public uploadImage(image: File): Observable<any> {
    let formData = new FormData();

    formData.append('profileImage', image);

    const _url = environment.apibaseurl + "/api/profile";
    return this.http.put(_url, formData);
  }

  changePassword(data: any) {
    const _url = environment.apibaseurl + "/api/change-password";
    return this.http.put(_url, data)
  }


  showHero(parm: any) {
    if (parm === '/') {
      this.isHero = true;
    } else {
      this.isHero = false;
    }
  }
}
