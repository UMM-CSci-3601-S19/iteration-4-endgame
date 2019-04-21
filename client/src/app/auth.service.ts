import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {environment} from "../environments/environment";
import {CanActivate, Router} from "@angular/router";

//Declare pulls the variable from the html/js environment, so our gapi we declared in index gets pulled here.
declare let gapi: any;
//Gapi: The google api thing
//Auth2: Has to be initialized first (done in index.html), then contains a lot of useful things.
//gapi.auth2.getAuthInstance(). Type: gapi.auth2.GoogleAuth object. This is what is used to call most of the methods.
//authInstance.currentUser.get(). Type: GoogleUser. Gets all of the user's information as well as authenticating info.

//The google oauth biblé https://developers.google.com/identity/sign-in/web/reference

@Injectable()
export class AuthService implements CanActivate {
  private http: HttpClient;
  private status: boolean;

  constructor(private client: HttpClient, public router: Router) {
    this.http = client;
  }

  static getUserId(): string{
    console.log("Getting user Id");
    console.log(gapi.auth2.getAuthInstance().currentUser.get().getId());
    return gapi.auth2.getAuthInstance().currentUser.get().getId();
  }

  checkUser() {
    let authInstance = gapi.auth2.getAuthInstance();
    let idtoken = authInstance.currentUser.get().getAuthResponse().id_token;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: 'text' as 'json'
    };    //If the user doesn't log in (ie closes the dialog box), we think they're logged in right now.

    this.http.post<string>(environment.API_URL + 'signin', {idtoken: idtoken}, httpOptions)
      .subscribe(data => {
        console.log("Data: " + data);
      });
  }

  signIn() {
    console.log("Signing in");
    let authInstance = gapi.auth2.getAuthInstance();
    authInstance.signIn()
      .then((data) => {
        let idtoken = data.getAuthResponse().id_token;
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          }),
          responseType: 'text' as 'json'
        };    //If the user doesn't log in (ie closes the dialog box), we think they're logged in right now.

        this.http.post<string>(environment.API_URL + 'signin', {idtoken: idtoken}, httpOptions)
          .subscribe((data) => {
            console.log(data);
          });
        this.status = true;
      });
  }

  signUp() {
    console.log("Signing up");
    let authInstance = gapi.auth2.getAuthInstance();
    authInstance.signIn()
      .then((data) => {
        let idtoken = data.getAuthResponse().id_token;
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          }),
          responseType: 'text' as 'json'
        };    //If the user doesn't log in (ie closes the dialog box), we think they're logged in right now.

        this.http.post<string>(environment.API_URL + 'signup', {idtoken: idtoken}, httpOptions)
          .subscribe((data) => {
            console.log(data);
          });
        this.status = true;
      });
  }

  signOut() {
    console.log("Signing out");
    let authInstance = gapi.auth2.getAuthInstance();
    authInstance.signOut();
    this.status = false;
  }

  isSignedIn(): boolean {
    return(this.status);
  }

  canActivate(): boolean {
    if (!this.status) {
      this.router.navigate(['']);
      return false;
    }
    return true;
  }
}
