import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {Ride} from './ride';
import {RideListComponent} from './ride-list.component';
import {RideListService} from './ride-list.service';
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {CustomModule} from '../custom.module';
import {MatDialog} from '@angular/material';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import {User} from "../users/user";
import {RouterTestingModule} from "@angular/router/testing";
import {AuthService} from "../auth.service";

describe('Ride list', () => {

  let rideList: RideListComponent;
  let fixture: ComponentFixture<RideListComponent>;

  let authServiceStub: {
    isSignedIn: () => boolean;
  };

  let rideListServiceStub: {
    getRides: () => Observable<Ride[]>,
    getUsers: () => Observable<User[]>
  };

  beforeEach(()=> {
    authServiceStub = {
      isSignedIn: () => true
    };
    rideListServiceStub = {
      getRides: () => Observable.of([
        {
          _id: {$oid: 'wendyId'},
          ownerId: "5ca243f0ef2bf9b410bb5672",
          ownerData: {
            "_id": {
              "$oid": "5ca243f0ef2bf9b410bb5672"
            },
            "name": "Rosario Shaffer",
            "bio": "This person does not have a bio written",
            "email": "Venoflex19@gmail.com",
            "phoneNumber": "(928) 480-3646"
          },
          destination: 'Minneapolis',
          origin: 'Morris',
          roundTrip: false,
          departureDate: '2019-06-11T05:00:00.000Z',
          departureTime: '20:00',
          driving: true,
          notes: 'I like do drive with loud music.',
          mpg: 50,
          numSeats: 4,
          riderList: ['0']
        },
        {
          _id: {$oid: 'bobId'},
          ownerId: "5ca243f0662128b361c92055",
          ownerData: {
            "_id": {
              "$oid": "5ca243f0662128b361c92055"
            },
            "name": "Trina Ramsey",
            "bio": "This person does not have a bio written",
            "email": "Isologia30@hotmail.com",
            "phoneNumber": "(963) 498-3516"
          },
          destination: 'St. Cloud',
          origin: 'Morris',
          roundTrip: true,
          departureDate: '2020-06-05T05:00:00.000Z',
          departureTime: '14:00',
          driving: true,
          notes: 'I am down to play some music.',
          mpg: 60,
          numSeats: 4,
          riderList: ['0']
        },
        {
          _id: {$oid: 'jonId'},
          ownerId: "5ca243f0daa0cc10e6f90b76",
          ownerData: {
            "_id": {
              "$oid": "5ca243f0daa0cc10e6f90b76"
            },
            "name": "Elvira Wiley",
            "bio": "This person does not have a bio written",
            "email": "Musaphics29@yahoo.com",
            "phoneNumber": "(904) 578-2784"
          },
          destination: 'Big Lake',
          origin: 'Minneapolis',
          roundTrip: true,
          departureDate: '2021-01-15T05:00:00.000Z',
          departureTime: '03:00',
          driving: false,
          notes: 'I am down to play some music.',
          mpg: 12,
          numSeats: 4,
          riderList: ['0']
        },
        {
          _id: {$oid: 'billId'},
          ownerId: "5ca243f0797d9e845106b25e",
          ownerData: {
            "_id": {
              "$oid": "5ca243f0797d9e845106b25e"
            },
            "name": "Hatfield Daniels",
            "bio": "This person does not have a bio written",
            "email": "Extragen25@gmail.com",
            "phoneNumber": "(830) 410-3952"
          },
          destination: 'California',
          origin: 'Morris',
          roundTrip: false,
          departureDate: '2019-06-11T05:00:00.000Z',
          departureTime: '14:00',
          driving: false,
          notes: 'I am fine with driving large groups of people.',
          mpg: 43,
          numSeats: 4,
          riderList: ['0']
        }
      ]),
      getUsers: () => Observable.of([
        {
          _id: {
            "$oid": "5ca243f0ef2bf9b410bb5672"
          },
          name: "Rosario Shaffer",
          bio: "This person does not have a bio written",
          email: "Venoflex19@gmail.com",
          phoneNumber: "(928) 480-3646"
        },
        {
          _id: {
            "$oid": "5ca243f0662128b361c92055"
          },
          name: "Trina Ramsey",
          bio: "This person does not have a bio written",
          email: "Isologia30@hotmail.com",
          phoneNumber: "(963) 498-3516"
        },
        {
          _id: {
            "$oid": "5ca243f0daa0cc10e6f90b76"
          },
          name: "Elvira Wiley",
          bio: "This person does not have a bio written",
          email: "Musaphics29@yahoo.com",
          phoneNumber: "(904) 578-2784"
        },
        {
          _id: {
            "$oid": "5ca243f0797d9e845106b25e"
          },
          name: "Hatfield Daniels",
          bio: "This person does not have a bio written",
          email: "Extragen25@gmail.com",
          phoneNumber: "(830) 410-3952"
        }
      ])
    };

    TestBed.configureTestingModule({
      imports: [CustomModule, RouterTestingModule],
      declarations: [RideListComponent],
      providers: [
        {provide: RideListService, useValue: rideListServiceStub},
        {provide: AuthService, useValue: authServiceStub}
      ]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(RideListComponent);
      rideList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('loadService gets the ride list', () => {
    rideList.loadService();
    return expect(rideList.rides.length == 4).toBe(true);
  });

  it('contains all the rides', () => {
    return expect(rideList.rides.length).toBe(4);
  });

  // it('contains a ride driver \'Wendy Huebert\'', () => {
  //   return expect(rideList.rides.some((ride: Ride) => ride.driver === 'Wendy Huebert')).toBe(true);
  // });
  //
  // it('contains a ride driver \'Bill Williams\'', () => {
  //   return expect(rideList.rides.some((ride: Ride) => ride.driver === 'Bill Williams')).toBe(true);
  // });
  //
  // it('Does not contain a ride driver \'Bilbo Baggins\'', () => {
  //   return expect(rideList.rides.some((ride: Ride) => ride.driver === 'Bilbo Baggins')).toBe(false);
  // });

  it('contains a ride destination \'Big Lake\'', () => {
    return expect(rideList.rides.some((ride: Ride) => ride.destination === 'Big Lake')).toBe(true);
  });

  it('contains a ride destination \'Minneapolis\'', () => {
    return expect(rideList.rides.some((ride: Ride) => ride.destination === 'Minneapolis')).toBe(true);
  });

  it('Does not contain a ride destination \'Canada\'', () => {
    return expect(rideList.rides.some((ride: Ride) => ride.destination === 'canada')).toBe(false);
  });

  it('contains a ride origin \'Morris\'', () => {
    return expect(rideList.rides.filter((ride: Ride) => ride.origin === 'Morris').length).toBe(3);
  });

  it('contains a ride origin \'Minneapolis\'', () => {
    return expect(rideList.rides.some((ride: Ride) => ride.origin === 'Minneapolis')).toBe(true);
  });

  it('Does not contain a ride origin \'Canada\'', () => {
    return expect(rideList.rides.some((ride: Ride) => ride.origin === 'canada')).toBe(false);
  });

  it('contains a ride roundTrip \'True\'', () => {
    return expect(rideList.rides.some((ride: Ride) => ride.roundTrip === true)).toBe(true);
  });

  it('contains a ride roundTrip \'False\'', () => {
    return expect(rideList.rides.some((ride: Ride) => ride.roundTrip === false)).toBe(true);
  });

  it('Does not contain the correct number of ride roundTrips \'True\'', () => {
    return expect(rideList.rides.some((ride: Ride) => ride.roundTrip === true)).toBe(true);
  });

  it('contains a ride departureDate \'2019-06-11T05:00:00.000Z\' and checks multiple cases of this departure time', () => {
    return expect(rideList.rides.filter((ride: Ride) => ride.departureDate === '2019-06-11T05:00:00.000Z').length).toBe(2);
  });

  it('contains a ride departureDate \'2021-01-15T05:00:00.000Z\' and checks for once instance of this', () => {
    return expect(rideList.rides.filter((ride: Ride) => ride.departureDate === '2021-01-15T05:00:00.000Z').length).toBe(1);
  });

  it('Does not contain a ride departureDate \'12:00pm\'', () => {
    return expect(rideList.rides.some((ride: Ride) => ride.departureDate === '12:00pm')).toBe(false);
  });

  it('contains a ride departureTime \'14:00\' and checks multiple cases of this departure time', () => {
    return expect(rideList.rides.filter((ride: Ride) => ride.departureTime === '14:00').length).toBe(2);
  });

  it('contains a ride departureTime \'03:00\' and checks for once instance of this', () => {
    return expect(rideList.rides.filter((ride: Ride) => ride.departureTime === '03:00').length).toBe(1);
  });

  it('Does not contain a ride departureTime \'12:00pm\'', () => {
    return expect(rideList.rides.some((ride: Ride) => ride.departureTime === '12:00pm')).toBe(false);
  });

  it('contains a ride notes \'I am down to play some music.\' and checks multiple cases of this note', () => {
    return expect(rideList.rides.filter((ride: Ride) => ride.notes === 'I am down to play some music.').length).toBe(2);
  });

  it('contains a ride notes \'I like to drive with pets.\' and checks for once instance of this', () => {
    return expect(rideList.rides.some((ride: Ride) => ride.notes === 'I like do drive with loud music.')).toBe(true);
  });

  it('Does not contain a ride notes \'I like to ride alone\'', () => {
    return expect(rideList.rides.some((ride: Ride) => ride.notes === 'I like to ride alone')).toBe(false);
  });


  it('ride list filters by destination', () => {
    let exp1 = expect(rideList.filteredRides.length).toBe(4);
    rideList.rideDestination = 'Minneapolis';
    rideList.refreshRides().subscribe(() => {
      let exp2 = expect(rideList.filteredRides.length).toBe(1);
      return exp1 && exp2;
    });
  });

  it('has the associated ownerData', () => {
    console.log(rideList.rides);
    rideList.rides.some((ride: Ride) => ride.ownerData && ride.ownerData.name === "Hatfield Daniels");
    rideList.rides.some((ride: Ride) => ride.ownerData && ride.ownerData.phoneNumber === "(904) 578-2784");
    rideList.rides.some((ride: Ride) => ride.ownerData && ride.ownerData.email === "Isologia30@hotmail.com");
    rideList.rides.forEach((ride) => {
      if(ride.ownerId){
        return expect(ride.ownerData._id['$oid'] === (ride.ownerId.toString())).toBe(true);
      }
    });
  });
});

// TODO: This is currently not letting the build work due to the error: Cannot read property 'sort' of undefined
describe('Misbehaving Ride List',() => {
  let rideList: RideListComponent;
  let fixture: ComponentFixture<RideListComponent>;

  let authServiceStub: {
    isSignedIn: () => boolean;
  };

  let rideListServiceStub: {
    getRides: () => Observable<Ride[]>,
    getUsers: () => Observable<User[]>
  };

  beforeEach(() => {
    authServiceStub = {
      isSignedIn: () => true
    };
    rideListServiceStub = {
      getRides: () => Observable.create(observer => {
        observer.error('Error-prone observable');
      }),
      getUsers: () => Observable.create(observer => {
        observer.error('Error-prone observable');
      })
    };

    TestBed.configureTestingModule( {
      imports: [FormsModule, CustomModule, RouterTestingModule],
      declarations: [RideListComponent],
      providers: [
        {provide: RideListService, useValue: rideListServiceStub},
        {provide: AuthService, useValue: authServiceStub}
      ]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(RideListComponent);
      rideList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('generates an error if we don\'t set up a RideListService',() => {
    return expect(rideList.rides).toBeUndefined();
  });
});

describe('Adding a ride',()=> {
  let rideList: RideListComponent;
  let fixture: ComponentFixture<RideListComponent>;
  const newRide: Ride = {
    driver: 'Danial Donald',
    destination: 'Becker',
    origin: 'Morris',
    roundTrip: true,
    departureTime: '05:00',
    departureDate: '2019-12-25T00:00:00.000Z',
    notes: 'I do not like the smell of smoke.',
    numSeats: 4,
    riderList: ['0']
  };
  const newId = 'Danial_id';

  let calledRide: Ride;

  let authServiceStub: {
    isSignedIn: () => boolean;
  };
  let rideListServiceStub: {
    getRides: () => Observable<Ride[]>,
    getUsers: () => Observable<User[]>,
    addNewRide: (newRide: Ride) => Observable<{ '$oid': string}>
  };
  let mockMatDialog: {
    open: (AddRideComponent, any) => {
      afterClosed: () => Observable<Ride>
    };
  };

  beforeEach(() => {
    calledRide = null;
    authServiceStub = {
      isSignedIn: () => true
    };
    rideListServiceStub = {
      getRides: () => Observable.of([]),
      addNewRide: (newRide: Ride) => {
        calledRide = newRide;
        return Observable.of({
          '$oid': newId
        });
      },
      getUsers: () => Observable.of([])
    };
    mockMatDialog = {
      open: () => {
        return {
          afterClosed: () => {
            return Observable.of(newRide);
          }
        };
      }
    };

    TestBed.configureTestingModule({
      imports: [FormsModule, CustomModule, RouterTestingModule],
      declarations: [RideListComponent],
      providers: [
        {provide: RideListService, useValue: rideListServiceStub},
        {provide: MatDialog, useValue: mockMatDialog},
        {provide: AuthService, useValue: authServiceStub}
      ]
    });
  });

  beforeEach(async(()=> {
    TestBed.compileComponents().then(()=> {
      fixture = TestBed.createComponent(RideListComponent);
      rideList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('calls RideListService.addNewRide', () => {
    let exp1 = expect(calledRide).toBeNull();
    rideList.openAddDialog();
    let exp2 = expect(calledRide).toEqual(newRide);
    return exp1 && exp2;
  });
});

describe('Editing a ride',()=> {
  let rideList: RideListComponent;
  let fixture: ComponentFixture<RideListComponent>;
  const currentRide: Ride = {
    _id: {$oid: 'Danial_id'},
    driver: 'Danial Donald',
    destination: 'Becker',
    origin: 'Morris',
    roundTrip: true,
    driving: true,
    departureTime: '05:00',
    departureDate: '2019-12-25T00:00:00.000Z',
    notes: 'I do not like the smell of smoke.',
    numSeats: 4,
    riderList: ['0']
  };
  const newId = 'Danial_id';

  let calledRide: Ride;

  let authServiceStub: {
    isSignedIn: () => boolean;
  };

  let rideListServiceStub: {
    getRides: () => Observable<Ride[]>,
    editRide: (currentRide: Ride) => Observable<{ '$oid': string}>,
    getUsers: () => Observable<User[]>
  };
  let mockMatDialog: {
    open: (EditRideComponent, any) => {
      afterClosed: () => Observable<Ride>
    };
  };

  beforeEach(() => {
    calledRide = null;
    authServiceStub = {
      isSignedIn: () => true
    };
    rideListServiceStub = {
      getRides: () => Observable.of([]),
      editRide: (currentRide: Ride) => {
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
    mockMatDialog = {
      open: () => {
        return {
          afterClosed: () => {
            return Observable.of(currentRide);
          }
        };
      }
    };

    TestBed.configureTestingModule({
      imports: [FormsModule, CustomModule, RouterTestingModule],
      declarations: [RideListComponent],
      providers: [
        {provide: RideListService, useValue: rideListServiceStub},
        {provide: MatDialog, useValue: mockMatDialog},
        {provide: AuthService, useValue: authServiceStub}
      ]
    });
  });

  beforeEach(async(()=> {
    TestBed.compileComponents().then(()=> {
      fixture = TestBed.createComponent(RideListComponent);
      rideList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('calls RideListService.editRide', () => {
    let exp1 = expect(calledRide).toBeNull();
    rideList.openEditDialog(currentRide._id.$oid, currentRide.driver, currentRide.destination, currentRide.origin, currentRide.roundTrip, currentRide.driving, currentRide.departureDate, currentRide.departureTime, currentRide.mpg, currentRide.notes, currentRide.numSeats, currentRide.riderList);
    let exp2 = expect(calledRide).toEqual(currentRide);
    return exp1 && exp2;
  });
});

describe('Deleting a ride',()=> {
  let rideList: RideListComponent;
  let fixture: ComponentFixture<RideListComponent>;
  const currentRide: Ride = {
    _id: {$oid: 'Danial_id'},
    driver: 'Danial Donald',
    destination: 'Becker',
    origin: 'Morris',
    roundTrip: true,
    departureTime: '05:00',
    departureDate: '2019-12-25T00:00:00.000Z',
    notes: 'I do not like the smell of smoke.',
    numSeats: 4,
    riderList: ['0']
  };
  const newId = 'Danial_id';

  let calledRide: Ride;

  let authServiceStub: {
    isSignedIn: () => boolean;
  };
  let rideListServiceStub: {
    getRides: () => Observable<Ride[]>,
    deleteRide: (currentRide: Ride) => Observable<{ '$oid': string}>,
    getUsers: () => Observable<User[]>
  };
  let mockMatDialog: {
    open: (DeleteRideComponent, any) => {
      afterClosed: () => Observable<Ride>
    };
  };

  beforeEach(() => {
    calledRide = null;
    authServiceStub = {
      isSignedIn: () => true
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
    mockMatDialog = {
      open: () => {
        return {
          afterClosed: () => {
            return Observable.of(currentRide);
          }
        };
      }
    };

    TestBed.configureTestingModule({
      imports: [FormsModule, CustomModule, RouterTestingModule],
      declarations: [RideListComponent],
      providers: [
        {provide: RideListService, useValue: rideListServiceStub},
        {provide: MatDialog, useValue: mockMatDialog},
        {provide: AuthService, useValue: authServiceStub}
      ]
    });
  });

  beforeEach(async(()=> {
    TestBed.compileComponents().then(()=> {
      fixture = TestBed.createComponent(RideListComponent);
      rideList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('calls RideListService.deleteRide', () => {
    let exp1 = expect(calledRide).toBeNull();
    rideList.openDeleteDialog(currentRide._id.$oid);
    let exp2 = expect(calledRide).toEqual(currentRide);
    return exp1 && exp2;
  });
});
