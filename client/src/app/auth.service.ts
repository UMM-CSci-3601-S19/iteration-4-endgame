import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {environment} from "../environments/environment";
import {CanActivate, Router} from "@angular/router";
import {User} from "./users/user";

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
  private accountFlag: boolean;

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
    };
    this.accountFlag = true;
    this.http.post<string>(environment.API_URL + 'signin', {idtoken: idtoken}, httpOptions)
      .subscribe(data => {
        console.log("Data: " + data);
        localStorage.setItem("test", "Does this work");
        localStorage.setItem("userId", data["userId"]);
        localStorage.setItem("name", data["name"]);
        console.log(localStorage.getItem("userId"));
        console.log(localStorage.getItem("name"));
        console.log(localStorage.getItem("test"));
      });
  }

  signIn() {
    console.log("Signing in");
    let authInstance = gapi.auth2.getAuthInstance();
    authInstance.signIn();
    //If the user doesn't log in (ie closes the dialog box), we think they're logged in right now.
    this.status = true;
    this.accountFlag = false;
  }

  signOut() {
    console.log("Signing out");
    let authInstance = gapi.auth2.getAuthInstance();
    authInstance.signOut();
    this.status = false;
    this.accountFlag = false;
  }

  isSignedIn(): boolean {
    return(this.status && this.accountFlag);
  }

  canActivate(): boolean {
    if (!this.status) {
      this.router.navigate(['']);
      return false;
    }
    return true;
  }

  // getLoggedUser(): Observable<User> {
  //   let authInstance = gapi.auth2.getAuthInstance();
  //   let idtoken = authInstance.currentUser.get().getAuthResponse().id_token;
  //   let loggedUser;
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json'
  //     }),
  //     responseType: 'text' as 'json'
  //   };
  //   loggedUser = this.http.post<string>(environment.API_URL + "loggedIn",{idtoken: idtoken}, httpOptions);
  //   console.log("loggedUser: " + JSON.stringify(loggedUser));
  //   return loggedUser;
  // }
}
