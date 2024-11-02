import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Filme } from 'src/app/midias/filme';
import { AppService } from 'src/app/services/app.service';
import { EstrelasComponent } from '../estrelas/estrelas/estrelas.component';
import { OnlinePlayerComponent } from 'src/app/online-player/online-player.component';
import { ModalService } from 'src/app/modal';

@Component({
  selector: 'app-renderiza-midia',
  standalone: true,
  imports: [
    CommonModule,
    EstrelasComponent,
    OnlinePlayerComponent,
  ],
  templateUrl: './renderiza-midia.component.html',
  styleUrl: './renderiza-midia.component.scss'
})
export class RenderizaMidiaComponent implements OnInit{
  @Input() rota: String
  novidades$: Observable<Filme[]>;
  filmeBanner: Filme ;
  avaliacao: number = 0;
  assistirOnline: boolean = false;

  constructor(
    private appService: AppService,
  ){
    this.novidades$ = this.appService.novidades$; // Inscreve-se no Observable
  }

  ngOnInit(): void {
    if(this.rota === 'Início'){
      this.appService.carregarNovidades();
    }
    this.novidades$.subscribe(filmes => {
      if (filmes.length > 0) {
        this.filmeBanner = this.escolherFilmeAleatorio(filmes);
      }
    });
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
