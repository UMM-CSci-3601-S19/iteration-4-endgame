import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../environments/environment';
import {Ride} from "./ride";
import {User} from "../users/user"
import {AuthService} from "../auth.service";

@Injectable()
export class RideListService {
  readonly baseUrl: string = environment.API_URL + 'rides';
  private rideUrl: string = this.baseUrl;
  private auth: AuthService;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.auth = authService;
  }

  getRides(rideDriving?: string): Observable<Ride[]> {
    this.filterByDriving(rideDriving);
    let url = this.rideUrl;
    this.rideUrl = this.baseUrl;
    return this.http.get<Ride[]>(url);
  }

  getUserRides(userId: string): Observable<Ride[]> {
    return this.http.get<Ride[]>(environment.API_URL + 'rides/' + userId);
  }

  //This could be changed into a getRideById if we decide to ad id as a field
  getRideByDestination(destination: string): Observable<Ride> {
    return this.http.get<Ride>(this.rideUrl + '/' + destination);
  }

  filterByDriving(rideDriving?: string): void {
    if (!(rideDriving == null)) {
      if (this.parameterPresent('driving=')) {
        // there was a previous search by destination that we need to clear
        this.removeParameter('driving=');
      }
      if (this.rideUrl.indexOf('?') !== -1) {
        // there was already some information passed in this url
        this.rideUrl += 'driving=' + rideDriving + '&';
      } else {
        // this was the first bit of information to pass in the url
        this.rideUrl += '?driving=' + rideDriving + '&';
      }
    } else {
      // there was nothing in the box to put onto the URL... reset
      if (this.parameterPresent('driving=')) {
        let start = this.rideUrl.indexOf('driving=');
        const end = this.rideUrl.indexOf('&', start);
        if (this.rideUrl.substring(start - 1, start) === '?') {
          start = start - 1;
        }
        this.rideUrl = this.rideUrl.substring(0, start) + this.rideUrl.substring(end + 1);
      }
    }
  }

  private parameterPresent(searchParam: string) {
    return this.rideUrl.indexOf(searchParam) !== -1;
  }

  //remove the parameter and, if present, the &
  private removeParameter(searchParam: string) {
    let start = this.rideUrl.indexOf(searchParam);
    let end = 0;
    if (this.rideUrl.indexOf('&') !== -1) {
      end = this.rideUrl.indexOf('&', start) + 1;
    } else {
      end = this.rideUrl.indexOf('&', start);
    }
    this.rideUrl = this.rideUrl.substring(0, start) + this.rideUrl.substring(end);
  }

  addNewRide(newRide: any): Observable<string> {
    const httpOptions = {
      headers: new HttpHeaders({
        // We're sending JSON
        'Content-Type': 'application/json'
      }),
      // But we're getting a simple (text) string in response
      // The server sends the hex version of the new ride back
      // so we know how to find/access that ride again later.
      responseType: 'text' as 'json'
    };
    newRide.idtoken = this.auth.getIdToken();

    // Send post request to add a new ride with the ride data as the body with specified headers.
    return this.http.post<string>(this.rideUrl + '/new', newRide, httpOptions);
  }

  editRide(editedRide: any): Observable<string> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: 'text' as 'json'
    };
    editedRide.idtoken = this.auth.getIdToken();
    return this.http.post<string>(this.rideUrl + '/update', editedRide, httpOptions);
  }

  joinRide(joinedRide: any): Observable<string> { //is there a less janky way of putting idtoken in the request than letting joinedRide: any?
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: 'text' as 'json'
    };
    let document: any = {};
    document.rideId = joinedRide;
    document.idtoken = this.auth.getIdToken();
    return this.http.post<string>(this.rideUrl + '/addRider', document, httpOptions);
  }

  deleteRide(deleteId: String): Observable<string> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: 'text' as 'json'
    };
    let deleteDoc: Object = new Object({
      _id: deleteId,
      idtoken: this.auth.getIdToken(),
    });
    return this.http.post<string>(this.rideUrl + '/remove', deleteDoc, httpOptions);
  }

  getUsers(): Observable<User[]> {
    let url : string = environment.API_URL + "users";
    return this.http.get<User[]>(url);
  };
}
