import {Component, Inject, NgModule, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDatepickerModule, MatNativeDateModule} from '@angular/material';
import {Ride} from './ride';
import {FormControl, Validators, FormGroup, FormBuilder} from "@angular/forms";
import {User} from "../users/user";

@NgModule({
  imports:
    [
      MatDatepickerModule,
      MatNativeDateModule
    ]
})

@Component({
  selector: 'add-ride.component',
  templateUrl: 'add-ride.component.html',
})

export class AddRideComponent implements OnInit {
  addRideForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { ride: Ride, users: User[] }, private fb: FormBuilder) {
  }

  add_ride_validation_messages = {
    'destination': [
      {type: 'required', message: 'Destination is required'},
      {type: 'minlength', message: 'Destination must be at least 2 characters long'},
      {type: 'maxlength', message: 'Destination cannot be more than 100 characters long'},
      {type: 'pattern', message: 'Destination contains an unaccepted character'}
    ],
    'ownerId': [
      {type: 'required', message: 'Owner is required'}
    ],
    'origin': [
      {type: 'required', message: 'Origin is required'},
      {type: 'minlength', message: 'Origin must be at least 2 characters long'},
      {type: 'maxlength', message: 'Origin cannot be more than 100 characters long'},
      {type: 'pattern', message: 'Origin contains an unaccepted character'}
    ],
    'departureTime': [
      {type: 'required', message: 'Departure Time is required'},
      {type: 'minlength', message: 'Departure Time must be at least 2 characters long'},
      {type: 'maxlength', message: 'Departure Time cannot be more than 100 characters long'},
    ],
    'mpg': [
      {type: 'min', message: 'MPG is too low, not reasonable'},
      {type: 'max', message: 'MPG is too high, are you crazy!?'},
      {type: 'pattern', message: 'MPG must be a number'}
    ],
    'notes': [
      {type: 'minlength', message: 'Notes must be at least 2 characters long'},
      {type: 'maxlength', message: 'Notes cannot be more than 150 characters long'},
      {type: 'pattern', message: 'notes must contain only english and certain symbols'}
    ]
  };

  createForms() {
    this.addRideForm = this.fb.group({
      destination: new FormControl('destination', Validators.compose([

        Validators.pattern('^[ a-zA-Z0-9.,\']+$'),
        Validators.minLength(2),
        Validators.maxLength(100),
        Validators.required
      ])),
      ownerId: new FormControl('ownerId', Validators.compose([
        Validators.required
      ])),
      origin: new FormControl('origin', Validators.compose([
        Validators.minLength(2),
        Validators.maxLength(100),
        Validators.required,
        Validators.pattern('^[ a-zA-Z0-9.,\']+$')
      ])),
      departureTime: new FormControl('departureTime', Validators.compose([
        Validators.minLength(2),
        Validators.maxLength(100),
        Validators.required
      ])),
      mpg: new FormControl('mpg', Validators.compose([
        Validators.min(1),
        Validators.max(200),
        Validators.pattern('\\d+')
      ])),
      notes: new FormControl('notes', Validators.compose([
        Validators.minLength(2),
        Validators.maxLength(150),
        Validators.pattern('^[?\'"></!@#$%^&*()_+= a-zA-Z0-9:.,_-]+$')
      ]))

    })
  }

  ngOnInit() {
    this.createForms();
  }

}
