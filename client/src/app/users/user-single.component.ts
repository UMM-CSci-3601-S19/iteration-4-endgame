import {ActivatedRoute} from '@angular/router';
import {Component, OnInit} from "@angular/core";
import {UserService} from "./user-service";
import {MatDialog, MatDialogConfig} from "@angular/material";
import {User} from "./user";
import {EditUserComponent} from "./edit-user.component";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'user-single-component',
  templateUrl: 'user-single.component.html',
})

export class UserSingleComponent implements OnInit {

  user;

  constructor(private route: ActivatedRoute, private userService: UserService, public dialog: MatDialog) {

  }

  //TODO: needs to work for an individual file, as of right now it will pull an individual user, but can't interact or update it
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

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {user: currentUser};
    dialogConfig.width = '500px';

    const dialogRef = this.dialog.open(EditUserComponent, dialogConfig);

    console.log("Dialog Ref " + dialogRef);
    dialogRef.afterClosed().subscribe(currentUser => {
      if (currentUser != null) {
        this.userService.editUser(currentUser).subscribe(
          result => {
            console.log("The result is " + result);
            this.refreshUser();
          },
          err => {
            console.log('There was an error editing the ride.');
            console.log('The currentRide or dialogResult was ' + JSON.stringify(currentUser));
            console.log('The error was ' + JSON.stringify(err));
          });
      }
    });
  }

  refreshUser(): Observable<User[]> {
    // Get Users returns an Observable, basically a "promise" that
    // we will get the data from the server.
    //
    // Subscribe waits until the data is fully downloaded, then
    // performs an action on it (the first lambda)

    const user: Observable<User[]> = this.userService.getUsers();
    user.subscribe(
      user => {
        this.user = user;
      },
      err => {
        console.log(err);
      });
    return user;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const userId = params['userId'];
      this.userService
        .getUsers(userId)
        .subscribe(user => this.user = user);
    });
  }
}
