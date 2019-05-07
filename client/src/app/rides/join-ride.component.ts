import {MAT_DIALOG_DATA} from "@angular/material";
import {Component, Inject, OnInit} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {Ride} from "./ride";

@Component({
  selector: 'join-ride.component',
  templateUrl: 'join-ride.component.html'
})

export class JoinRideComponent implements OnInit {
  rideId: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { rideId : String }, private fb: FormBuilder) {
  }
  ngOnInit(): void {
  }
}
