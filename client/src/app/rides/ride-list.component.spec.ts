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

describe('Ride list', () => {

  let rideList: RideListComponent;
  let fixture: ComponentFixture<RideListComponent>;

  let rideListServiceStub: {
    getRides: () => Observable<Ride[]>,
    getUsers: () => Observable<User[]>
  };

  beforeEach(()=> {
    rideListServiceStub = {
      getRides: () => Observable.of([
        {
          driver: 'Wendy Huebert',
          ownerId: "5ca243f0ef2bf9b410bb5672",
          ownerData: {
            "_id": {
              "$oid": "5ca243f0ef2bf9b410bb5672"
            },
            "name": "Rosario Shaffer",
            "email": "Venoflex19@gmail.com",
            "phoneNumber": "(928) 480-3646"
          },
          destination: 'Minneapolis',
          origin: 'Morris',
          roundTrip: false,
          departureDate: 'March 19, 2020',
          departureTime: '5:00pm',
          driving: true,
          notes: 'I like do drive with loud music.',
          mpg: 50
        },
        {
          driver: 'Bob Mann',
          ownerId: "5ca243f0662128b361c92055",
          ownerData: {
            "_id": {
              "$oid": "5ca243f0662128b361c92055"
            },
            "name": "Trina Ramsey",
            "email": "Isologia30@hotmail.com",
            "phoneNumber": "(963) 498-3516"
          },
          destination: 'St. Cloud',
          origin: 'Morris',
          roundTrip: true,
          departureDate: 'April 6th, 2019',
          departureTime: '6:00pm',
          driving: true,
          notes: 'I am down to play some music.',
          mpg: 60
        },
        {
          driver: 'Jon Ruevers',
          ownerId: "5ca243f0daa0cc10e6f90b76",
          ownerData: {
            "_id": {
              "$oid": "5ca243f0daa0cc10e6f90b76"
            },
            "name": "Elvira Wiley",
            "email": "Musaphics29@yahoo.com",
            "phoneNumber": "(904) 578-2784"
          },
          destination: 'Big Lake',
          origin: 'Minneapolis',
          roundTrip: true,
          departureDate: 'August 23rd, 2019',
          departureTime: '7:00pm',
          driving: false,
          notes: 'I am down to play some music.',
          mpg: 12
        },
        {
          driver: 'Bill Williams',
          ownerId: "5ca243f0797d9e845106b25e",
          ownerData: {
            "_id": {
              "$oid": "5ca243f0797d9e845106b25e"
            },
            "name": "Hatfield Daniels",
            "email": "Extragen25@gmail.com",
            "phoneNumber": "(830) 410-3952"
          },
          destination: 'California',
          origin: 'Morris',
          roundTrip: false,
          departureDate: 'August 43rd, 2019',
          departureTime: '3:00pm',
          driving: false,
          notes: 'I am fine with driving large groups of people.',
          mpg: 43
        }
      ]),
      getUsers: () => Observable.of([
        {
          "_id": {
            "$oid": "5ca243f0ef2bf9b410bb5672"
          },
          "name": "Rosario Shaffer",
          "email": "Venoflex19@gmail.com",
          "phoneNumber": "(928) 480-3646"
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
          "phoneNumber": "(904) 578-2784"
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
      declarations: [RideListComponent],
      providers: [{provide: RideListService, useValue: rideListServiceStub}]
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
    expect(rideList.rides.length == 4)
  });

  it('contains all the rides', () => {
    expect(rideList.rides.length).toBe(4);
  });

  // TODO: Should be changed to owner things instead of driver as driver is irrelevant
  // it('contains a ride driver \'Wendy Huebert\'', () => {
  //   expect(rideList.rides.some((ride: Ride) => ride.driver === 'Wendy Huebert')).toBe(true);
  // });
  //
  // it('contains a ride driver \'Sydney Stevens\'', () => {
  //   expect(rideList.rides.filter((ride:Ride) => ride.driver === 'Sydney Stevens').length).toBe(2);
  // });
  //
  // it('contains a ride driver \'Bill Williams\'', () => {
  //   expect(rideList.rides.some((ride: Ride) => ride.driver === 'Bill Williams')).toBe(true);
  // });
  //
  // it('Does not contain a ride driver \'Bilbo Baggins\'', () => {
  //   expect(rideList.rides.some((ride: Ride) => ride.driver === 'Bilbo Baggins')).toBe(false);
  // });

  it('contains a ride destination \'Big Lake\'', () => {
    expect(rideList.rides.some((ride: Ride) => ride.destination === 'Big Lake')).toBe(true);
  });

  it('contains a ride destination \'Minneapolis\'', () => {
    expect(rideList.rides.some((ride: Ride) => ride.destination === 'Minneapolis')).toBe(true);
  });

  it('Does not contain a ride destination \'Canada\'', () => {
    expect(rideList.rides.some((ride: Ride) => ride.destination === 'canada')).toBe(false);
  });

  it('contains a ride origin \'Morris\'', () => {
    expect(rideList.rides.filter((ride: Ride) => ride.origin === 'Morris').length).toBe(3);
  });

  it('contains a ride origin \'Minneapolis\'', () => {
    expect(rideList.rides.some((ride: Ride) => ride.origin === 'Minneapolis')).toBe(true);
  });

  it('Does not contain a ride origin \'Canada\'', () => {
    expect(rideList.rides.some((ride: Ride) => ride.origin === 'canada')).toBe(false);
  });

  it('contains a ride roundTrip \'True\'', () => {
    expect(rideList.rides.some((ride: Ride) => ride.roundTrip === true));
  });

  it('contains a ride roundTrip \'False\'', () => {
    expect(rideList.rides.some((ride: Ride) => ride.roundTrip === false)).toBe(true);
  });

  it('Does not contain the correct number of ride roundTrips \'True\'', () => {
    expect(rideList.rides.some((ride: Ride) => ride.roundTrip === true));
  });

  // TODO: Fix tests to work with the new departureDate and departureTime
  // it('contains a ride departureTime \'5:00pm\' and checks multiple cases of this departure time', () => {
  //   expect(rideList.rides.filter((ride: Ride) => ride.departureTime === '5:00pm').length).toBe(2);
  // });
  //
  // it('contains a ride departureTime \'3:00pm\' and checks for once instance of this', () => {
  //   expect(rideList.rides.filter((ride: Ride) => ride.departureTime === '3:00pm').length).toBe(1);
  // });
  //
  // it('Does not contain a ride departureTime \'12:00pm\'', () => {
  //   expect(rideList.rides.some((ride: Ride) => ride.departureTime === '12:00pm')).toBe(false);
  // });

  it('contains a ride notes \'I am down to play some music.\' and checks multiple cases of this note', () => {
    expect(rideList.rides.filter((ride: Ride) => ride.notes === 'I am down to play some music.').length).toBe(2);
  });

  it('contains a ride notes \'I like to drive with pets.\' and checks for once instance of this', () => {
    expect(rideList.rides.some((ride: Ride) => ride.notes === 'I like do drive with loud music.')).toBe(true);
  });

  it('Does not contain a ride notes \'I like to ride alone\'', () => {
    expect(rideList.rides.some((ride: Ride) => ride.notes === 'I like to ride alone')).toBe(false);
  });


  it('ride list filters by destination', () => {
    expect(rideList.filteredRides.length).toBe(4);
    rideList.rideDestination = 'Minneapolis';
    rideList.refreshRides().subscribe(() => {
      expect(rideList.filteredRides.length).toBe(1);
    });
  });

  it('has the associated ownerData', () => {
    console.log(rideList.rides);
    rideList.rides.some((ride: Ride) => ride.ownerData && ride.ownerData.name === "Hatfield Daniels");
    rideList.rides.some((ride: Ride) => ride.ownerData && ride.ownerData.phoneNumber === "(904) 578-2784");
    rideList.rides.some((ride: Ride) => ride.ownerData && ride.ownerData.email === "Isologia30@hotmail.com");
    rideList.rides.forEach((ride) => {
      if(ride.ownerId){
        expect(ride.ownerData._id['$oid'] === (ride.ownerId.toString()));
      }
    });
  });
});

describe('Misbehaving Ride List',() => {
  let rideList: RideListComponent;
  let fixture: ComponentFixture<RideListComponent>;

  let rideListServiceStub: {
    getRides: () => Observable<Ride[]>,
    getUsers: () => Observable<User[]>
  };

  beforeEach(() => {
    rideListServiceStub = {
      getRides: () => Observable.create(observer => {
        observer.error('Error-prone observable');
      }),
      getUsers: () => Observable.create(observer => {
        observer.error('Error-prone observable');
      })
    };

    TestBed.configureTestingModule( {
      imports: [FormsModule, CustomModule],
      declarations: [RideListComponent],
      providers: [{provide: RideListService, useValue: rideListServiceStub}]
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
    expect(rideList.rides).toBeUndefined();
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
    departureTime: '5:00pm',
    departureDate: 'December 25th, 2019',
    notes: 'I do not like the smell of smoke.'
  };
  const newId = 'Danial_id';

  let calledRide: Ride;

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
      imports: [FormsModule, CustomModule],
      declarations: [RideListComponent],
      providers: [
        {provide: RideListService, useValue: rideListServiceStub},
        {provide: MatDialog, useValue: mockMatDialog},
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
    expect(calledRide).toBeNull();
    rideList.openAddDialog();
    expect(calledRide).toEqual(newRide);
  });
});

describe('Editing a ride',()=> {
  let rideList: RideListComponent;
  let fixture: ComponentFixture<RideListComponent>;
  const currentRide: Ride = {
    driver: 'Danial Donald',
    destination: 'Becker',
    origin: 'Morris',
    roundTrip: true,
    driving: true,
    departureTime: '5:00pm',
    departureDate: 'December 25th, 2019',
    notes: 'I do not like the smell of smoke.'
  };
  const newId = 'Danial_id';

  let calledRide: Ride;

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
      imports: [FormsModule, CustomModule],
      declarations: [RideListComponent],
      providers: [
        {provide: RideListService, useValue: rideListServiceStub},
        {provide: MatDialog, useValue: mockMatDialog},
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
    expect(calledRide).toBeNull();
    rideList.openEditDialog(currentRide._id, currentRide.driver, currentRide.destination, currentRide.origin, currentRide.roundTrip, currentRide.driving, currentRide.departureDate, currentRide.departureTime, currentRide.mpg, currentRide.notes);
    expect(calledRide).toEqual(currentRide);
  });
});

describe('Deleting a ride',()=> {
  let rideList: RideListComponent;
  let fixture: ComponentFixture<RideListComponent>;
  const currentRide: Ride = {
    driver: 'Danial Donald',
    destination: 'Becker',
    origin: 'Morris',
    roundTrip: true,
    departureTime: '5:00pm',
    departureDate: 'December 25th, 2019',
    notes: 'I do not like the smell of smoke.'
  };
  const newId = 'Danial_id';

  let calledRide: Ride;

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
      imports: [FormsModule, CustomModule],
      declarations: [RideListComponent],
      providers: [
        {provide: RideListService, useValue: rideListServiceStub},
        {provide: MatDialog, useValue: mockMatDialog},
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
    expect(calledRide).toBeNull();
    rideList.openDeleteDialog(currentRide);
    expect(calledRide).toEqual(currentRide);
  });
});
