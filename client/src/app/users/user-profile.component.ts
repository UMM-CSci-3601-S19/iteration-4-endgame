import {Component, OnInit} from '@angular/core';
import {UserService} from './user-service';
import {User} from './user';
import {Observable} from 'rxjs/Observable';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {EditUserComponent} from "./edit-user.component";
import {ActivatedRoute} from "@angular/router";
import {RateUserComponent} from "./rate-user.component";

@Component({
  selector: 'user-profile-component',
  templateUrl: 'user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})

export class UserProfileComponent implements OnInit {

  rating;
  user: User;

  // Inject the UserListService into this component.
  constructor(private route: ActivatedRoute, public userService: UserService, public dialog: MatDialog) {

  }

  editUserDialog(cId: string, cName: string, cBio: string, cEmail: string, cPhoneNumber: string,
                 cTotalReviewScore: number, cNumReviews: number, cAvgScore: number): void {
    const cInfo: User = {
      _id: {
        $oid: cId
      },
      name: cName,
      bio: cBio,
      email: cEmail,
      phoneNumber: cPhoneNumber,
      totalReviewScore: cTotalReviewScore,
      numReviews: cNumReviews,
      avgScore: cAvgScore
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {user: cInfo};
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

  editUserReviewDialog(cId: string, cName: string, cBio: string, cEmail: string, cPhoneNumber: string,
                       cTotalReviewScore: number, cNumReviews: number, cAvgScore: number, cRating: string): void {
    let newRating: number = parseInt(cRating);
    console.log("Old Total Rating: " + cTotalReviewScore + "\nOld Number of Reviews: " + cNumReviews
            + "\nNew Rating: " + newRating + "\nOld Average: " + cAvgScore);
    cTotalReviewScore = cTotalReviewScore + newRating;
    cNumReviews += 1;
    cAvgScore = cTotalReviewScore/cNumReviews;
    console.log("New Total Rating: " + cTotalReviewScore + "\nNew Number of Reviews: " + cNumReviews + "\nNew Average: " + cAvgScore);

    const cUser: User = {
      _id: {
        $oid: cId
      },
      name: cName,
      bio: cBio,
      email: cEmail,
      phoneNumber: cPhoneNumber,
      totalReviewScore: cTotalReviewScore,
      numReviews: cNumReviews,
      avgScore: cAvgScore
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {user: cUser};
    dialogConfig.width = '500px';

    const dialogRef = this.dialog.open(RateUserComponent, dialogConfig);

    console.log("Dialog Ref " + dialogRef.toString());
    dialogRef.afterClosed().subscribe(cUser => {
      if (cUser != null) {
        this.userService.rateUser(cUser).subscribe(
          result => {
            console.log("The result is " + result);
            this.refreshUser();
          },
          err => {
            console.log('There was an error editing the ride.');
            console.log('The currentRide or dialogResult was ' + JSON.stringify(cUser));
            console.log('The error was ' + JSON.stringify(err));
          }
        );
      }
    });
  }

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
