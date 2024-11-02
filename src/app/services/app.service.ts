import { User, UsersResponse } from './../users/user';
import { Filme } from './../midias/filme';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, concatMap, Observable, of, takeWhile } from 'rxjs';
import { Serie } from '../midias/serie';
import { Season } from '../midias/season';
import { Episode } from '../midias/episode';

export interface seriesID{
  popular:number[],
  keepWatching:number[]
}

export interface serie{
  id?:number,
  isKeepWatching?:boolean,
  cardImage: string,
  titleImage: string,
  backgroundImage: string,
  relevance: number,
  year: number,
  minAge: number,
  time?: number,
  season: unknown,
  description: string,
  cast: string[],
  genre: string[],
  scenes: string[]
}

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private readonly LOCAL_STORAGE_NOVIDADES = 'CineflixNovidades';
  private readonly API = 'http://localhost:8080/api/users';
  private readonly APIFILMES = 'http://localhost:8080/api/movies';
  private readonly APISERIES = 'http://localhost:8080/api/series';
  private readonly APIPLAYER= 'http://localhost:8080/api/player/play';
  private novidadesSubject = new BehaviorSubject<Filme[]>([]);
  novidades$ = this.novidadesSubject.asObservable();

  constructor(private httpClient: HttpClient) {
  }

  loadNovidadesLocal(){
    const filmesStorage = localStorage.getItem(this.LOCAL_STORAGE_NOVIDADES);
    if (filmesStorage) {
        this.novidadesSubject.next(JSON.parse(filmesStorage));
    }
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
    const filmesEmSubject = this.novidadesSubject.getValue();

    // Verifica se os filmes estão sincronizados
    if (filmesEmSubject.length > 0 && this.verificarSincronizacao(filmesEmSubject)) {
        console.log("Novidades já estão disponíveis e sincronizadas. Nenhuma requisição necessária.");
        return; // Já temos filmes sincronizados, não precisamos fazer a requisição
    }

    let page = 0;
    let allNovidades: Filme[] = [];

    this.getCategoriaNovidade(page).pipe(
        concatMap(filmes => {
            if (filmes.length === 0) return of([]);
            allNovidades = allNovidades.concat(filmes);
            this.novidadesSubject.next(allNovidades); // Atualiza o BehaviorSubject
            localStorage.setItem(this.LOCAL_STORAGE_NOVIDADES, JSON.stringify(allNovidades)); // Atualiza o localStorage
            page++;
            return this.getCategoriaNovidade(page);
        }),
        takeWhile(filmes => filmes.length > 0)
    ).subscribe({
        complete: () => console.log("Todas as novidades foram carregadas e sincronizadas."),
        error: err => console.error("Erro ao carregar novidades:", err)
    });
  }


  verificarSincronizacao(filmesEmSubject) {
    const filmesEmStorage = JSON.parse(localStorage.getItem(this.LOCAL_STORAGE_NOVIDADES) || '[]');

    // Verifica se ambos estão sincronizados
    return JSON.stringify(filmesEmSubject) === JSON.stringify(filmesEmStorage);
}


}
