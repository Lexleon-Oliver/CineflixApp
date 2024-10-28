import { User } from './../users/user';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class UserInMainService {
  private userLogged:User
  private readonly USERS_KEY = 'cineflixUsers';


  login(user: User) {
    this.userLogged = user;
  }

  getCurrentUser(): User {
    return this.userLogged;
  }

  saveToLocalStorage(users: User[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }


  getStoredUsers(): User[] | null {
    const usersJson = localStorage.getItem(this.USERS_KEY);
    return usersJson ? JSON.parse(usersJson) as User[] : null;
  }



  constructor() { }

}
