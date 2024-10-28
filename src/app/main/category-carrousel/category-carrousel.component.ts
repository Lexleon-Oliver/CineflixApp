import { Filme } from './../../midias/filme';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { Serie } from 'src/app/midias/serie';
import { Season } from 'src/app/midias/season';

@Component({
  selector: 'app-category-carrousel',
  templateUrl: './category-carrousel.component.html',
  styleUrls: ['./category-carrousel.component.scss']
})
export class CategoryCarrouselComponent implements OnInit {
  @Input() category:string;
  @Input() isCompleted:boolean;
  @Input() pesquisa:string;
  @Input() isSearchEnabled: boolean = false;
  @Input() seasonSelecionada: Season;
  @Input() categoriasFilmes:string[];


  serieObj: Serie;
  novidades: Filme[] = [];
  ultimos: Filme[] = [];
  series: Serie[] = [];
  filmes: Filme[] = [];
  filmesFiltrados: Filme[] = [];
  filmesCategorias: Filme[] = [];
  seriesFiltradas: Serie[] = [];

  constructor(private appService:AppService) { }


  getSeries(): void {
    this.series= JSON.parse(localStorage.getItem('CineflixSeries'));
  }

  getFilmes(page: number){
    if(sessionStorage.getItem('cineflixAtualizaFilme') || !localStorage.getItem('CineflixFilmes')){
      this.appService.getFilmes(page).subscribe(filmes => {
        if (filmes.length > 0) {
          this.filmes = [...this.filmes, ...filmes];
          this.getFilmes(page + 1);
        }else{
          localStorage.setItem('CineflixFilmes',JSON.stringify(this.filmes));
        }
      }, error => {
        console.log(error);
      });
    }else{
      this.filmes= JSON.parse(localStorage.getItem('CineflixFilmes'));
    }
  }

  getNovidades(page: number){

    if(sessionStorage.getItem('cineflixAtualizaFilme') || !localStorage.getItem('CineflixNovidades')){
      this.appService.getCategoriaNovidade(page).subscribe(filmes => {
        if (filmes.length > 0) {
          this.novidades = [...this.novidades, ...filmes];
          this.getNovidades(page + 1);
        }else{
          localStorage.setItem('CineflixNovidades',JSON.stringify(this.filmes));
        }
      }, error => {
        console.log(error);
      });
  }else{
    this.novidades= JSON.parse(localStorage.getItem('CineflixNovidades'));
  }
}

  getUltimos(){
    if(sessionStorage.getItem('cineflixAtualizaFilme')||!localStorage.getItem('CineflixRecentes') ){
      this.appService.getUltimosAdicionados().subscribe(ultimos => {
        this.ultimos = ultimos;
        localStorage.setItem('CineflixRecentes',JSON.stringify(this.ultimos));
      }, error => {
        console.log(error);
      });

    }else{
      this.ultimos = JSON.parse(localStorage.getItem('CineflixRecentes'));
    }


  }


  async ngOnInit(): Promise<void> {
    await this.getNovidades(0);
    await this.getUltimos();
    await this.getSeries();
    await this.getFilmes(0);
    this.filterSeries();
    this.filterFilmes();
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('pesquisa' in changes) {
      this.filterSeries();
      this.filterFilmes();
    }
  }

  filterSeries(): void {
    if (this.isSearchEnabled && this.pesquisa !== '') {
      let tempSeries: Serie[] = [];
      let filteredIds = new Set<number>();
      for (let serie of this.series) {
        if (serie.nameBr.toLowerCase().includes(this.pesquisa.toLowerCase())) {
          if (!filteredIds.has(serie.id)) {
            tempSeries.push(serie);
            filteredIds.add(serie.id);
          }
        }
      }
      this.seriesFiltradas = tempSeries;
    } else {
      if (this.isCompleted){
        this.seriesFiltradas = this.series.filter(serie => serie.completed === true);
      } else {
        this.seriesFiltradas = this.series.filter(serie => serie.completed === false);
      }
    }
  }

  filterFilmes(): void {
    let listFilmes: Filme[] = [];
    switch (this.category){
      case 'FILMES':
        this.pesquisarEm(this.filmes);
        break;
      case 'NOVIDADES':
        this.pesquisarEm(this.novidades);
        break;
      case 'CLÁSSICOS':
        const dataAtual = new Date();
        listFilmes= this.filmes.filter(filme => {
          const dataLancamento = new Date(filme.year);
          const diferencaMilissegundos = dataAtual.getTime() - dataLancamento.getTime();
           // Calcular a diferença em anos
          const diferencaAnos = diferencaMilissegundos / (1000 * 60 * 60 * 24 * 365);
          return diferencaAnos > 15;
        });
        this.pesquisarEm(listFilmes);
        break;
      case 'ÚLTIMOS ADICIONADOS':
        this.pesquisarEm(this.ultimos);
        break;
      case 'AÇÃO':
      case 'ANIMAÇÃO':
      case 'AVENTURA':
      case 'COMÉDIA':
      case 'DRAMA':
      case 'FAMÍLIA':
      case 'FANTASIA':
      case 'FICÇÃO CIENTÍFICA':
      case 'ROMANCE':
      case 'TERROR':
        listFilmes = this.filterByGenre(this.category);
        this.pesquisarEm(listFilmes);
      break;
    }
  }

  pesquisarEm(listFilmes: Filme[]) {
    if (this.isSearchEnabled && this.pesquisa !== '') {
      let tempFilmes: Filme[] = [];
      let filteredIds = new Set<number>();
      for (let filme of listFilmes) {
        if (filme.nameBr.toLowerCase().includes(this.pesquisa.toLowerCase())) {
          if (!filteredIds.has(filme.id)) {
            tempFilmes.push(filme);
            filteredIds.add(filme.id);
          }
        }
      }
      this.filmesFiltrados = tempFilmes;
    }else{
      this.filmesFiltrados =listFilmes;
    }
  }

  filterByGenre(genre: string): Filme[] {
    return this.filmes.filter(filme =>
      filme.genre.split(',').map(g => g.trim()).includes(genre)
    );
  }
}
