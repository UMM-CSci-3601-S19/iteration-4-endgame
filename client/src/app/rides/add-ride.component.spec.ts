import {AddRideComponent} from "./add-ride.component";
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {CustomModule} from "../custom.module";
import {MAT_DIALOG_DATA, MatDatepickerModule, MatDialogRef} from "@angular/material";
import {By} from "@angular/platform-browser";
import {NgForm} from "@angular/forms";

describe('Add ride component', () => {

  let addRideComponent: AddRideComponent;
  let calledClose: boolean;
  const mockMatDialogRef = {
    close() {
      calledClose = true;
    }
  };
  let fixture: ComponentFixture<AddRideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CustomModule, MatDatepickerModule],
      declarations: [AddRideComponent],
      providers: [
        {provide: MatDialogRef, useValue: mockMatDialogRef},
        {provide: MAT_DIALOG_DATA, useValue: null}
      ]
    }).compileComponents().catch(error => {
      return expect(error).toBeNull();
    });
  }));

  beforeEach(() => {
    calledClose = false;
    fixture = TestBed.createComponent(AddRideComponent);
    addRideComponent = fixture.componentInstance;
  });

  it('destination should not allow any unaccepted characters', async(() => {
    let fixture = TestBed.createComponent(AddRideComponent);
    let debug = fixture.debugElement;
    let input = debug.query(By.css('[name=destination]'));

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      input.nativeElement.value = '$Dolla-Dolla Bills Y\'all (In Japanese)';
      dispatchEvent(input.nativeElement);
      fixture.detectChanges();

      let form: NgForm = debug.children[0].injector.get(NgForm);
      let control = form.control.get('destination');
      let exp1 = expect(control.hasError('Destination contains an unaccepted character')).toBe(true);
      let exp2 = expect(form.control.valid).toEqual(false);
      let exp3 = expect(form.control.hasError('Destination contains an unaccepted character', ['destination'])).toEqual(true);

      input.nativeElement.value = 'Real Destination';
      dispatchEvent(input.nativeElement);
      fixture.detectChanges();

      let exp4 = expect(control.hasError('Destination contains an unaccepted character')).toBe(false);
      let exp5 = expect(form.control.valid).toEqual(true);
      let exp6 = expect(form.control.hasError('Destination contains an unaccepted character', ['destination'])).toEqual(false);

      return exp1 && exp2 && exp3 && exp4 && exp5 && exp6;
    });
  }))
});
