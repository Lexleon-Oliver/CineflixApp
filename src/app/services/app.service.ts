import { User, UsersResponse } from './../users/user';
import { Filme } from './../midias/filme';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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


  constructor(private httpClient: HttpClient) { }
  private readonly API = 'http://localhost:8080/api/users';
  private readonly APIFILMES = 'http://localhost:8080/api/movies';
  private readonly APISERIES = 'http://localhost:8080/api/series';
  private readonly APIPLAYER= 'http://localhost:8080/api/player/play';


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

  getCategoriaNovidade(page: number){
    return this.httpClient.get<Filme[]>(`${this.APIFILMES}/recents?page=${page}`)
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
  

  

 

 



  


}
