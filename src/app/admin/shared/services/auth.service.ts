import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FbAuthResponse, User } from '../../../shared/interfaces';
import { Observable, Subject, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { catchError, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public error$ = new Subject<string>();

  constructor(private http: HttpClient) {}

  public login(user: User): Observable<any> {
    return this.http
      .post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`,
        user
      )
      .pipe(tap(this.setToken), catchError(this.handleError.bind(this)));
  }

  public logout(): void {
    try {
      localStorage.clear();
    } catch (e) {
      console.warn(e);
    }
  }

  public get token(): string {
    try {
      const expDate = new Date(localStorage.getItem('fb-token-exp'));
      if (new Date() > expDate) {
        this.logout();

        return null;
      }

      return localStorage.getItem('fb-token');
    } catch (e) {
      console.warn(e);
    }
  }

  public isAuthenticated(): boolean {
    return Boolean(this.token);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const { message } = error.error.error;

    switch (message) {
      case 'INVALID_EMAIL':
        this.error$.next('Неверный email');
        break;
      case 'INVALID_PASSWORD':
        this.error$.next('Неверный password');
        break;
      case 'EMAIL_NOT_FOUND':
        this.error$.next('Такого email не существует');
        break;
      default:
        this.error$.next('Что-то пошло не так');
    }

    return throwError(message);
  }

  private setToken(response: FbAuthResponse): void {
    const expDate = new Date(Date.now() + Number(response.expiresIn) * 1000);
    try {
      localStorage.setItem('fb-token', response.idToken);
      localStorage.setItem('fb-token-exp', expDate.toString());
    } catch (e) {
      console.warn(e);
    }
  }

  clearError(): void {
    this.error$.next(null);
  }
}
