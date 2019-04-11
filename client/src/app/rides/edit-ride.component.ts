import {Component, Inject, NgModule, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDatepickerModule, MatNativeDateModule} from '@angular/material';
import {Ride} from './ride';
import {FormControl, Validators, FormGroup, FormBuilder} from "@angular/forms";


@NgModule({
  imports:
    [
      MatDatepickerModule,
      MatNativeDateModule
    ]
})

@Component({
  selector: 'edit-ride.component',
  templateUrl: 'edit-ride.component.html',
})

export class EditRideComponent implements OnInit {
  editRideForm: FormGroup;
  currentDate = new Date();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { ride: Ride }, private fb: FormBuilder) {
  }

  edit_ride_validation_messages = {
    'destination': [
      {type: 'required', message: 'Destination is required'},
      {type: 'minlength', message: 'Destination must be at least 2 characters long'},
      {type: 'maxlength', message: 'Destination cannot be more than 100 characters long'},
      {type: 'pattern', message: 'Destination contains an unaccepted character'}
    ],
    'origin': [
      {type: 'required', message: 'Origin is required'},
      {type: 'minlength', message: 'Origin must be at least 2 characters long'},
      {type: 'maxlength', message: 'Origin cannot be more than 100 characters long'},
      {type: 'pattern', message: 'Origin contains an unaccepted character'}
    ],
    'departureDate': [
      {type: 'required', message: 'Date of departure is required'},
      {type: 'matDatepickerMin', message: 'Date of departure cannot have already occurred'}
    ],
    'departureTime': [

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
    this.editRideForm = this.fb.group({
      destination: new FormControl('destination', Validators.compose([

        Validators.pattern('^[ a-zA-Z0-9.,\']+$'),
        Validators.minLength(2),
        Validators.maxLength(100),
        Validators.required
      ])),
      driver: new FormControl('driver', Validators.compose([
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.required,
        Validators.pattern('^[A-Za-z0-9\\s]+[A-Za-z0-9\\s]+$(\\.0-9+)?')
      ])),
      origin: new FormControl('origin', Validators.compose([
        Validators.minLength(2),
        Validators.maxLength(100),
        Validators.required,
        Validators.pattern('^[ a-zA-Z0-9.,\']+$')
      ])),
      departureDate: new FormControl('departureDate', Validators.compose([
        Validators.required
      ])),
      departureTime: new FormControl('departureTime', Validators.compose([

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
