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
  rating;

  constructor(private route: ActivatedRoute, private userService: UserService, public dialog: MatDialog) {

  }

  //TODO: needs to work on recognizing the correct property for reviewScore or reviewScores as this is not being recognized even though the variables exists
  editUserReviewDialog(currentId: string, currentName: string, currentEmail: string, currentPhoneNumber: string, currentReviewScore: number, rating: string, numReviews: number): void {
    let newRating: number = parseInt(rating);
    console.log("Old Rating: " + currentReviewScore + "  Number of Reviews: " + numReviews + "  New Rating: " + newRating);
    if (currentReviewScore == null) {
      console.log("The new Rating " + newRating + " is the review Score " + currentReviewScore);
      currentReviewScore = newRating;
    } else {
      currentReviewScore = currentReviewScore + newRating;
    }

    const currentUser: User = {
      _id: {
        $oid: currentId
      },
      name: currentName,
      email: currentEmail,
      phoneNumber: currentPhoneNumber,
      // Tests work when removing the s in the currentReviewScore changing this to currentReviewScore.  However, doing this causes the review system to break.
      reviewScores: currentReviewScore,
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

  refreshUser(): void {
    // Get Users returns an Observable, basically a "promise" that
    // we will get the data from the server.
    //
    // Subscribe waits until the data is fully downloaded, then
    // performs an action on it (the first lambda)

    this.route.params.subscribe(params => {
      const userId = params['userId'];
      const user: Observable<User[]> = this.userService.getUsers(userId);
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

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const userId = params['userId'];
      this.userService
        .getUsers(userId)
        .subscribe(user => this.user = user);
    });
  }
}
