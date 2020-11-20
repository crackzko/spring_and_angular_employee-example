import { EmployeeEditComponent } from './../employee-edit/employee-edit.component';
import { Subscription } from 'rxjs';
import { EmployeeApiService } from './../employee-api.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Employee } from '../employee.model';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit, OnDestroy {

  employees = new Array<Employee>();
  length = 100;
  pageSize = 2;
  pageIndex = 0;
  pageSizeOptions: number[] = [1, 2, 5];
  private subscriptions = new Array<Subscription>();


  constructor(
    private apiService: EmployeeApiService,
    private router: Router,
    private snackBar: MatSnackBar) {
    this.getTotalCount();
    this.getEmployees(this.getActualPage());
  }

  ngOnInit(): void {
  }

  private getActualPage(): PageEvent {
    const event = new PageEvent();
    event.pageIndex = this.pageIndex;
    event.pageSize = this.pageSize;
    return event;
  }

  private getTotalCount(): void {
    this.subscriptions.push(this.apiService.count().subscribe(
      (amount) => this.length = amount,
      (error) => console.log(error)
    ));
  }

  public getEmployees(event?: PageEvent): void {
    if (event !== null && event !== undefined) {
      this.pageIndex = event.pageIndex;
      this.pageSize = event.pageSize;
      this.subscriptions.push(this.apiService.readPaginated(event.pageIndex, event.pageSize).subscribe(
        (employees) => this.employees = employees,
        () => this.showError(`Can't find any employes... like if you were the boss and need somethin he?!`)
      ));
    }
  }

  public onDelete(employee: Employee): void {
    this.getEmployees(this.getActualPage());
    this.getTotalCount();
  }

  public gotoEdit(): void {
    this.router.navigate(['/edit']);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe);
  }

  private showError(error: string): void {
    this.snackBar.open(error, 'OK', {
      panelClass: ['errorSnackBar']
    });
  }
}
