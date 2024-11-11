import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Filme } from 'src/app/midias/filme';
import { AppService } from 'src/app/services/app.service';
import { EstrelasComponent } from '../estrelas/estrelas/estrelas.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-renderiza-midia',
  standalone: true,
  imports: [
    CommonModule,
    EstrelasComponent,
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
  videoUrl: string | null = null;
  nomeVideo:string = "";

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

  setNomeVideo() {
    if(this.filmeBanner.storage){
      this.nomeVideo = this.filmeBanner.storage.split('\\').pop();
      console.log("Nome do arquivo: ", this.nomeVideo);

    }
  }

  renderizarBanner(){
    console.log("Renderizar banner");
    console.log("Id Selecionado: ",this.appService.getIdSelecionado());
    if(this.appService.getIdSelecionado()!==0 && this.rota!=='Início'){
      if(this.rota ==='Filmes'){
        this.appService.getFilmeById(this.appService.getIdSelecionado()).subscribe({
          next: (response: Filme)=>{
            this.filmeBanner=response;
            this.setNomeVideo();
          },
          error: (error) =>{
            console.error("Erro ao buscar por filme: ", error);
          }
        });
      }
    }else if(this.rota==='NovoFilme'){
      this.filmeBanner = new Filme(0, "", "", "", "", "", "", "", "","",0,0,0);
    }else{
      this.novidades$.subscribe(filmes => {
        if (filmes.length > 0) {
          this.filmeBanner = this.escolherFilmeAleatorio(filmes);
          this.setNomeVideo();
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

  playVideo(filename: string) {
    this.appService.setUrlMidia(`http://localhost:8080/api/stream?filename=${filename}`);
  }

  editar() {
    this.modoEdicao= true;
  }

  remover() {
    this.appService.startLoading();
    this.appService.removerFilme(this.filmeBanner.id).subscribe({
      next: response => {
        console.log('Filme removido com sucesso:', response);
        this.atualizarListasFilmeRemovido(this.filmeBanner.id);
        this.appService.setIdSelecionado(0);
        this.appService.carregarNovidades();

        // Usando setInterval para checar continuamente o estado de carregamento
        const intervalId = setInterval(() => {
          console.log("Checando estado de loading...");

          if (!this.appService.isLoading()) {
            console.log("Loading finalizado. Renderizando banner.");
            clearInterval(intervalId); // Limpa o intervalo assim que o carregamento estiver completo
            this.renderizarBanner();
            this.router.navigate(['filmes']);
          } else {
            console.log("Loading não finalizado. Aguardando...");
          }
        }, 500); // Checa a cada 500 ms. Ajuste o tempo conforme necessário.
      },
      error: error => console.error('Erro ao remover filme:', error)
    });

  }


  salvar() {
    if(this.modoEdicao){
      this.modoEdicao= false;
      const item = this.filmeBanner;
      if (item) {
        this.appService.atualizarFilme(item).subscribe({
          next: response => console.log('Filme atualizado com sucesso:', response),
          error: err => console.error('Erro ao atualizar filme:', err)
        });
      }

    }else{
      console.log("Filme", this.filmeBanner);
      const item = this.filmeBanner;
      if (item) {
        this.appService.cadastrarFilme(item).subscribe({
          next: response => {
            console.log('Filme adicionado com sucesso:', response)
            this.router.navigate(['filmes']);
          },
          error: err => console.error('Erro ao atualizar filme:', err)
        });
      }
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

  private atualizarListasFilmeRemovido(filmeId: number) {
    const atualizarLista = (getList: () => Filme[], updateList: (filmes: Filme[]) => void) => {
      const filmesAtualizados = getList().filter(filme => filme.id !== filmeId);
      updateList(filmesAtualizados);
    };

    atualizarLista(this.appService.getNovidadesList.bind(this.appService), this.appService.atualizarNovidades.bind(this.appService));
    atualizarLista(this.appService.getUltimosList.bind(this.appService), this.appService.atualizarUltimos.bind(this.appService));
    atualizarLista(this.appService.getFilmesList.bind(this.appService), this.appService.atualizarFilmes.bind(this.appService));
  }
}


