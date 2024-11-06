import { User, UsersResponse } from './../users/user';
import { Filme } from './../midias/filme';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, concatMap, filter, map, mapTo, Observable, of, Subject, take, takeWhile } from 'rxjs';
import { Serie } from '../midias/serie';
import { Season } from '../midias/season';
import { Episode } from '../midias/episode';


@Injectable({
  providedIn: 'root'
})
export class AppService {

  private readonly LOCAL_STORAGE_NOVIDADES = 'CineflixNovidades';
  private readonly LOCAL_STORAGE_FILMES = 'CineflixFilmes';
  private readonly LOCAL_STORAGE_RECENTES = 'CineflixRecentes';
  private readonly API = 'http://localhost:8080/api/users';
  private readonly APIFILMES = 'http://localhost:8080/api/movies';
  private readonly APISERIES = 'http://localhost:8080/api/series';
  private readonly APIPLAYER= 'http://localhost:8080/api/player/play';
  private novidadesSubject = new BehaviorSubject<Filme[]>([]);
  private ultimosSubject = new BehaviorSubject<Filme[]>([]);
  private filmesSubject = new BehaviorSubject<Filme[]>([]);
  private loading = false;
  private idSelecionado:number = 0;

  novidades$ = this.novidadesSubject.asObservable();
  ultimos$ = this.ultimosSubject.asObservable();
  filmes$ = this.filmesSubject.asObservable();
  rota!:string;

  constructor(private httpClient: HttpClient) {
  }

  setIdSelecionado(id:number){
    this.idSelecionado = id;
  }

  getIdSelecionado():number{
    return this.idSelecionado;
  }

  isLoading(): boolean {
    return this.loading;
  }

  startLoading(): void {
    console.log("Começou o Loading");
    this.loading=true;  // Inicia o carregamento
  }

  finishLoading(): void {
    console.log("Acabou o Loading");
    this.loading=false;  // Finaliza o carregamento
  }

  getUsers(): Observable<UsersResponse>{
    return this.httpClient.get<UsersResponse>(this.API,{}).pipe(
    );
  }

  getUserById(id: number){
    return this.httpClient.get<User>(`${this.API}/${id}`)
  }

  atualizarUsuario(user:User){
    return this.httpClient.put<User>(`${this.API}/${user.id}`, user)
  }

  atualizarFilme(filme:Filme){
    return this.httpClient.put<Filme>(`${this.APIFILMES}/${filme.id}`, filme)
  }

  cadastrarFilme(filme:Filme){
    return this.httpClient.post<Filme>(`${this.APIFILMES}`, filme)
  }

  removerFilme(id: number){
    return this.httpClient.delete(`${this.APIFILMES}/${id}`)
  }

  getFilmes(page: number){
    return this.httpClient.get<Filme[]>(`${this.APIFILMES}?page=${page}`)
  }

  getFilmeById(id: number){
    return this.httpClient.get<Filme>(`${this.APIFILMES}/${id}`)
  }

  getCategoriaNovidade(page: number): Observable<Filme[]> {
    return this.httpClient.get<Filme[]>(`${this.APIFILMES}/recents?page=${page}`);
  }

  getNovidades(): Filme[] {
    return this.novidadesSubject.getValue();
  }

  getUltimosAdicionados(){
    return this.httpClient.get<Filme[]>(`${this.APIFILMES}/last`)
  }

  removerSerie(id: number){
    return this.httpClient.delete(`${this.APIFILMES}/${id}`)
  }

  getSeries(page: number){
    return this.httpClient.get<Serie[]>(`${this.APISERIES}?page=${page}`)
  }

  getSerieById(id: number){
    return this.httpClient.get<Serie>(`${this.APISERIES}/${id}`)
  }

  atualizarSerie(serie:Serie){
    return this.httpClient.put<Serie>(`${this.APISERIES}/${serie.id}`, serie)
  }

  cadastrarTemporada(temporada:Season){
    return this.httpClient.post(`${this.APISERIES}/seasons`, temporada)
  }
  cadastrarEpisodio(episodio:Episode){
    return this.httpClient.post(`${this.APISERIES}/seasons/episodes`, episodio)
  }

  executar(url: string) {
    return this.httpClient.post(this.APIPLAYER, url);
  }

