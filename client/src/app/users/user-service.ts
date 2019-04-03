import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {User} from "./user";

@Injectable()
export class UserService {
  readonly baseUrl: string = environment.API_URL + 'users';
  private userUrl: string = this.baseUrl;
  private http: HttpClient;

  constructor(private client: HttpClient) {
    this.http = client;
  }

  getUsers(userID?: string): Observable<User[]> {
    // this.filterByUserID(userID);
    // return this.http.get<User[]>(this.userUrl);
    if (userID == null) {
      let url: string = this.userUrl;
      return this.http.get<User[]>(url);
    } else {
      let url: string = this.userUrl + "/" + userID;
      return this.http.get<User[]>(url);
    }
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
}
