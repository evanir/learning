import { Injectable } from '@angular/core';
import { auth } from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthOptions, AuthProvider, User } from './auth.types';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authState$: Observable<firebase.User>;

  constructor(private afAuth: AngularFireAuth) {
    this.authState$ = this.afAuth.authState;
    this.logout();
  }

  get isAuthenticated(): Observable<boolean> {
    return this.authState$.pipe(map(user => user !== null));
  }

  authenticate({ isSignIn, provider, user }: AuthOptions): Promise<auth.UserCredential> {
    let operation: Promise<auth.UserCredential>;

    if (provider !== AuthProvider.Email) {
      operation = this.singInWithPopup(provider);
    } else {
      operation = isSignIn ? this.signInWithEmail(user) : this.signUpWithEmail(user);
    }
    return operation;
  }

  logout(): Promise<void> {
    return this.afAuth.auth.signOut();
  }

  private signInWithEmail({ email, password }: User): Promise<auth.UserCredential> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  private signUpWithEmail({ email, password, name }: User): Promise<auth.UserCredential> {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password).then(credentials => {
      return credentials.user
        .updateProfile({ displayName: name, photoURL: null })
        .then(() => credentials);
    });
  }

  private singInWithPopup(provider: AuthProvider): Promise<auth.UserCredential> {
    let signInProvider = null;

    switch (provider) {
      case AuthProvider.Facebook:
        signInProvider = new auth.FacebookAuthProvider();
        break;
      // case 'google':
    }

    return this.afAuth.auth.signInWithPopup(signInProvider);
  }
}
