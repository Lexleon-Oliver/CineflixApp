import { UserInMainService } from 'src/app/services/user-in-main.service';
import { Component, DoCheck, OnInit } from '@angular/core';
import { AppService } from '../services/app.service';
import { User, UsersResponse } from './user';

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
    this.service.getUsers().subscribe((response) => {
      this.user=response;
    });
    setTimeout(()=> {
      this.setUser(this.user)}, 500
    );
  }

  private setUser(user:UsersResponse) {
    this.users=user.users;
    if (localStorage.getItem('cineflixUsers')) {
      this.users.forEach(user => {
        const dataAtualizacaoSerie = user.seriesLastModified;
        const dataAtualizacaoFilme = user.moviesLastModified;
        const usuariosArmazenados = JSON.parse(localStorage.getItem('cineflixUsers'));
        const usuarioArmazenado = usuariosArmazenados.find(f => f.id === user.id);
        if(usuarioArmazenado){
          if (dataAtualizacaoFilme !== usuarioArmazenado.moviesLastModified || dataAtualizacaoSerie!== usuarioArmazenado.seriesLastModified){
            this.userService.saveToLocalStorage(this.users);
            if(dataAtualizacaoFilme !== usuarioArmazenado.moviesLastModified){
              localStorage.setItem('cineflixAtualizaFilme', 'true');
            }
            if(dataAtualizacaoSerie!== usuarioArmazenado.seriesLastModified){
              localStorage.setItem('cineflixAtualizaSerie', 'true');
            }
          }
          if (user.name !== usuarioArmazenado.name || user.avatarUrl !== usuarioArmazenado.avatarUrl){
            this.userService.saveToLocalStorage(this.users);
          }
        }
      });

    }else{
      this.userService.saveToLocalStorage(this.users);
    }
  }

  toggleEdit() {
    this.edit = !this.edit;
  }

}
