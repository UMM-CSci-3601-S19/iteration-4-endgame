import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {TestBed} from "@angular/core/testing";
import {HttpClient} from "@angular/common/http";

import {User} from "./user";
import {UserService} from "./user-service";


describe('User list service: ', () => {
  const testUsers: User[] = [
    {
      _id: {
        $oid: '5ca243f0230a5d1a43216ece'
      },
      name: 'testUserNumeroUno',
      bio: 'There is currently nothing written here',
      email: 'email@one.com',
      phoneNumber: '(111) 111-1111'
    },
    {
      _id: {
        $oid: '5ca243f02047785213e10d03'
      },
      name: 'testUserNumeroDos',
      bio: 'There is currently nothing written here',
      email: 'email@two.com',
      phoneNumber: '(222) 222-2222'
    },
    {
      _id: {
        $oid: '5ca243f04e7664997cbc9119'
      },
      name: 'testUserNumeroTres',
      bio: 'There is currently nothing written here',
      email: 'email@three.com',
      phoneNumber: '(333) 333-3333'
    }
  ];

  const userOne: User[] = testUsers.filter(user => user._id == Object({ $oid: '5ca243f0230a5d1a43216ece' }));

  let userService: UserService;

  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);

    userService = new UserService(httpClient);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('getUsers() calls api/users', () => {
    userService.getUsers().subscribe(users => expect(users).toBe(testUsers));

    const req = httpTestingController.expectOne(userService.baseUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(testUsers);
  });

  // it('getUsers(userID) calls api/users/*specific id*', () => {
  //   userService.getUsers('5ca243f0230a5d1a43216ece').subscribe(users => expect(users).toBe(userOne));
  //
  //   const req = httpTestingController.expectOne(userService.baseUrl + '/5ca243f0230a5d1a43216ece');
  //   expect(req.request.method).toEqual('GET');
  //   req.flush(testUsers);
  // });
});
