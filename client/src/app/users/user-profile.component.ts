import {Component, OnInit} from '@angular/core';
import {UserService} from './user-service';
import {User} from './user';
import {Observable} from 'rxjs/Observable';
import {MatDialog} from '@angular/material';
import {EditUserComponent} from "./edit-user.component";

@Component({
  selector: 'user-profile-component',
  templateUrl: 'user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})

export class UserProfileComponent implements OnInit {
  // These are public so that tests can reference them (.spec.ts)
  public users: User[];
  public filteredUsers: User[];

  // Inject the UserListService into this component.
  constructor(public userService: UserService, public dialog: MatDialog) {

  };

  public filterUsers(searchOid: string): User[] {

    this.filteredUsers = this.users;

    if (searchOid != null) {
      searchOid = searchOid.toLocaleLowerCase();

      this.filteredUsers = this.filteredUsers.filter(user => {
        return !searchOid || user._id.$oid.indexOf(searchOid) !== -1;
      });
    }

    return this.filteredUsers;
  }

  editUserReviewDialog(currentId: string, currentName: string, currentEmail: string, currentPhoneNumber: string, reviewScore: number, rating: string, numReviews: number): void {
    let newRating: number = parseInt(rating);
    console.log("Old Rating: " + reviewScore + "  Number of Reviews: " + numReviews + "  New Rating: " + newRating);
    if (reviewScore == null) {
      reviewScore = newRating;
    } else {
      reviewScore = reviewScore + newRating;
    }

    const currentUser: User = {
      _id: {
        $oid: currentId
      },
      name: currentName,
      email: currentEmail,
      phoneNumber: currentPhoneNumber,
      // Tests work when removing the s in the reviewScores changing this to reviewScore.  However, doing this causes the review system to break.
      reviewScores: reviewScore,
      numReviews: numReviews + 1 || 1
    };

    const dialogRef = this.dialog.open(EditUserComponent, {
      width: '500px',
      data: {user: currentUser}
    });

    dialogRef.afterClosed().subscribe(currentUser => {
      if (currentUser != null) {
        this.userService.editUser(currentUser).subscribe(
          result => {
            console.log("The result is " + result);
            this.refreshUsers();
          },
          err => {
            console.log('There was an error editing the ride.');
            console.log('The currentRide or dialogResult was ' + JSON.stringify(currentUser));
            console.log('The error was ' + JSON.stringify(err));
          });
      }
    });
  }

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
