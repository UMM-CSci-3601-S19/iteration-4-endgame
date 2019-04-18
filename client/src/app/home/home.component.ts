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

  signIn() {
    console.log("Signing in!");
    auth2.signIn();
  }

  signOut() {
    console.log("Signing out!");
    auth2.signOut();
  }
}
