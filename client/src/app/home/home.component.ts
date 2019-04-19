import {Component} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs/Observable";

//Declare pulls the variable from the html/js environment, so our gapi we declared in index gets pulled here.
declare let gapi: any;
//Gapi: The google api thing
//Auth2: Has to be initialized first (done in index.html), then contains a lot of useful things.
//gapi.auth2.getAuthInstance(). Type: gapi.auth2.GoogleAuth object. This is what is used to call most of the methods.
//authInstance.currentUser.get(). Type: GoogleUser. Gets all of the user's information as well as authenticating info.

//The google oauth biblé https://developers.google.com/identity/sign-in/web/reference

@Component({
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  public text: string;
  private user;

  constructor(private http: HttpClient) {
    this.text = 'MoRide';
  }

  checkUser(): Observable<Object> {
    let authInstance = gapi.auth2.getAuthInstance();
    let idtoken = authInstance.currentUser.get().getAuthResponse().id_token;
    console.log(idtoken);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: 'text' as 'json'
    };
    console.log(environment.API_URL + 'signin');
    return this.http.post<string>(environment.API_URL + 'signin', {idtoken: idtoken}, httpOptions);
  }

  signIn() {
    console.log("Signing in");
    let authInstance = gapi.auth2.getAuthInstance();
    authInstance.signIn();
  }

  signOut() {
    console.log("Signing out");
    let authInstance = gapi.auth2.getAuthInstance();
    authInstance.signOut();
  }
}
