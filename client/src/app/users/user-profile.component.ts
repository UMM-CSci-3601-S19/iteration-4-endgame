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
  styleUrls: ['./user-profile.component.css']
})

export class UserProfileComponent implements OnInit {

  user: User;

  // Inject the UserListService into this component.
  constructor(private route: ActivatedRoute, public userService: UserService, public dialog: MatDialog) {

  }

  editUserDialog(currentId: string, currentName: string, currentBio: string,currentPhoneNumber: string,
                 currentEmail: string, currentTotalReviewScore: number, currentNumReviews: number): void {
    const currentInfo: User = {
      _id: {
        $oid: currentId
      },
      name: currentName,
      bio: currentBio,
      phoneNumber: currentPhoneNumber,
      email: currentEmail,
      totalReviewScore: currentTotalReviewScore,
      numReviews: currentNumReviews
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {user: currentInfo};
    dialogConfig.width = '500px';

    const dialogRef = this.dialog.open(EditUserComponent, dialogConfig);

    console.log("Dialog Ref " + dialogRef.toString());
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

  // editUserReviewDialog(currentId: string, currentName: string, currentBio: string, currentEmail: string, currentPhoneNumber: string, reviewScore: number, rating: string, numReviews: number): void {
  //   let newRating: number = parseInt(rating);
  //   console.log("Old Rating: " + reviewScore + "  Number of Reviews: " + numReviews + "  New Rating: " + newRating);
  //   if (reviewScore == null) {
  //     reviewScore = newRating;
  //   } else {
  //     reviewScore = reviewScore + newRating;
  //   }
  //
  //   const currentUser: User = {
  //     _id: {
  //       $oid: currentId
  //     },
  //     name: currentName,
  //     bio: currentBio,
  //     email: currentEmail,
  //     phoneNumber: currentPhoneNumber,
  //     // Tests work when removing the s in the reviewScore changing this to reviewScore.  However, doing this causes the review system to break.
  //     reviewScores: reviewScore,
  //     numReviews: numReviews + 1 || 1
  //   };
  //
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.data = {user: currentUser};
  //   dialogConfig.width = '500px';
  //
  //   const dialogRef = this.dialog.open(EditUserComponent, dialogConfig);
  //
  //   console.log("Dialog Ref " + dialogRef.toString());
  //   dialogRef.afterClosed().subscribe(currentUser => {
  //     if (currentUser != null) {
  //       this.userService.editUser(currentUser).subscribe(
  //         result => {
  //           console.log("The result is " + result);
  //           this.ngOnInit();
  //         },
  //         err => {
  //           console.log('There was an error editing the ride.');
  //           console.log('The currentRide or dialogResult was ' + JSON.stringify(currentUser));
  //           console.log('The error was ' + JSON.stringify(err));
  //         });
  //     }
  //   });
  // }

  refreshUser(): void {
    this.route.params.subscribe(params => {
      const userId = params['userId'];
      this.userService
        .getUserById(userId)
        .subscribe(subscribedUser => {
          console.log(JSON.stringify(subscribedUser));
          this.user = subscribedUser
        });
    });
  }

  ngOnInit(): void {
    this.refreshUser();
    // this.route.params.subscribe(params => {
    //   const userId = params['userId'];
    //   this.userService
    //     .getUserById(userId)
    //     .subscribe(user => {
    //       console.log(JSON.stringify(user));
    //       this.user = user
    //     });
    // });
  }
}
