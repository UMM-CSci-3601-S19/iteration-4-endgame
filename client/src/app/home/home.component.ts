import {Component} from '@angular/core';

//Declare pulls the variable from the html/js environment, so our gapi we declared in index gets pulled here.
declare let auth2: any;

@Component({
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  public text: string;

  constructor() {
    this.text = 'MoRide';
  }

  onSignIn() {
    console.log("We did it!");
  }
  signIn() {
    console.log("Signing in!");
    let user = auth2.signIn();
    console.log(user.getAuthResponse().id_token);
  }

  signOut() {
    console.log("Signing out!");
    auth2.signOut();
  }
}
