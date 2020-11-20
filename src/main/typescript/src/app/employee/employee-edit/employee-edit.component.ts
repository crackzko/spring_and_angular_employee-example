import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EmployeeApiService } from './../employee-api.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Employee } from '../employee.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.scss']
})
export class EmployeeEditComponent implements OnInit {

  private textValidators = [Validators.required, Validators.maxLength(128), Validators.pattern('^[a-zA-Z0-9_.-]*$')];

  firstNameControl = new FormControl('', this.textValidators);
  lastNameControl = new FormControl('', this.textValidators);
  positionControl = new FormControl('', this.textValidators);

  employees = new Array<Employee>();
  editFormGroup: FormGroup = this.formBuilder.group({
    firstName: this.firstNameControl,
    lastName: this.lastNameControl,
    position: this.positionControl,
  });

  supervisor?: any;
  private subscriptions = Array<Subscription>();

  constructor(
    private apiService: EmployeeApiService,
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.subscriptions.push(this.apiService.readAll().subscribe(
      (employees) => this.employees = employees,
      () => this.showError('could not get supervisors. Please try later')
    ));
  }

  onSubmit(): void {
    const employee = new Employee();
    employee.firstName = this.editFormGroup.value.firstName;
    employee.lastName = this.editFormGroup.value.lastName;
    employee.position = this.editFormGroup.value.position;
    if (this.supervisor) {
      employee.supervisor = this.supervisor;
    }

    this.apiService.upsert(employee).subscribe(
      () => { this.goHome(); },
      () => this.showError('could not save, employe. Please try later')
    );
  }

  private showError(error: string): void {
    this.snackBar.open(error, 'OK', {
      panelClass: ['errorSnackBar']
    });
  }

  onChange($event: any): void {
    console.dir($event);
  }

  goHome(): void {
    this.router.navigate(['']);
  }

}
