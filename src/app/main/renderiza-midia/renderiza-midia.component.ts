import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, take } from 'rxjs';
import { Filme } from 'src/app/midias/filme';
import { AppService } from 'src/app/services/app.service';
import { EstrelasComponent } from '../estrelas/estrelas/estrelas.component';
import { OnlinePlayerComponent } from 'src/app/online-player/online-player.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-renderiza-midia',
  standalone: true,
  imports: [
    CommonModule,
    EstrelasComponent,
    OnlinePlayerComponent,
    FormsModule,
  ],
  templateUrl: './renderiza-midia.component.html',
  styleUrl: './renderiza-midia.component.scss'
})
export class RenderizaMidiaComponent implements OnInit{

  @Input() rota: String
  novidades$: Observable<Filme[]>;
  filmeBanner: Filme ;
  avaliacao: number = 0;
  id: number = 0;
  assistirOnline: boolean = false;
  modoEdicao:boolean= false;

  constructor(
    private appService: AppService,
    private router:Router
  ){
    this.novidades$ = this.appService.novidades$;
  }

  ngOnInit(): void {
    if(this.rota === 'Início'){
      this.appService.carregarNovidades();
    }
    this.id= this.appService.getIdSelecionado();
    this.renderizarBanner();
  }

  renderizarBanner(){
    console.log("Renderizar banner");
    if(this.id!==0 && this.rota!=='Início'){
      if(this.rota ==='Filmes'){
        this.appService.getFilmeById(this.id).subscribe({
          next: (response: Filme)=>{
            this.filmeBanner=response;
          },
          error: (error) =>{
            console.error("Erro ao buscar por filme: ", error);
          }
        });
      }
    }else{
      this.novidades$.subscribe(filmes => {
        if (filmes.length > 0) {
          this.filmeBanner = this.escolherFilmeAleatorio(filmes);
        }
      });
    }
  }

  secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 60);
    var m = Math.floor(d % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? "h " : "h ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? "min " : "min ") : "";
    return hDisplay + mDisplay;
  }

  abrirPlayer(filme: Filme): void {
    console.log("FILME>>>", filme);

    if(this.assistirOnline){
      this.assistirOnline= !this.assistirOnline;
    }

    this.appService.executar(filme.storage).subscribe({
      error: this.handleError.bind(this),
    });
  }

  abrirPlayerOnline(){
    this.assistirOnline = true;
  }

  editar() {
    this.modoEdicao= true;
  }

  remover() {
    this.appService.startLoading();
    this.appService.removerFilme(this.filmeBanner.id).subscribe({
      next: response => {
        console.log('Filme removido com sucesso:', response);

        // Remover o filme da lista de novidades e atualizar o BehaviorSubject e o localStorage
        const novidadesAtualizadas = this.appService.getNovidades().filter(
          filme => filme.id !== this.filmeBanner.id
        );
        this.appService.atualizarNovidades(novidadesAtualizadas);

        // Recarregar as novidades
        this.appService.carregarNovidades();

        // Timeout para esperar a finalização do carregamento
        setTimeout(() => {
          console.log("Executado após 2 segundos");
          if (!this.appService.isLoading()) {
            console.log("Loading finalizado. Renderizando banner.");
            this.renderizarBanner();
            this.router.navigate(['filmes']);
          } else {
            console.log("Loading não finalizado. Erro.");
          }
        }, 2000);
      },
      error: error => console.error('Erro ao remover filme:', error)
    });
  }

  salvar() {
    this.modoEdicao= false;
    const item = this.filmeBanner;
    if (item) {
      this.appService.atualizarFilme(item).subscribe({
        next: response => console.log('Filme atualizado com sucesso:', response),
        error: err => console.error('Erro ao atualizar filme:', err)
      });
    }
  }

  avaliar() {
    if (this.avaliacao !== 0) {
      const item = this.filmeBanner;
      if (item) {
        item.rating = this.avaliacao;
        this.appService.atualizarFilme(item).subscribe({
          next: response => console.log('Filme atualizado com sucesso:', response),
          error: err => console.error('Erro ao atualizar filme:', err)
        });
      }
    }
  }

  public onRatingChanged(rating: number): void {
    this.avaliacao=rating;
  }

  private escolherFilmeAleatorio(filmes: Filme[]): Filme {
    const indiceAleatorio = Math.floor(Math.random() * filmes.length);
    return filmes[indiceAleatorio];
  }

  private handleError(erro: any): void {
      console.error('Erro ao executar filme', erro);
  }
}
