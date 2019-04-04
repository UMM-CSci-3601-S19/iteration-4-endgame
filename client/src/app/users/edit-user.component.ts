import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {User} from './user';
import {FormControl, Validators, FormGroup, FormBuilder} from "@angular/forms";


@Component({
  selector: 'edit-user.component',
  templateUrl: 'edit-user.component.html',
})

export class EditUserComponent implements OnInit {
  currentId: string;

  public user: User[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {
  }
  ngOnInit(): void {
  }
}