  carregarNovidades() {
    console.log("carregarNovidades()");

    const novidadesEmSubject = this.getNovidades();

    // Verifica se os filmes estão sincronizados
    if (novidadesEmSubject.length > 0 && this.verificarSincronizacao(novidadesEmSubject, this.LOCAL_STORAGE_NOVIDADES)) {
        console.log("Novidades já estão disponíveis e sincronizadas. Nenhuma requisição necessária.");
        this.finishLoading();
        return; // Já temos filmes sincronizados, não precisamos fazer a requisição
    }

    let page = 0;
    let allNovidades: Filme[] = [];

    this.getCategoriaNovidade(page).pipe(
        concatMap(filmes => {
            if (filmes.length === 0) return of([]);
            allNovidades = allNovidades.concat(filmes);

            // Atualiza novidades e localStorage usando o método centralizado
            this.atualizarNovidades(allNovidades);

            page++;
            return this.getCategoriaNovidade(page);
        }),
        takeWhile(filmes => filmes.length > 0)
    ).subscribe({
      complete: () => {
        this.finishLoading();
        console.log("Todas as novidades foram carregadas e sincronizadas.");
      },
      error: (err) => {
        this.finishLoading();
        console.error("Erro ao carregar novidades:", err);
      }
    });
  }

  carregarFilmes() {
    const filmesEmSubject = this.filmesSubject.getValue();

    // Verifica se os filmes estão sincronizados
    if (filmesEmSubject.length > 0 && this.verificarSincronizacao(filmesEmSubject, this.LOCAL_STORAGE_FILMES)) {
        console.log("Filmes já estão disponíveis e sincronizadas. Nenhuma requisição necessária.");
        return; // Já temos filmes sincronizados, não precisamos fazer a requisição
    }

    let page = 0;
    let allFilmes: Filme[] = [];

    this.getFilmes(page).pipe(
        concatMap(filmes => {
            if (filmes.length === 0) return of([]);
            allFilmes = allFilmes.concat(filmes);
            this.filmesSubject.next(allFilmes); // Atualiza o BehaviorSubject
            localStorage.setItem(this.LOCAL_STORAGE_FILMES, JSON.stringify(allFilmes)); // Atualiza o localStorage
            page++;
            return this.getFilmes(page);
        }),
        takeWhile(filmes => filmes.length > 0)
    ).subscribe({
        complete: () => {
          this.finishLoading();
          console.log("Todos os filmes foram carregadas e sincronizadas.");
        },
        error: err => {
          this.finishLoading();
          console.error("Erro ao carregar todos os filmes:", err);
        }
    });
  }

  atualizarNovidades(novidadesAtualizadas: Filme[]): void {
    this.novidadesSubject.next(novidadesAtualizadas);
    localStorage.setItem(this.LOCAL_STORAGE_NOVIDADES, JSON.stringify(novidadesAtualizadas));
  }

  carregarRecentes(){
    const recentesEmSubject = this.ultimosSubject.getValue();

    // Verifica se os filmes estão sincronizados
    if (recentesEmSubject.length > 0 && this.verificarSincronizacao(recentesEmSubject,this.LOCAL_STORAGE_RECENTES)) {
        console.log("Recentes já estão disponíveis e sincronizadas. Nenhuma requisição necessária.");
        return; // Já temos filmes sincronizados, não precisamos fazer a requisição
    }

    let allRecentes: Filme[] = [];

    this.getUltimosAdicionados().pipe(
      map(recentes=>{
        allRecentes = recentes;
        this.ultimosSubject.next(allRecentes);
        localStorage.setItem(this.LOCAL_STORAGE_RECENTES,JSON.stringify(allRecentes));
        return allRecentes;
      })
    ).subscribe({
      next: () => {
        this.finishLoading();
        console.log("Todas os recentes foram carregadas e sincronizadas.");
      },
      error: err => {
        this.finishLoading();
        console.error("Erro ao carregar recentes:", err);
      }
    })
  }


  verificarSincronizacao(filmesEmSubject, key:string) {
    const filmesEmStorage = JSON.parse(localStorage.getItem(key) || '[]');
    // Verifica se ambos estão sincronizados
    return JSON.stringify(filmesEmSubject) === JSON.stringify(filmesEmStorage);
  }


}
