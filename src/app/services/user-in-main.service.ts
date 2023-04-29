import { User } from './../users/user';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class UserInMainService {
  private userLogged:User


  login(user: User) {
    this.userLogged = user;
  }

  getCurrentUser(): User {
    return this.userLogged;
  }

  saveToLocalStorage(users: User[]): void {
    localStorage.setItem('cineflixUsers', JSON.stringify(users));
  }



  constructor() { }

}
