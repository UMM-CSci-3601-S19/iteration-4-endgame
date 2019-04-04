import {UserProfileComponent} from "./user-profile.component";
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {Observable} from "rxjs/Observable";
import {User} from "./user";
import {CustomModule} from "../custom.module";
import {UserService} from "./user-service";
import {FormsModule} from "@angular/forms";
import {MatDialog} from "@angular/material";

describe( 'User Profile', () => {
  let userProfiles: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;

  let userServiceStub: {
    getUsers: () => Observable<User[]>;
  };

  beforeEach(() => {
    userServiceStub = {
      getUsers: () => Observable.of([
        {
          "_id": {
            "$oid": "5ca243f0ef2bf9b410bb5672"
          },
          "name": "Rosario Shaffer",
          "email": "Venoflex19@gmail.com",
          "phoneNumber": "(928) 480-3646",
          "reviewScores": 12,
          "numReviews": 3,
        },
        {
          "_id": {
            "$oid": "5ca243f0662128b361c92055"
          },
          "name": "Trina Ramsey",
          "email": "Isologia30@hotmail.com",
          "phoneNumber": "(963) 498-3516"
        },
        {
          "_id": {
            "$oid": "5ca243f0daa0cc10e6f90b76"
          },
          "name": "Elvira Wiley",
          "email": "Musaphics29@yahoo.com",
          "phoneNumber": "(904) 578-2784",
          "reviewScores": 1,
          "numReviews": 1,
        },
        {
          "_id": {
            "$oid": "5ca243f0797d9e845106b25e"
          },
          "name": "Hatfield Daniels",
          "email": "Extragen25@gmail.com",
          "phoneNumber": "(830) 410-3952"
        }
      ])
    };

    TestBed.configureTestingModule({
      imports: [CustomModule],
      declarations: [UserProfileComponent],
      providers: [{provide: UserService, useValue: userServiceStub}]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(UserProfileComponent);
      userProfiles = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));
  /*
  it('loadService gets the user profiles', () => {
    userProfiles.loadService();
    expect(userProfiles.users.length == 4)
  });

  it('contains all the users', () => {
    expect(userProfiles.users.length).toBe(4);
  });

  it('contains a user \'Trina Ramsey\'', () => {
    expect(userProfiles.users.some((user: User) => user.name === 'Trina Ramsey')).toBe(true);
  });

  it('contains a user \'Hatfield Daniels\'', () => {
    expect(userProfiles.users.some((user: User) => user.name === 'Hatfield Daniels')).toBe(true);
  });

  it('doesn\'t contain a user \'Shrek\'', () => {
    expect(userProfiles.users.some((user: User) => user.name === 'Shrek')).toBe(false);
  });

  it('contains a phone number \'(904) 578-2784\'', () => {
    expect(userProfiles.users.some((user: User) => user.phoneNumber === '(904) 578-2784')).toBe(true);
  });

  it('contains an email \'Venoflex19@gmail.com\'', () => {
    expect(userProfiles.users.some((user: User) => user.email === 'Venoflex19@gmail.com')).toBe(true);
  });

  it('contains a review score \'12\'', () => {
    expect(userProfiles.users.some((user: User) => user.reviewScores === 12)).toBe(true);
  });

  it('contains a number of reviews \'3\'', () => {
    expect(userProfiles.users.some((user: User) => user.numReviews === 3)).toBe(true);
  });
  */
});

describe('Misbehaving User Profiles',() => {
  let userProfiles: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;

  let userServiceStub: {
    getUsers: () => Observable<User[]>
  };

  beforeEach(() => {
    userServiceStub = {
      getUsers: () => Observable.create(observer => {
        observer.error('Error-prone observable');
      })
    };

    TestBed.configureTestingModule( {
      imports: [FormsModule, CustomModule],
      declarations: [UserProfileComponent],
      providers: [{provide: UserService, useValue: userServiceStub}]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(UserProfileComponent);
      userProfiles = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));
  /*
  it('generates an error if we don\'t set up a UserService',() => {
    expect(userProfiles.users).toBeUndefined();
  });
  */
});

// describe('Editing a user',()=> {
//   let userProfiles: UserProfileComponent;
//   let fixture: ComponentFixture<UserProfileComponent>;
//   const currentUser: User = {
//     "_id": {
//       "$oid": "5ca243f0ef2bf9b410bb5672"
//     },
//     "name": "Rosario Shaffer",
//     "email": "Venoflex19@gmail.com",
//     "phoneNumber": "(928) 480-3646",
//     "reviewScores": 12,
//     "numReviews": 3
//   };
//   const newId: string = 'Rosario_id';
//
//   let calledUser: User;
//
//   let userServiceStub: {
//     getUsers: () => Observable<User[]>
//   };
//   let mockMatDialog: {
//     open: (EditUserComponent, any) => {
//       afterClosed: () => Observable<User>
//     };
//   };
//
//   beforeEach(() => {
//     calledUser = null;
//     userServiceStub = {
//       getUsers: () => Observable.of([]),
//       editUser: (currentUser: User) => {
//         calledUser = currentUser;
//         return Observable.of({
//           '$oid': newId
//         });
//       }
//     };
//     mockMatDialog = {
//       open: () => {
//         return {
//           afterClosed: () => {
//             return Observable.of(currentUser);
//           }
//         };
//       }
//     };
//
//     TestBed.configureTestingModule({
//       imports: [FormsModule, CustomModule],
//       declarations: [UserProfileComponent],
//       providers: [
//         {provide: UserService, useValue: userServiceStub},
//         {provide: MatDialog, useValue: mockMatDialog},
//       ]
//     });
//     beforeEach(async(()=> {
//       TestBed.compileComponents().then(()=> {
//         fixture = TestBed.createComponent(UserProfileComponent);
//         userProfiles = fixture.componentInstance;
//         fixture.detectChanges();
//       });
//     }));
//
//     it('calls UserService.editUser', () => {
//       expect(calledUser).toBeNull();
//       let rating: string = '3';
//       userProfiles.editUserReviewDialog(currentUser._id.$oid, currentUser.name, currentUser.email, currentUser.phoneNumber, currentUser.reviewScores, rating, currentUser.numReviews);
//       expect(calledUser).toEqual(currentUser);
//     });
//   });
// });
