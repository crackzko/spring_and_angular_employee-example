import { environment } from './../../environments/environment';
import { Injectable, OnDestroy } from '@angular/core';
import { Employee } from './employee.model';
import { Observable, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmployeeApiService implements OnDestroy {

  private endpointUrl: string;
  private subscriptions = new Array<Subscription>();

  constructor(private httpClient: HttpClient) {
    this.endpointUrl = `${environment.apiUrl}/employee`;
  }


  public count(): Observable<number> {
    return this.httpClient.get<number>(`${this.endpointUrl}/count`);
  }

  public readAll(): Observable<Array<Employee>> {
    return this.httpClient.get<Array<Employee>>(this.endpointUrl);
  }

  public readPaginated(page: number, limit: number): Observable<Array<Employee>> {

    let url = this.endpointUrl;
    const pageParam = (page > 0) ? `page=${page}` : undefined;
    const limitParam = (limit > 0) ? `limit=${limit}` : undefined;

    if (pageParam !== undefined || limitParam !== undefined) {
      url += '?';

      if (pageParam !== undefined && limitParam !== undefined) {
        url += pageParam + '&' + limitParam;
      } else if (pageParam !== undefined) {
        url += pageParam;
      } else if (limitParam !== undefined) {
        url += limitParam;
      }

    }

    return this.httpClient.get<Array<Employee>>(url);
  }

  public upsert(employee: Employee): Observable<any> {
    return this.httpClient.post(this.endpointUrl, employee);
  }

  public delete(id: number): Observable<any> {
    return this.httpClient.delete(`${this.endpointUrl}/${id}`);
  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
}
