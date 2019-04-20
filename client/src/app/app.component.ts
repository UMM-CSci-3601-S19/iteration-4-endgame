import {Component} from '@angular/core';
import {AuthService} from "./auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Mongo-Angular-Spark lab';
  private auth: AuthService;

  constructor(private authService: AuthService) {
    this.auth = authService;
  }
}
