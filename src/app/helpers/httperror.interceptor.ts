import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse} from '@angular/common/http'; 
import { Observable, throwError } from 'rxjs'; 
import { retry, catchError } from 'rxjs/operators';    
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor { 

    constructor(private router: Router){}     

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {  
        return next.handle(request).pipe(  
          retry(1), 
          catchError((error: HttpErrorResponse) => {
   
            let errorMessage = '';
   
            if (error.error instanceof ErrorEvent) {
              // client-side error 
              errorMessage = `Error: ${error.error.message}`;  
            } else {
              // server-side error

              switch (error.status) {
                case 403: this.router.navigate(["forbidden"]);
                case 404: this.router.navigate(["notfound"]);                
              }

              errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;   
            }
   
            return throwError(errorMessage);  
          })  
        ) 
    }
}