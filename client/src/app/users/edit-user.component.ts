import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {User} from './user';
import {FormControl, Validators, FormGroup, FormBuilder, ReactiveFormsModule, NgControl} from "@angular/forms";


@Component({
  selector: 'edit-user.component',
  templateUrl: 'edit-user.component.html',
})

export class EditUserComponent implements OnInit {

  editInfoForm: FormGroup;

  public user: User[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {user: User}, private fb: FormBuilder) {
    this.editInfoForm=fb.group({
      phoneNumber:['']
    })
  }

  edit_info_validation_messages = {
    'bio': [
      {type: 'maxlength', message: 'Limit of 1500 characters'}
    ],
    'phoneNumber': [

    ]
  };

  createForms() {
    this.editInfoForm = this.fb.group({
      bio: new FormControl('bio', Validators.compose([
        Validators.maxLength(1500)
      ])),
      phoneNumber: new FormControl('phoneNumber', Validators.compose([

      ]))
    })
  }

  ngOnInit(): void {
    this.createForms();
  }
}
