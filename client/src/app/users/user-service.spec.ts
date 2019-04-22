// import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
// import {TestBed} from "@angular/core/testing";
// import {HttpClient} from "@angular/common/http";
//
// import {User} from "./user";
// import {UserService} from "./user-service";
// import {AuthService} from "../auth.service";
//
//
// describe('User list service: ', () => {
//   const testUsers: User[] = [
//     {
//       _id: {
//         $oid: 'userOneId'
//       },
//       name: 'testUserNumeroUno',
//       bio: 'There is currently nothing written here',
//       email: 'email@one.com',
//       phoneNumber: '(111) 111-1111'
//     },
//     {
//       _id: {
//         $oid: '5ca243f02047785213e10d03'
//       },
//       name: 'testUserNumeroDos',
//       bio: 'There is currently nothing written here',
//       email: 'email@two.com',
//       phoneNumber: '(222) 222-2222'
//     },
//     {
//       _id: {
//         $oid: '5ca243f04e7664997cbc9119'
//       },
//       name: 'testUserNumeroTres',
//       bio: 'There is currently nothing written here',
//       email: 'email@three.com',
//       phoneNumber: '(333) 333-3333'
//     }
//   ];
//
//   let userService: UserService;
//
//   let httpClient: HttpClient;
//   let httpTestingController: HttpTestingController;
//
//   let authServiceStub: {
//     isSignedIn: () => boolean;
//   };
//
//   beforeEach(() => {
//     authServiceStub = {
//       isSignedIn: () => true
//     };
//
//     TestBed.configureTestingModule({
//       imports: [HttpClientTestingModule],
//       providers: [
//         {provide: AuthService, useValue: authServiceStub},
//       ]
//     });
//
//     httpClient = TestBed.get(HttpClient);
//     httpTestingController = TestBed.get(HttpTestingController);
//
//     userService = new UserService(httpClient);
//   });
//
//   afterEach(() => {
//     httpTestingController.verify();
//   });
//
//   it('getUsers() calls api/users', () => {
//     userService.getUsers().subscribe(users => expect(users).toBe(testUsers));
//
//     const req = httpTestingController.expectOne(userService.baseUrl);
//     let exp1 = expect(req.request.method).toEqual('GET');
//     req.flush(testUsers);
//     return exp1;
//   });
//
//   it('getUserById(userID) calls api/user/*specific id*', () => {
//     let targetUser: User = testUsers[0];
//     let targetId: string = targetUser._id.$oid;
//     userService.getUserById(targetId).subscribe(user => console.log('This is the test' + user.toString()));
//
//     httpTestingController.expectOne(userService.baseUrl + "/" + targetId).flush(testUsers);
//
//     userService.getUserById(targetId).subscribe(user => expect(user).toBe(targetUser));
//
//     let req = httpTestingController.expectOne(userService.baseUrl + "/" + targetId);
//     let exp1 = expect(req.request.method).toEqual('GET');
//     req.flush(targetUser);
//     return exp1;
//   });
//
//   it('editing a profile calls api/user/editProfile', () => {
//     let editedBio = 'Its me Becky';
//     let editedPhoneNumber = '(111) 222-3333';
//     let editedProfile: User = {
//       _id: {$oid: 'Becky_id'},
//       name: 'Becky',
//       bio: 'I have nothing written here',
//       email: 'becky@basic.org',
//       phoneNumber: '(123) 456-7890',
//       totalReviewScore: 5,
//       numReviews: 5,
//       avgScore: 1
//     };
//
//     userService.editUser(editedProfile).subscribe(bio => {
//       return expect(bio).toBe(editedBio);
//       }
//     );
//
//     let req = httpTestingController.expectOne(userService.baseUrl + '/editProfile');
//     let exp1 = expect(req.request.method).toEqual('POST');
//     req.flush(editedBio);
//
//     userService.editUser(editedProfile).subscribe(phoneNumber => {
//       return expect(phoneNumber).toBe(editedPhoneNumber);
//       }
//     );
//
//     let req2 = httpTestingController.expectOne(userService.baseUrl + '/editProfile');
//     let exp2 = expect(req2.request.method).toEqual('POST');
//     req2.flush(editedPhoneNumber);
//     return exp1 && exp2;
//   });
//
//   it('rating a profile calls api/user/rateProfile', () => {
//     let ratedTotalReviewScore = '15';
//     let ratedNumReviews = '3';
//     let ratedAvgScore = '5';
//     const ratedProfile: User = {
//       _id: {$oid: 'Ridley_id'},
//       name: 'Ridley',
//       bio: 'I am a space pirate, and I stand up sometimes',
//       email: 'ridley@spacepirate.com',
//       phoneNumber: '(987) 654-3210',
//       totalReviewScore: 10,
//       numReviews: 2,
//       avgScore: 5
//     };
//
//     userService.rateUser(ratedProfile).subscribe(totalReviewScore => {
//         return expect(totalReviewScore).toBe(ratedTotalReviewScore);
//       }
//     );
//
//     let req = httpTestingController.expectOne(userService.baseUrl + '/rateProfile');
//     let exp1 = expect(req.request.method).toEqual('POST');
//     req.flush(ratedTotalReviewScore);
//
//     userService.rateUser(ratedProfile).subscribe(numReviews => {
//         return expect(numReviews).toBe(ratedNumReviews);
//       }
//     );
//
//     let req2 = httpTestingController.expectOne(userService.baseUrl + '/rateProfile');
//     let exp2 = expect(req2.request.method).toEqual('POST');
//     req2.flush(ratedNumReviews);
//
//     userService.rateUser(ratedProfile).subscribe(avgScore => {
//         return expect(avgScore).toBe(ratedAvgScore);
//       }
//     );
//
//     let req3 = httpTestingController.expectOne(userService.baseUrl + '/rateProfile');
//     let exp3 = expect(req3.request.method).toEqual('POST');
//     req3.flush(ratedAvgScore);
//     return exp1 && exp2 && exp3;
//   })
// });
