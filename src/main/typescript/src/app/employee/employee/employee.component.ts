import { Subscription } from 'rxjs';
import { EmployeeApiService } from './../employee-api.service';
import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Employee } from '../employee.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit, OnDestroy {

  private subscriptions = new Array<Subscription>();
  @Input()
  employee?: Employee;

  // tslint:disable-next-line: no-output-on-prefix
  @Output()
  public onDelete = new EventEmitter<Employee>();

  constructor(
    private apiService: EmployeeApiService,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }


  public delete(): void {
    if (this.employee && this.employee?.id >= 0) {
      this.subscriptions.push(
        this.apiService.delete(this.employee.id).subscribe(
          () => {
            this.onDelete.emit(this.employee);
          },
          () => this.showError(`Can't delete ${this.employee?.firstName} ${this.employee?.lastName}. It's like he is in an union or something...`)
        ));
    }
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
