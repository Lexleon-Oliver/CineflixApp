import { UserInMainService } from 'src/app/services/user-in-main.service';
import { Component, OnInit } from '@angular/core';
import { AppService } from '../services/app.service';
import { User, UsersResponse } from './user';
import { tap } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  user: UsersResponse;
  selectedUser: User;
  edit = false;

  constructor(private service:AppService,
    private userService: UserInMainService) { }

  ngOnInit(): void {
    this.getUsers();
  }

  private getUsers() {
    this.service.getUsers().pipe(
      tap(response => this.user = response),
      tap(()=>this.setUser(this.user))
    ).subscribe();
  }

  private setUser(user:UsersResponse) {
    const storedUsers = this.userService.getStoredUsers();
    if (storedUsers) {
      this.compareAndUpdateUsers(user.users, storedUsers);
    } else {
      this.userService.saveToLocalStorage(user.users);
    }
    this.users=user.users;
  }

  toggleEdit() {
    this.edit = !this.edit;
  }

  private compareAndUpdateUsers(users: User[], storedUsers: User[]) {
    users.forEach(user => {
      const storedUser = storedUsers.find(stored => stored.id === user.id);
      if (storedUser) {
        if (this.isUserModified(user, storedUser)) {
          console.log("Usuario Modificado");
          this.userService.saveToLocalStorage(users);
          this.updateSessionStorageFlags(user, storedUser);
        }
      }
    });
  }

  private isUserModified(user: User, storedUser: User): boolean {
    return user.seriesLastModified !== storedUser.seriesLastModified ||
      user.moviesLastModified !== storedUser.moviesLastModified ||
      user.name !== storedUser.name ||
      user.avatarUrl !== storedUser.avatarUrl;
  }

  private updateSessionStorageFlags(user: User, storedUser: User): void {
    if (user.moviesLastModified !== storedUser.moviesLastModified) {
      sessionStorage.setItem('cineflixAtualizaFilme', 'true');
    }
    if (user.seriesLastModified !== storedUser.seriesLastModified) {
      sessionStorage.setItem('cineflixAtualizaSerie', 'true');
    }
  }

}
