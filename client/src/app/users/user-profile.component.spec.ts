import {UserProfileComponent} from "./user-profile.component";
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {Observable} from "rxjs/Observable";
import {User} from "./user";
import {CustomModule} from "../custom.module";
import {UserService} from "./user-service";
import {FormsModule} from "@angular/forms";
import {MatDialog, MatSelectModule} from "@angular/material";
import {RouterTestingModule} from "@angular/router/testing";
import {EditUserComponent} from "./edit-user.component";
import {RateUserComponent} from "./rate-user.component";
import {AuthService} from "../auth.service";
import {RideListService} from "../rides/ride-list.service";
import {Ride} from "../rides/ride";

describe( 'User Profile', () => {
  let userProfile: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;

  // let authServiceStub: {
  //   isSignedIn: () => boolean;
  // };

  let authServiceStub: {
    getUserId: () => String,
    getUserName: () => String,
    loadClient: () => null;
  };

  let rideListServiceStub: {
    getRides: () => Observable<Ride[]>,
    deleteRide: (currentRide: Ride) => Observable<{ '$oid': string}>,
    getUsers: () => Observable<User[]>,
    getUserRides: () => Observable<Ride[]>
  };

  let userServiceStub: {
    getUsers: () => Observable<User>;
    getUserById: () => Observable<User>;
  };

  const newId = 'Danial_id';

  let calledRide: Ride;

  beforeEach(() => {
    calledRide = null;
    rideListServiceStub = {
      getRides: () => Observable.of([]),
      deleteRide: (currentRide: Ride) => {
        calledRide = currentRide;
        return Observable.of({
          '$oid': newId
        });
      },
      getUsers: () => Observable.of([
        {
          _id: {
            '$oid': '5ca243f0712ed630c21a8407'
          },
          name: 'Sydney Stevens',
          bio: 'This person does not have a bio written',
          phoneNumber: '320 555 5555',
          email: 'Stevens@google.com',
        }
      ]),
      getUserRides: () => Observable.of([
        {
          _id: {
            '$oid': '5ccc7f02bb2d3b38131f5c55'
          },
          ownerId: '5cb8bee0fc8510c466d1689c',
          destination: 'Willy\'s',
          origin: 'Cougar Circle',
          roundTrip: false,
          departureDate: '2020-09-18T05:00:00.000Z',
          departureTime: '12:00',
          driving : false,
          notes: 'I love classic rock and I play it loud!',
          mpg: 55,
          numSeats: 3,
          riderList: ["Bob Marcy"],
        }
      ])
    };

    window['gapi'] = {
      load() {
        return null;
      }
    };

    // authServiceStub = {
    //   isSignedIn: () => true
    // };

    authServiceStub = {
      getUserId: () => "MI6007",
      getUserName: () => "James Bond",
      loadClient: () => null,
    };

    userServiceStub = {
      getUsers: () => Observable.of(
        {
          _id: {
            $oid: "5ca243f0ef2bf9b410bb5672"
          },
          name: "Rosario Shaffer",
          bio: "This user has not written anything",
          email: "Venoflex19@gmail.com",
          phoneNumber: "(928) 480-3646",
          totalReviewScore: 12,
          numReviews: 3
        }
      ),
      getUserById: () => Observable.of(
        {
          _id: {
            $oid: "5ca243f0ef2bf9b410bb5672"
          },
          name: "Rosario Shaffer",
          bio: "This user has not written anything",
          email: "Venoflex19@gmail.com",
          phoneNumber: "(928) 480-3646",
          totalReviewScore: 12,
          numReviews: 3
        }
      )
    };

    TestBed.configureTestingModule({
      imports: [CustomModule, MatSelectModule, RouterTestingModule],
      declarations: [UserProfileComponent],
      providers: [
        {provide: UserService, useValue: userServiceStub},
        {provide: AuthService, useValue: authServiceStub},
        {provide: RideListService, useValue: rideListServiceStub}
      ]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(UserProfileComponent);
      userProfile = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));
  it('refreshUser gets the user profile', () => {
    userProfile.refreshUser();
    return expect(userProfile.user._id.$oid).toBe("5ca243f0ef2bf9b410bb5672");
  });

  it('user is \'Rosario Shaffer\'', () => {
    return expect(userProfile.user.name === 'Rosario Shaffer').toBe(true);
  });

  it('doesn\'t contain a user \'Shrek\'', () => {
    return expect(userProfile.user.name === 'Shrek').toBe(false);
  });

  it('contains a phone number \'(928) 480-3646\'', () => {
    return expect(userProfile.user.phoneNumber === '(928) 480-3646').toBe(true);
  });

  it('contains an email \'Venoflex19@gmail.com\'', () => {
    return expect(userProfile.user.email === 'Venoflex19@gmail.com').toBe(true);
  });

  it('contains a review score \'12\'', () => {
    return expect(userProfile.user.totalReviewScore === 12).toBe(true);
  });

  it('contains a number of reviews \'3\'', () => {
    return expect(userProfile.user.numReviews === 3).toBe(true);
  });
});

describe('Misbehaving User Profiles',() => {
  let userProfile: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;

  // let authServiceStub: {
  //   isSignedIn: () => boolean;
  // };
  let authServiceStub: {
    getUserId: () => String,
    getUserName: () => String,
    loadClient: () => null;
  };

  let rideListServiceStub: {
    getRides: () => Observable<Ride[]>,
    deleteRide: (currentRide: Ride) => Observable<{ '$oid': string}>,
    getUsers: () => Observable<User[]>
  };

  let userServiceStub: {
    getUsers: () => Observable<User[]>
    getUserById: () => Observable<User>
  };

  const newId = 'Danial_id';

  let calledRide: Ride;

  beforeEach(() => {
    // authServiceStub = {
    //   isSignedIn: () => true
    // };
    authServiceStub = {
      getUserId: () => "MI6007",
      getUserName: () => "James Bond",
      loadClient: () => null,
    };

    rideListServiceStub = {
      getRides: () => Observable.of([]),
      deleteRide: (currentRide: Ride) => {
        calledRide = currentRide;
        return Observable.of({
          '$oid': newId
        });
      },
      getUsers: () => Observable.of([
        {
          _id: {
            '$oid': '5ca243f0712ed630c21a8407'
          },
          name: 'Sydney Stevens',
          bio: 'This person does not have a bio written',
          phoneNumber: '320 555 5555',
          email: 'Stevens@google.com',
        }
      ])
    };
    userServiceStub = {
      getUsers: () => Observable.create(observer => {
        observer.error('Error-prone observable');
      }),
      getUserById: () => Observable.of(
        undefined
      )
    };

    TestBed.configureTestingModule( {
      imports: [FormsModule, CustomModule, MatSelectModule, RouterTestingModule],
      declarations: [UserProfileComponent],
      providers: [
        {provide: UserService, useValue: userServiceStub},
        {provide: AuthService, useValue: authServiceStub},
        {provide: RideListService, useValue: rideListServiceStub}
      ]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(UserProfileComponent);
      userProfile = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('generates an error if we don\'t set up a UserService',() => {
    return expect(userProfile.user).toBeUndefined();
  });
});

describe('Editing a user', ()=> {
  let userProfile: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  const currentUser: User = {
    _id: {$oid: 'Becky_id'},
    name: 'Becky',
    bio: 'Its me Becky',
    email: 'becky@basic.org',
    phoneNumber: '(123) 456-7890',
    totalReviewScore: 5,
    numReviews: 5,
    avgScore: 1
  };

  const newId = 'Becky_id';
  let calledUser: User;

  // let authServiceStub: {
  //   isSignedIn: () => boolean;
  // };

  let authServiceStub: {
    getUserId: () => String,
    getUserName: () => String,
    loadClient: () => null;
  };

  let rideListServiceStub: {
    getRides: () => Observable<Ride[]>,
    deleteRide: (currentRide: Ride) => Observable<{ '$oid': string}>,
    getUsers: () => Observable<User[]>,
    getUserRides: () => Observable<Ride[]>
  };

  let userServiceStub: {
    getUserById: () => Observable<User>,
    editUser: (currentUser: User) => Observable<{ '$oid': string }>
  };

  let mockMatDialog: {
    open: (EditUserComponent, any) => {
      afterClosed: () => Observable<User>
    };
  };

  let calledRide: Ride;

  beforeEach(() => {
    calledUser = null;
    // authServiceStub = {
    //   isSignedIn: () => true
    // };

    authServiceStub = {
      getUserId: () => "MI6007",
      getUserName: () => "James Bond",
      loadClient: () => null,
    };

    rideListServiceStub = {
      getRides: () => Observable.of([]),
      deleteRide: (currentRide: Ride) => {
        calledRide = currentRide;
        return Observable.of({
          '$oid': newId
        });
      },
      getUsers: () => Observable.of([
        {
          _id: {
            '$oid': '5ca243f0712ed630c21a8407'
          },
          name: 'Sydney Stevens',
          bio: 'This person does not have a bio written',
          phoneNumber: '320 555 5555',
          email: 'Stevens@google.com',
        }
      ]),
      getUserRides: () => Observable.of([
        {
          "ownerId": "5cb8bee01dcce624e181efca",
          "destination": "Alexandria",
          "origin": "Debevoise Avenue",
          "roundTrip": false,
          "departureDate": "2020-05-08T05:00:00.000Z",
          "departureTime": "01:00",
          "driving": false,
          "notes": "No pet allowed",
          "mpg": 30,
          "numSeats": 4,
          "riderList": []
        }
      ])
    };

    userServiceStub = {
      getUserById: () => Observable.of(),
      editUser: (currentUser: User) => {
        calledUser = currentUser;
        return Observable.of({
          '$oid': newId
        });
      }
    };

    mockMatDialog = {
      open: () => {
        return {
          afterClosed: () => {
            return Observable.of(currentUser);
          }
        };
      }
    };

    TestBed.configureTestingModule({
      imports: [FormsModule, CustomModule, RouterTestingModule, MatSelectModule],
      declarations: [UserProfileComponent],
      providers: [
        {provide: UserService, useValue: userServiceStub},
        {provide: MatDialog, useValue: mockMatDialog},
        {provide: AuthService, useValue: authServiceStub},
        {provide: RideListService, useValue: rideListServiceStub}
      ]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(()=> {
      fixture = TestBed.createComponent(UserProfileComponent);
      userProfile = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('calls UserListService.editUser', () => {
    let exp1 = expect(calledUser).toBeNull();
    userProfile.editUserDialog(currentUser._id.$oid, currentUser.name, currentUser.bio, currentUser.email, currentUser.phoneNumber, currentUser.totalReviewScore, currentUser.numReviews, currentUser.avgScore);
    let exp2 = expect(calledUser).toEqual(currentUser);
    return exp1 && exp2;
  });
});

describe('Rating a user', ()=> {
  let userProfile: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  const currentUser: User = {
    _id: {$oid: 'Ridley_id'},
    name: 'Ridley',
    bio: 'I am a space pirate, and I stand up sometimes',
    email: 'ridley@spacepirate.com',
    phoneNumber: '(987) 654-3210',
    totalReviewScore: 10,
    numReviews: 2,
    avgScore: 5
  };

  const newId = 'Ridley_id';
  let calledUser: User;

  let authServiceStub: {
    getUserId: () => String,
    getUserName: () => String,
    loadClient: () => null;
  };

  let rideListServiceStub: {
    getRides: () => Observable<Ride[]>,
    deleteRide: (currentRide: Ride) => Observable<{ '$oid': string}>,
    getUsers: () => Observable<User[]>,
    getUserRides: () => Observable<Ride[]>
  };

  let userServiceStub: {
    getUserById: () => Observable<User>,
    rateUser: (currentUser: User) => Observable<{ '$oid': string}>
  };

  let mockMatDialog: {
    open: (RateUserComponent, any) => {
      afterClosed: () => Observable<User>
    };
  };

  let calledRide: Ride;

  beforeEach(() => {
    calledUser = null;

    authServiceStub = {
      getUserId: () => "MI6007",
      getUserName: () => "James Bond",
      loadClient: () => null,
    };

    userServiceStub = {
      getUserById: () => Observable.of(),
      rateUser: (currentUser: User) => {
        calledUser = currentUser;
        return Observable.of({
          '$oid': newId
        });
      }
    };

    rideListServiceStub = {
      getRides: () => Observable.of([]),
      deleteRide: (currentRide: Ride) => {
        calledRide = currentRide;
        return Observable.of({
          '$oid': newId
        });
      },
      getUsers: () => Observable.of([
        {
          _id: {
            '$oid': '5ca243f0712ed630c21a8407'
          },
          name: 'Sydney Stevens',
          bio: 'This person does not have a bio written',
          phoneNumber: '320 555 5555',
          email: 'Stevens@google.com',
        }
      ]),
      getUserRides: () => Observable.of([
        {
          _id: {
            '$oid': '5ccc7f02bb2d3b38131f5c55'
          },
          ownerId: '5cb8bee0fc8510c466d1689c',
          destination: 'Willy\'s',
          origin: 'Cougar Circle',
          roundTrip: false,
          departureDate: '2020-09-18T05:00:00.000Z',
          departureTime: '12:00',
          driving : false,
          notes: 'I love classic rock and I play it loud!',
          mpg: 55,
          numSeats: 3,
          riderList: ["Bob Marcy"],
        }
      ])

    };

    mockMatDialog = {
      open: () => {
        return {
          afterClosed: () => {
            return Observable.of(currentUser);
          }
        };
      }
    };

    TestBed.configureTestingModule({
      imports: [FormsModule, CustomModule, MatSelectModule, RouterTestingModule],
      declarations: [UserProfileComponent],
      providers: [
        {provide: UserService, useValue: userServiceStub},
        {provide: MatDialog, useValue: mockMatDialog},
        {provide: AuthService, useValue: authServiceStub},
        {provide: RideListService, useValue: rideListServiceStub}
      ]
    });
  });

  beforeEach(async(() =>  {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(UserProfileComponent);
      userProfile = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('calls UserService.rateUser', () => {
    let exp1 = expect(calledUser).toBeNull();
    let rating: string = '5';
    userProfile.editUserReviewDialog(currentUser._id.$oid, currentUser.name, currentUser.bio, currentUser.email, currentUser.phoneNumber, currentUser.totalReviewScore, currentUser.numReviews, currentUser.avgScore, rating);
    let exp2 = expect(calledUser).toEqual(currentUser);
    return exp1  && exp2;
  });
});

