import { User } from './../users/user';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserInMainService } from '../services/user-in-main.service';
import { ActivatedRoute } from '@angular/router';
import { Serie } from '../midias/serie';
import { Filme } from '../midias/filme';
import { AppService } from '../services/app.service';



@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  @Input() serieSelecionada: Serie;
  @Input() filmeSelecionado: Filme;
  categoriasFilmes: string[]=[
    "NOVIDADES","ÚLTIMOS ADICIONADOS","FILMES","CLÁSSICOS","AÇÃO","ANIMAÇÃO",
    "AVENTURA","COMÉDIA","DRAMA","FAMÍLIA","FANTASIA","FICÇÃO CIENTÍFICA","ROMANCE","TERROR"
  ];
  
  hasId: boolean = false;
  isNew: boolean = false;

  user:User;
  rota:string = '';
  pesquisa: string = '';

  constructor(private userService:UserInMainService,
    private route: ActivatedRoute,
    private appService: AppService) { }


  ngOnInit(): void {

    this.user = this.userService.getCurrentUser();
    switch (this.route.snapshot.url[0].path) {
      case 'series':
        this.rota = 'Séries';
        break;
      case 'filmes':
        this.rota = 'Filmes';
        break;
      case 'novo-filme':
        this.rota = 'NovoFilme';
        break;
      case 'nova-serie':
        this.rota = 'NovaSerie';
        break;
      default:
        this.rota = 'Início';
        break;
    }
    if(this.route.snapshot.params.hasOwnProperty('id')){
      this.hasId=true;
      if(this.rota === 'Séries'){
        let id = parseInt(this.route.snapshot.paramMap.get('id'), 10);
        this.appService.getSerieById(id).subscribe(serie => {
          this.serieSelecionada = serie;
        }, error => {
          console.log(error);
        });
      }
    }
    this.verificarNovo();
  }

  onSearch(searchValue: string) {
    this.pesquisa = searchValue;
  }

  onFilmeSelected(filme: Filme) {
    this.filmeSelecionado= filme;
  }

  verificarNovo() {
    this.route.url.subscribe(url => {
      const currentUrl = url.join('/');
      if (currentUrl.endsWith('adicionar')) {
        this.isNew=true;
      }
    });
  }

  onSerieSelected(serie: Serie) {
    this.serieSelecionada=serie;
  }

}

