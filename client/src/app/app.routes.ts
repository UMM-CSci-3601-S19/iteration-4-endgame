import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {RideListComponent} from "./rides/ride-list.component";
import {UserProfileComponent} from "./users/user-profile.component";
import {AuthService} from "./auth.service";

//TODO: possibly clean up routes to not be named "badly"
// Route Configuration
export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'rides', component: RideListComponent, canActivate: [AuthService]},
  {path: 'rides/users/:userId', component: UserProfileComponent, canActivate: [AuthService]},
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(routes);
