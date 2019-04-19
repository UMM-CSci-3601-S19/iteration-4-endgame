import {MAT_DIALOG_DATA} from "@angular/material";
import {Component, Inject, OnInit} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {User} from "./user";

@Component({
  selector: 'rate-user.component',
  templateUrl: 'rate-user.component.html'
})

export class RateUserComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {user: User}, private fb: FormBuilder) {

  }

  ngOnInit(): void {

  }
}
