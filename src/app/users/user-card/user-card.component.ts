import { User } from './../user';
import { AppService } from './../../services/app.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UserInMainService } from 'src/app/services/user-in-main.service';



@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {
  @Input() user:User = {
    "id": 0,
    "name": '',
    "avatarUrl": '',
    "moviesLastModified": '',
    "seriesLastModified": '',
  }
  @Input() edit= false;
  editing = false;

  avatars = [
    { nome: "Homem de Ferro", url: "../../assets/images/pngwing.com.png" },
    { nome: "Maquina de Combate", url: "../../assets/images/pngwing.com(2).png" },
    { nome: "Capitão América", url: "../../assets/images/pngwing.com(3).png" },
    { nome: "Superman", url: "../../assets/images/pngwing.com(4).png" },
    { nome: "Homem Aranha", url: "../../assets/images/pngwing.com(5).png" },
    { nome: "Hulk", url: "../../assets/images/pngwing.com(7).png" },
    { nome: "Thor", url: "../../assets/images/pngwing.com(8).png" },
    { nome: "Deadpool", url: "../../assets/images/pngwing.com(6).png" }
  ];
  selectedAvatar: string;


  constructor(private route: Router,
    private userService: UserInMainService,
    private appService: AppService) { }

  ngOnInit(): void {

  }

  userEnterAplication() {
    this.userService.login(this.user);
    this.route.navigate(['main',this.user.id])
  }

  startEditing() {
    if(this.edit){
        this.editing = true;
    }else{
      this.userEnterAplication();
    }
  }

  saveChanges() {
    this.editing = false;
    this.appService.atualizarUsuario(this.user).subscribe(
      (response) => {
        console.log('Usuário atualizado com sucesso:', response);
        // Exiba a mensagem de sucesso para o usuário
      },
      (error) => {
        console.error('Erro ao atualizar usuário:', error);
        // Exiba a mensagem de erro para o usuário
      }
    );

  }

  cancelEditing() {
    this.editing = false;
  }

  updateAvatarUrl() {
    const selectedAvatar = this.avatars.find(a => a.url === this.selectedAvatar);
    this.user.avatarUrl = selectedAvatar.url;
  }
}
