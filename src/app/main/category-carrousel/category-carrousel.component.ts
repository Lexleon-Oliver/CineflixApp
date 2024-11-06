import { Filme } from './../../midias/filme';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { Serie } from 'src/app/midias/serie';
import { Season } from 'src/app/midias/season';
import { filter, map, Observable, take, tap } from 'rxjs';

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

  novidades$: Observable<Filme[]>;
  ultimos$: Observable<Filme[]>;
  filmes$: Observable<Filme[]>;

  serieObj: Serie;
  series: Serie[] = [];
  filmesFiltrados: Filme[] = [];
  filmesCategorias: Filme[] = [];
  seriesFiltradas: Serie[] = [];

  constructor(private appService:AppService) {
    this.novidades$ = this.appService.novidades$;
    this.ultimos$ = this.appService.ultimos$;
    this.filmes$ = this.appService.filmes$;
  }

  ngOnInit(): void {
    this.loadByCategory(this.category);

  }

  loadByCategory(category: string){
    if(category ==="ÚLTIMOS ADICIONADOS"){
      this.appService.carregarRecentes();
    }
    if(category==="FILMES"){
      this.appService.carregarFilmes();
    }
  }


  getSeries(): void {
    this.series= JSON.parse(localStorage.getItem('CineflixSeries'));
  }


  ngOnChanges(changes: SimpleChanges) {
    if ('pesquisa' in changes) {
      this.filterSeries();
      this.filterFilmes();
    }
  }

  filterSeries(): void {
    // if (this.isSearchEnabled && this.pesquisa !== '') {
    //   let tempSeries: Serie[] = [];
    //   let filteredIds = new Set<number>();
    //   for (let serie of this.series) {
    //     if (serie.nameBr.toLowerCase().includes(this.pesquisa.toLowerCase())) {
    //       if (!filteredIds.has(serie.id)) {
    //         tempSeries.push(serie);
    //         filteredIds.add(serie.id);
    //       }
    //     }
    //   }
    //   this.seriesFiltradas = tempSeries;
    // } else {
    //   if (this.isCompleted){
    //     this.seriesFiltradas = this.series.filter(serie => serie.completed === true);
    //   } else {
    //     this.seriesFiltradas = this.series.filter(serie => serie.completed === false);
    //   }
    // }
  }

  filterFilmes(): void {
    let listFilmes$: Observable<Filme[]>;
    switch (this.category){
      case 'FILMES':
        this.pesquisarEm(this.filmes$);
        break;
      case 'NOVIDADES':
        this.pesquisarEm(this.novidades$);
        break;
      case 'CLÁSSICOS':
        const dataAtual = new Date();
        listFilmes$= this.filmes$.pipe(
          map(filmes=> filmes.filter(filme =>{
            const dataLancamento = new Date(filme.year);
            const diferencaMilissegundos = dataAtual.getTime() - dataLancamento.getTime();
            const diferencaAnos = diferencaMilissegundos / (1000 * 60 * 60 * 24 * 365);
            return diferencaAnos > 15;
          }))
        );
        this.pesquisarEm(listFilmes$);
        break;
      case 'ÚLTIMOS ADICIONADOS':
        this.pesquisarEm(this.ultimos$);
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
        listFilmes$ = this.filterByGenre(this.category);
        this.pesquisarEm(listFilmes$);
      break;
    }
  }

  pesquisarEm(filmes$: Observable<Filme[]>) {
    if (this.isSearchEnabled && this.pesquisa !== '') {
      filmes$
        .pipe(
          map(listFilmes => {
            let tempFilmes: Filme[] = [];
            let filteredIds = new Set<number>();
            for (let filme of listFilmes) {
              console.log("let filme of listFilmes>>>>> ",filme)
              if (filme.nameBr.toLowerCase().includes(this.pesquisa.toLowerCase())) {
                if (!filteredIds.has(filme.id)) {
                  tempFilmes.push(filme);
                  filteredIds.add(filme.id);
                }
              }
            }
            return tempFilmes;
          })
        )
        .subscribe(filteredFilmes => {
          this.filmesFiltrados = filteredFilmes;

        });
    } else {
      filmes$.subscribe(listFilmes => {
        this.filmesFiltrados = listFilmes;
      });
    }

  }

  filterByGenre(genre: string): Observable<Filme[]> {
    return this.filmes$.pipe(
        filter(filmes => filmes.length > 0),
        map(filmes => filmes.filter(filme =>
            filme.genre.split(',').map(g => g.trim().toLowerCase()).includes(genre.toLowerCase())
        )),
    );
  }


}
