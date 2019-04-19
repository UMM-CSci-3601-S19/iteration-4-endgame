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

  editInfoForm: FormGroup;

  public user: User[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {user: User}, private fb: FormBuilder) {
  }

  edit_info_validation_messages = {
    'bio': [

    ],
    'phoneNumber': [

    ]
  };

  createForms() {
    this.editInfoForm = this.fb.group({
      bio: new FormControl('bio', Validators.compose([])),
      phoneNumber: new FormControl('phoneNumber', Validators.compose([]))
    })
  }

  ngOnInit(): void {
    this.createForms();
  }
}
