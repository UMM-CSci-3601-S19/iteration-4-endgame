# Client Testing with Google OAUTH 2.0

Writing unit tests that depend on AuthService (that implements Google OAUTH 2.0) can seem impossible without two key
features:

1) (In auth.service.ts)  Don't use static methods in AuthService. Make AuthService injectable.
2) (In the unit tests) How to inject methods needed in the unit tests with stubs

## Injectables > Static Methods
Calls to static methods are a lot harder, potentially impossible, to properly mock for testing. Each unit test needs
an AuthService stub of its own. If AuthService's methods are static, unit tests try access the methods directly from
AuthService, effectively bypassing any authServiceStubs that need to be created.

It is better practice in Angular to use an injectable in place of static methods. We mean two things by injectable. 
First of all, auth.service.ts needs to declare @Injectable above its class declaration:
```typescript
@Injectable()
export class AuthService implements CanActivate, OnInit{
  //...
}
```
Additionally, AuthService needs to be constructed in whatever component that needs to use it and have an instance 
declared.

```typescript
export class RideListComponent implements OnInit {

  public auth: AuthService;    //declare the field here
  //....

  constructor(public rideListService: RideListService, public dialog: MatDialog, private authService: AuthService) {
    this.auth = authService;    //pass in authService into the constructor and then create an instance of it inside
  }
```

By following all of those rules, you should be able to create an [authServiceStub.](https://github.com/UMM-CSci-3601-S19/iteration-4-endgame/commit/9f68640730914f344da409694503feae6398f085#diff-35a4102284b8f6a18c7a199c717f8351)

## Using stubs to mock AuthService

The Auth Service needs to share all of its methods and fields that are used in any way by the 
component you are testing.

For the sake of example, ride-list.component and its unit tests in ride-list-component.spec.ts will be used. 

Notice in ride-list.component that the method [refreshRides()](https://github.com/UMM-CSci-3601-S19/iteration-4-endgame/commit/9f68640730914f344da409694503feae6398f085#diff-59db8952d73dfe317f65c6187d2b7d14R215) calls two AuthService (aliased as 'auth') methods.

```typescript
  refreshRides(): Observable<Ride[]> {
    const rides: Observable<Ride[]> = this.rideListService.getRides();
    this.loggedId = this.auth.getUserId();                            //AuthService Method #1
    this.loggedName = this.auth.getUserName();                        //AuthService Method #2
    rides.subscribe(
      rides => {
        this.rides = rides;
        this.filterRides(this.rideDestination);
      },
      err => {
        console.log(err);
      });
    return rides;
  }
```

Those methods as a result will need to be mocked in the authServiceStub in ride-list-component.spec.ts, 
in [authServiceStub.](https://github.com/UMM-CSci-3601-S19/iteration-4-endgame/commit/9f68640730914f344da409694503feae6398f085#diff-35a4102284b8f6a18c7a199c717f8351L27) This declaration is like declaring an interface of the methods uses from AuthService.


```typescript
  let authServiceStub: {
    getUserId: () => String,
    getUserName: () => String,
    loadClient: () => null;  //this is called in HomeComponent.ts, so it is needed in mocking too
  };
```

The [authServiceStub's](https://github.com/UMM-CSci-3601-S19/iteration-4-endgame/commit/cee25fddae99cc8732deda90c35ad2f21d944d40#diff-35a4102284b8f6a18c7a199c717f8351L169) methods then needs to be also declared in the beforeEach() of whatever test uses AuthService. 
This actually instantiates the authServiceStub from above with real values to be used in testing. 

```typescript
    authServiceStub = {
      getUserId: () => "MI6007",
      getUserName: () => "James Bond",
      loadClient: () => null,
    };
```

It is one thing to create the authServiceStub interface and then implement it, but without one last part it is effectively useless. Why?
The tests don't inherently know that the authServiceStub is related to AuthService. They just happen to have the same methods and 
variable names. 

You need to tell the TestBed.configureTestingModule to provide AuthService as a service in the `providers` part of the TestBed, 

`provide: AuthService`

and then use the values provided by the stub

`useValue: authServiceStub`

```typescript
    TestBed.configureTestingModule({
      imports: [FormsModule, CustomModule, RouterTestingModule, HttpClientModule],
      declarations: [RideListComponent],
      providers: [
        {provide: RideListService, useValue: rideListServiceStub},
        {provide: MatDialog, useValue: mockMatDialog},
        {provide: AuthService, useValue: authServiceStub},              // AuthService
        
      ]
    });
```

### Additional information that may be needed in the stubs

```typescript
  let authServiceStub: {
    ///...
    isSignedIn: () => boolean,     
    gapi: any                      
  };

  //...

  authServiceStub = {
    //...
    isSignedIn: () => true,
    gapi: ""
  };
```

Additionally, the following *may* need to be in some of the beforeEach() clauses for some tests:

In `ride-list-service.spec.ts`:
```typescript
    httpClient = TestBed.get(HttpClient);
    authService = TestBed.get(AuthService);
    httpTestingController = TestBed.get(HttpTestingController);

    rideListService = new RideListService(httpClient, authService);
```
Note that HttpClient and AuthService are wrapped in Testbed.get(), rather than being declared like a normal field without the 
Testbed syntax. This is to ensure everything that everything your tests use are mocked, rather than your unit tests actually 
instantiating a real component or service and subsequently mixing mocked and real methods together. 

If `'gapi is not defined'` is thrown by a test, it may need the following. The only time we have had an issue with it is in home.component.spec.ts, as home.component initializes gapi. [Credit to timray on Stack Overflow.](https://stackoverflow.com/a/52744361) 

```typescript
    window['gapi'] = {
      load() {
        return null;
      }};
```











