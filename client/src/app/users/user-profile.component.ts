import {Component, OnInit} from '@angular/core';
import {UserService} from './user-service';
import {User} from './user';
import {Observable} from 'rxjs/Observable';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'user-profile-component',
  templateUrl: 'user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})

export class UserProfileComponent implements OnInit {
  // These are public so that tests can reference them (.spec.ts)
  public users: User[];
  public filteredUsers: User[];



  // Static references for displaying an example profile page
  public exampleUser: string;
  public exampleEmail: string;
  public exampleBio: string;
  public exampleMakeModel: string;
  public exampleYear: string;
  public exampleColor: string;
  public exampleNotes: string;

  // Inject the UserListService into this component.
  constructor(public userService: UserService, public dialog: MatDialog) {

    this.exampleUser = 'Albert Einstein';
    this.exampleEmail = 'Albert.Einstein@nointernet.yet';
    this.exampleBio = 'I am a German-born theoretical physicist who discovered the theory of relativity! Also I never learned how to drive!';
    this.exampleMakeModel = 'Pontiac Torpedo';
    this.exampleYear = '1940';
    this.exampleColor = 'Black';
    this.exampleNotes = 'Nearly 80 years old, but it\'s still brand new.';
  };

  refreshUsers(): Observable<User[]> {
    // Get Users returns an Observable, basically a "promise" that
    // we will get the data from the server.
    //
    // Subscribe waits until the data is fully downloaded, then
    // performs an action on it (the first lambda)

    const users: Observable<User[]> = this.userService.getUsers();
    users.subscribe(
      users => {
        this.users = users;
      },
      err => {
        console.log(err);
      });
    return users;
  }

  loadService(): void {
    this.userService.getUsers().subscribe(
      users => {
        this.users = users;
        this.filteredUsers = this.users;
      },
      err => {
        console.log(err);
      }
    );
  }

  ngOnInit(): void {
    this.refreshUsers();
    this.loadService();
  }
}
