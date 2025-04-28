import { Injectable, NgModule } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, retryWhen, mergeMap, finalize } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Interface for API error response
interface ApiErrorResponse {
  status: number;
  message: string;
  details?: any;
}

// HTTP Interceptor for Error Handling
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  // Define transient error status codes
  private transientErrorStatusCodes = [0, 408, 429, 500, 502, 503, 504];

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => this.handleHttpError(error)),
      // Retry logic for transient errors
      retryWhen((errors) =>
        errors.pipe(
          mergeMap((error, attempt) => {
            // Allow up to 3 retries for transient errors
            if (attempt >= 3 || !this.isTransientError(error)) {
              return throwError(() => error);
            }
            // Exponential backoff: 1s, 2s, 4s
            const delay = Math.pow(2, attempt) * 1000;
            return timer(delay);
          })
        )
      )
    );
  }

  private isTransientError(error: HttpErrorResponse): boolean {
    return this.transientErrorStatusCodes.includes(error.status);
  }

  private handleHttpError(error: HttpErrorResponse): Observable<never> {
    const apiError: ApiErrorResponse = {
      status: error.status,
      message: this.getErrorMessage(error),
      details: error.error
    };

    // Log error to external service (e.g., Sentry) in production
    if (environment.production) {
      console.error('API Error:', apiError);
      // Add your logging service here
    }

    return throwError(() => apiError);
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      return `Client-side error: ${error.error.message}`;
    }
    // Server-side error
    return error.error?.message || `Server error: ${error.status} ${error.statusText}`;
  }
}

// API Service
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://api.example.com';

  constructor(private http: HttpClient) {}

  // Example GET request with error handling
  getData<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`).pipe(
      catchError((error: ApiErrorResponse) => {
        // Handle specific error cases
        if (error.status === 401) {
          // Handle unauthorized (e.g., redirect to login)
          // this.authService.logout();
        }
        return throwError(() => error);
      })
    );
  }

  // Example POST request
  postData<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, data).pipe(
      catchError((error: ApiErrorResponse) => throwError(() => error))
    );
  }
}

// Example Component
@Component({
  selector: 'app-data',
  template: `
    <div *ngIf="error" class="error-message">
      {{ error.message }}
    </div>
    <div *ngIf="data">
      <!-- Display data -->
    </div>
    <div *ngIf="loading">Loading...</div>
  `
})
export class DataComponent implements OnInit {
  data: any;
  error: ApiErrorResponse | null = null;
  loading = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.loading = true;
    this.apiService.getData<any>('data-endpoint')
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (response) => {
          this.data = response;
          this.error = null;
        },
        error: (err: ApiErrorResponse) => {
          this.error = err;
          this.data = null;
        }
      });
  }
}

// Module to register the interceptor
@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ]
})
export class ApiModule {}
