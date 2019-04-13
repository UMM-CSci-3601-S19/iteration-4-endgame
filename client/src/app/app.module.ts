import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {Routing} from './app.routes';
import {APP_BASE_HREF} from '@angular/common';

import {RideListComponent} from "./rides/ride-list.component";
import {RideListService} from "./rides/ride-list.service";
import {AddRideComponent} from "./rides/add-ride.component";
import {EditRideComponent} from "./rides/edit-ride.component";
import {DeleteRideComponent} from "./rides/delete-ride.component";

import {MatFormFieldModule} from '@angular/material';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';

import {CustomModule} from './custom.module';
import {UserProfileComponent} from "./users/user-profile.component";
import {UserService} from "./users/user-service";
import {EditUserComponent} from "./users/edit-user.component";
import {MatDatepickerModule, MatNativeDateModule} from "@angular/material";



@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    Routing,
    CustomModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    UserProfileComponent,
    RideListComponent,
    AddRideComponent,
    EditRideComponent,
    EditUserComponent,
    DeleteRideComponent
  ],
  providers: [
    RideListService,
    UserService,
    {provide: APP_BASE_HREF, useValue: '/'},
  ],
  entryComponents: [
    AddRideComponent,
    EditRideComponent,
    EditUserComponent,
    DeleteRideComponent
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
