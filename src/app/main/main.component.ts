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
  // @Input() serieSelecionada: Serie;
  // @Input() filmeSelecionado: Filme;
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
    this.definirRota();
    this.observarMudancasDeParametros();
    this.verificarNovo();
    console.log("usuario: ", this.user);
    console.log("rota: ", this.rota);
    console.log("novo: ", this.isNew);
    console.log("ID: ", this.hasId);

  }

  onSearch(searchValue: string) {
    this.pesquisa = searchValue;
  }

  onFilmeSelected(filme: Filme) {
    // this.filmeSelecionado= filme;
  }

  verificarNovo() {
    if(this.rota==='NovoFilme'||this.rota==='NovaSerie'){
      this.isNew=true;
    }
  }

  onSerieSelected(serie: Serie) {
    // this.serieSelecionada=serie;
  }

    // Função para definir a rota
    private definirRota() {
      const path = this.route.snapshot.url[0].path;
      this.rota = path === 'series' ? 'Séries' :
                  path === 'filmes' ? 'Filmes' :
                  path === 'novo-filme' ? 'NovoFilme' :
                  path === 'nova-serie' ? 'NovaSerie' : 'Início';
    }

    // Função para observar mudanças nos parâmetros da rota e carregar a série correspondente
    private observarMudancasDeParametros() {
      this.route.params.subscribe(params => {
        if (params['id']) {
          console.log(params['id']);

          this.hasId = true;
        }
      });
    }

    // // Função para carregar a série pelo ID
    // private carregarSeriePorId(id: number) {
    //   this.appService.getSerieById(id).subscribe(
    //     serie => {
    //       this.serieSelecionada = serie;
    //     },
    //     error => {
    //       console.log(error);
    //     }
    //   );
    // }

}

