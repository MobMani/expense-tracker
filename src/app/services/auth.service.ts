import { Injectable, signal } from '@angular/core';

export interface AppUser {
  username: string;
  role: 'admin' | 'user';
}

interface Credential extends AppUser {
  password: string;
}

/**
 * Hardcoded accounts, as requested. Change the passwords here,
 * or swap this service out for a real backend later — every
 * other part of the app only depends on AuthService's public API.
 */
const CREDENTIALS: Credential[] = [
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'user', password: 'user123', role: 'user' }
];

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<AppUser | null>(null);

  login(username: string, password: string): boolean {
    const match = CREDENTIALS.find(
      (c) => c.username.toLowerCase() === username.trim().toLowerCase() && c.password === password
    );
    if (!match) return false;
    const user: AppUser = { username: match.username, role: match.role };
    this.currentUser.set(user);
    return true;
  }

  logout(): void {
    this.currentUser.set(null);
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'admin';
  }
}
