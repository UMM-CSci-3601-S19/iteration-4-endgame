import {Injectable, NgZone, OnInit} from "@angular/core";
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
export class AuthService implements CanActivate, OnInit{
  private http: HttpClient;
  private signedInFlag: boolean;

  constructor(private client: HttpClient, public router: Router) {
    this.http = client;
  }

  getUserName(): string {
    return gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getName();
  }

  getUserId(): string {
    return gapi.auth2.getAuthInstance().currentUser.get().getId();
  }

  getIdToken(): string {
    return gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
  }

  setRedirect(): string {
    return gapi.auth2.SigninOptionsBuilder().setRedirect();
  }

  signIn() {
    console.log("Signing in");
    console.log("gapi " + gapi.toString());
    console.log("gapi.auth2 " + gapi.auth2);
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

        this.http.post<string>(environment.API_URL + 'login', {idtoken: idtoken}, httpOptions)
          .subscribe((data) => {
            console.log(data);
          });
        this.signedInFlag = true;
      });
  }


  signOut() {
    console.log("Signing out");
    let authInstance = gapi.auth2.getAuthInstance();
    authInstance.signOut();
    this.signedInFlag = false;
  }

  isSignedIn(): boolean {
    return this.signedInFlag;
  }

  canActivate(): boolean {
    if (!this.isSignedIn()) {
      this.router.navigate(['']);
      return false;
    }
    return true;
  }

  loadClient() {
    console.log("gapi follows:");
    console.log(gapi);
    gapi.load('auth2', function() {
      gapi.auth2.init({
        'clientId': '375549452265-kpv6ds6lpfc0ibasgeqcgq1r6t6t6sth.apps.googleusercontent.com'
      });
    });
  }

  ngOnInit() {
    this.loadClient();
  }
}
