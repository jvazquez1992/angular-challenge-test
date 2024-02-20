import { Injectable } from '@angular/core';
import { enviroment } from '../../enviroments/enviroment';
import { Observable, catchError, of, throwError } from 'rxjs';
import { FinancialProduct } from '../model/financial-product';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FinancialProductsService {

  private SERVICE_NAME = 'bp/products';

  private BASE_URL = enviroment.URL_FINANCIAL_PRODUCTS;

  private AUTHOR_ID = enviroment.AUTHOR_ID;

  constructor(
    private http: HttpClient
  ) { }

  httpOptions = {
    headers: new HttpHeaders({ 'authorId': this.AUTHOR_ID, 'Content-Type':'application/json'})
  };
  
  options = {
    headers: new HttpHeaders({ 'authorId': this.AUTHOR_ID, 'Content-Type':'application/json'}),
    responseType: 'text' as 'json'
  };

  optionsVerify = {
    headers: new HttpHeaders({ 'authorId': this.AUTHOR_ID, 'Content-Type':'application/json'}),
    responseType: 'boolean' as 'json'
  };

  getFinancialProducts(): Observable<FinancialProduct[]>{
    const url = this.BASE_URL+this.SERVICE_NAME;
    return this.http.get<FinancialProduct[]>(url, this.httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }

  postFinancialProducts(financialProduct: FinancialProduct): Observable<FinancialProduct>{
    const url = this.BASE_URL+this.SERVICE_NAME;
    return this.http.post<FinancialProduct>(url,JSON.stringify(financialProduct),this.httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }

  putFinancialProducts(financialProduct: FinancialProduct): Observable<FinancialProduct>{
    const url = this.BASE_URL+this.SERVICE_NAME;
    return this.http.put<FinancialProduct>(url,JSON.stringify(financialProduct),this.httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }

  deleteFinancialProducts(financialProductId: string): Observable<String>{
    const url = this.BASE_URL+this.SERVICE_NAME+'?id='+financialProductId;
    return this.http.delete<String>(url,this.options)
    .pipe(
      catchError(this.handleError)
    );
  }

  verifyFinancialProducts(financialProductId: string): Observable<boolean>{
    const url = this.BASE_URL+this.SERVICE_NAME+'/verification?id='+financialProductId;
    return this.http.get<boolean>(url,this.optionsVerify)
    .pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    return throwError(() => new Error(error.error));
  }
}
