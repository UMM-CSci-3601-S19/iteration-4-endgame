import {Component, OnInit} from '@angular/core';
import {UserService} from './user-service';
import {User} from './user';
import {Observable} from 'rxjs/Observable';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {EditUserComponent} from "./edit-user.component";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'user-profile-component',
  templateUrl: 'user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})

export class UserProfileComponent implements OnInit {

  //user/*: User[]*/;
  user: User;
  rating;

  public selected: string;

  // Inject the UserListService into this component.
  constructor(private route: ActivatedRoute, public userService: UserService, public dialog: MatDialog) {

  }

  // public filterUsers(searchOid: string): User[] {
  //
  //   this.filteredUsers = this.users;
  //
  //   if (searchOid != null) {
  //     searchOid = searchOid.toLocaleLowerCase();
  //
  //     this.filteredUsers = this.filteredUsers.filter(user => {
  //       return !searchOid || user._id.$oid.indexOf(searchOid) !== -1;
  //     });
  //   }
  //
  //   return this.filteredUsers;
  // }

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
      // Tests work when removing the s in the reviewScore changing this to reviewScore.  However, doing this causes the review system to break.
      reviewScores: reviewScore,
      numReviews: numReviews + 1 || 1
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {user: currentUser};
    dialogConfig.width = '500px';

    const dialogRef = this.dialog.open(EditUserComponent, dialogConfig);

    console.log("Dialog Ref " + dialogRef.toString());
    dialogRef.afterClosed().subscribe(currentUser => {
      if (currentUser != null) {
        this.userService.editUser(currentUser).subscribe(
          result => {
            console.log("The result is " + result);
            this.ngOnInit();
          },
          err => {
            console.log('There was an error editing the ride.');
            console.log('The currentRide or dialogResult was ' + JSON.stringify(currentUser));
            console.log('The error was ' + JSON.stringify(err));
          });
      }
    });
  }

  refreshUser(): void/*Observable<User[]>*/ {
    // Get Users returns an Observable, basically a "promise" that
    // we will get the data from the server.
    //
    // Subscribe waits until the data is fully downloaded, then
    // performs an action on it (the first lambda)

    this.route.params.subscribe(params => {
      const userId = params['userId'];
      const user: Observable<User> = this.userService.getUserById(userId);
      user.subscribe(
        user => {
          this.user = user;
        },
        err => {
          console.log(err);
        });
      return user;
    });
  }

  // loadService(): void {
  //   this.userService.getUsers().subscribe(
  //     users => {
  //       this.users = users;
  //       this.filteredUsers = this.users;
  //     },
  //     err => {
  //       console.log(err);
  //     }
  //   );
  // }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const userId = params['userId'];
      this.userService
        .getUserById(userId)
        .subscribe(user => this.user = user);
    });
  }
}
