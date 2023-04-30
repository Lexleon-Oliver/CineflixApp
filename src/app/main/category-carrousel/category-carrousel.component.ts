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

  getFilmes():void {
    this.filmes= JSON.parse(localStorage.getItem('CineflixFilmes'));
  }

  getNovidades(){
    this.novidades= JSON.parse(localStorage.getItem('CineflixNovidades'));
  }

  getUltimos(){
    if(sessionStorage.getItem('cineflixAtualizaFilme') || !localStorage.getItem('CineflixRecentes')){
      this.appService.getUltimosAdicionados().subscribe((filmes: Filme[]) => {
        this.ultimos = filmes;
      });
      setTimeout(() => {
        localStorage.setItem('CineflixRecentes',JSON.stringify(this.ultimos));
      }, 2000);
    }else{
      this.ultimos = JSON.parse(localStorage.getItem('CineflixRecentes'));
    }
  }


  ngOnInit(): void {
    this.getNovidades();
    this.getUltimos();
    this.getSeries();
    this.getFilmes();
    setTimeout(() => {
      this.filterSeries();
    }, 2000); // Espera 1 segundo antes de chamar filterSeries
    setTimeout(() => {
      this.filterFilmes();
    }, 2000); // Espera 2 segundo antes de chamar filterFilmes

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
        listFilmes= this.filmes.filter(filme => filme.genre.split(',').map(g => g.trim()).includes('Ação'));
        this.pesquisarEm(listFilmes);
        break;
      case 'ANIMAÇÃO':
        listFilmes= this.filmes.filter(filme => filme.genre.split(',').map(g => g.trim()).includes('Animação'));
        this.pesquisarEm(listFilmes);
        break;
      case 'AVENTURA':
        listFilmes= this.filmes.filter(filme => filme.genre.split(',').map(g => g.trim()).includes('Aventura'));
        this.pesquisarEm(listFilmes);
        break;
      case 'COMÉDIA':
        listFilmes= this.filmes.filter(filme => filme.genre.split(',').map(g => g.trim()).includes('Comédia'));
        this.pesquisarEm(listFilmes);
        break;
      case 'DRAMA':
        listFilmes= this.filmes.filter(filme => filme.genre.split(',').map(g => g.trim()).includes('Drama'));
        this.pesquisarEm(listFilmes);
        break;
      case 'FAMÍLIA':
        listFilmes= this.filmes.filter(filme => filme.genre.split(',').map(g => g.trim()).includes('Família'));
        this.pesquisarEm(listFilmes);
        break;
      case 'FANTASIA':
        listFilmes= this.filmes.filter(filme => filme.genre.split(',').map(g => g.trim()).includes('Fantasia'));
        this.pesquisarEm(listFilmes);
        break;
      case 'FICÇÃO CIENTÍFICA':
        listFilmes= this.filmes.filter(filme => filme.genre.split(',').map(g => g.trim()).includes('Ficção científica'));
        this.pesquisarEm(listFilmes);
        break;
      case 'ROMANCE':
        listFilmes= this.filmes.filter(filme => filme.genre.split(',').map(g => g.trim()).includes('Romance'));
        this.pesquisarEm(listFilmes);
        break;
      case 'TERROR':
        listFilmes= this.filmes.filter(filme => filme.genre.split(',').map(g => g.trim()).includes('Terror'));
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
}
