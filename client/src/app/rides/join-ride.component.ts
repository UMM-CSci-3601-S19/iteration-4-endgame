import {MAT_DIALOG_DATA} from "@angular/material";
import {Component, Inject, OnInit} from "@angular/core";
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'join-ride.component',
  templateUrl: 'join-ride.component.html'
})

export class JoinRideComponent implements OnInit {
  currentId: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id : Object }, private fb: FormBuilder) {
  }
  ngOnInit(): void {
  }
}
