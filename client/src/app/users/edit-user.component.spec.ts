// import {async, ComponentFixture, TestBed} from "@angular/core/testing";
// import {EditUserComponent} from "./edit-user.component";
// import {PhoneMaskDirective} from "./phone-mask.directive";
// import {By} from "@angular/platform-browser";
// import {RouterTestingModule} from "@angular/router/testing";
// import {CustomModule} from "../custom.module";
// import {FormsModule} from "@angular/forms";
// import {UserService} from "./user-service";
// import {MAT_DIALOG_DATA, MatDialog} from "@angular/material";
// import {User} from "./user";
// import {Observable} from "rxjs/Observable";
// import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from "@angular/platform-browser-dynamic/testing";

// TODO: An attempt at testing the phone-mask directive, its close but not quite there, could use some work
// TODO: Also covers parts of edit-user.component, while that wasn't the main focus
// describe('edit user component', () => {
//
//   let directive;
//   let fixture: ComponentFixture<EditUserComponent>;
//   const currentUser: User = {
//     _id: {$oid: 'Becky_id'},
//     name: 'Becky',
//     bio: 'Its me Becky',
//     email: 'becky@basic.org',
//     phoneNumber: '(123) 456-7890',
//     totalReviewScore: 5,
//     numReviews: 5,
//     avgScore: 1
//   };
//
//   let newId = 'Becky_id';
//   let calledUser: User;
//
//   let userServiceStub: {
//     getUserById: () => Observable<User>,
//     editUser: (currentUser: User) => Observable<{ '$oid': string }>,
//   };
//
//   let mockMatDialog: {
//     open: (EditUserComponent, any) => {
//       afterClosed: () => Observable<User>
//     };
//   };
//
//   beforeEach(() => {
//     TestBed.resetTestEnvironment();
//     TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
//     calledUser = null;
//     userServiceStub = {
//       getUserById: () => Observable.of(),
//       editUser: (currentUser: User) => {
//         calledUser = currentUser;
//         return Observable.of({
//           '$oid': newId
//         });
//       }
//     };
//
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
//       imports: [FormsModule, CustomModule, RouterTestingModule],
//       declarations: [EditUserComponent, PhoneMaskDirective],
//       providers: [
//         {provide: UserService, useValue: userServiceStub},
//         {provide: MatDialog, useValue: mockMatDialog},
//         {provide: MAT_DIALOG_DATA, useValue:{}}
//       ]
//     });
//   });
//
//   it('should be able to test directive', async(() => {
//     TestBed.overrideComponent(EditUserComponent, {
//       set: {
//         template: '<input appPhoneMask>'
//       }
//     });
//
//     TestBed.compileComponents().then(() => {
//       fixture = TestBed.createComponent(EditUserComponent);
//       directive = fixture.debugElement.query(By.directive(PhoneMaskDirective));
//       let exp1 = expect(directive).toBeTruthy('Something unexpected occurred when using the input mask');
//
//       const directiveInstance = directive.injector.get(PhoneMaskDirective);
//       let exp2 = expect(directiveInstance(new Event('ngModelChange'), false).toBe(''));
//       // directive.nativeElement.value = '1234567890';
//       // fixture.detectChanges();
//       // directive.nativeElement.dispatchEvent(new Event('ngModelChange'));
//       // fixture.detectChanges();
//       // let exp2 = expect(directive.nativeElement.value).toBe('(123) 456-7890');
//       return exp1 && exp2;
//     });
//   }));
// });
