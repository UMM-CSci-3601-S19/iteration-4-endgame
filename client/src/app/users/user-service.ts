import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {User} from "./user";

@Injectable()
export class UserService {
  readonly baseUrl: string = environment.API_URL + 'user';
  private userUrl: string = this.baseUrl;
  private http: HttpClient;

  constructor(private client: HttpClient) {
    this.http = client;
  }

  getUserById(userID: string): Observable<User> {
    let url: string = this.userUrl + "/" + userID;
    return this.http.get<User>(url);
  }

  getUsers(): Observable<User[]> {
    let url: string = this.userUrl;
    return this.http.get<User[]>(url);
  }

  // private parameterPresent(searchParam: string) {
  //   return this.userUrl.indexOf(searchParam) !== -1;
  // }
  //
  // private removeParameter(searchParam: string) {
  //   let start = this.userUrl.indexOf(searchParam);
  //   let end = 0;
  //   if (this.userUrl.indexOf('&') !== -1) {
  //     end = this.userUrl.indexOf('&', start) + 1;
  //   } else {
  //     end = this.userUrl.indexOf('&', start);
  //   }
  //   this.userUrl = this.userUrl.substring(0, start) + this.userUrl.substring(end);
  // }

  editUser(editedUser: User): Observable<string> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: 'text' as 'json'
    };

    return this.http.post<string>(this.userUrl + '/editProfile', editedUser, httpOptions);
  }
}
