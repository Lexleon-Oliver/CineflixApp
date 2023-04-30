import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Episode } from 'src/app/midias/episode';
import { Filme } from 'src/app/midias/filme';
import { Season } from 'src/app/midias/season';
import { Serie } from 'src/app/midias/serie';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-rendereriza-filme',
  templateUrl: './rendereriza-filme.component.html',
  styleUrls: ['./rendereriza-filme.component.scss']
})
export class RendererizaFilmeComponent implements OnInit {

  @Input() rota: String
  @Output() serieSelecionada = new EventEmitter<Serie>();
  @Output() filmeSelecionado = new EventEmitter<Filme>();

  filmes: Filme[] = [];
  filme: Filme ;
  serie: Serie;
  series: Serie[] = [];
  temporada:Season;
  idTemp: number =0;
  idEpisode: number =0;
  episodio: Episode;
  avaliacao: number = 0;
  id:number = 0;
  ocultaBotaoAssistir: boolean=false;
  modoEdicao: boolean= false;

  constructor( private route: ActivatedRoute,
    private appService: AppService,
    private router: Router) { }

  ngOnInit(): void {
    if(this.route.snapshot.paramMap.get('id')){
      this.id = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    }
    this.renderizaMidia();
  }

  abrirPlayer(filme: Filme): void {
    this.appService.executar(filme.storage).subscribe(resposta => {
      console.log('Filme executado com sucesso!', resposta);
    }, erro => {
      console.error('Erro ao executar filme', erro);
    });
  }

  avaliar() {
    if(this.avaliacao!==0){
      if(this.serie){
        this.serie.rating= this.avaliacao;
        this.appService.atualizarSerie(this.serie).subscribe(
          (response) => {
            console.log('Serie atualizada com sucesso:', response);
            // Exiba a mensagem de sucesso para o usuário
          },
          (error) => {
            console.error('Erro ao atualizar serie:', error);
            // Exiba a mensagem de erro para o usuário
          }
        );
      }else if(this.filme){
        this.filme.rating= this.avaliacao;
        this.appService.atualizarFilme(this.filme).subscribe(
          (response) => {
            console.log('Filme atualizado com sucesso:', response);
            // Exiba a mensagem de sucesso para o usuário
          },
          (error) => {
            console.error('Erro ao atualizar filme:', error);
            // Exiba a mensagem de erro para o usuário
          }
        );
      }

    }
  }

  public onRatingChanged(rating: number): void {
    this.avaliacao=rating;
  }

  secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 60);
    var m = Math.floor(d % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? "h " : "h ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? "min " : "min ") : "";
    return hDisplay + mDisplay;
  }

  renderizaMidia(){
    if(this.id!==0){
      if(this.rota === 'Início'){
        this.getNovidade(0);
      }else if(this.rota === 'Séries'){
        this.ocultaBotaoAssistir=true;
        this.getSerie(this.id);
        setTimeout(() => {
          this.filme=new Filme(this.id,this.serie.name,this.serie.nameBr,
            this.serie.year,this.serie.description,this.serie.thumbnail,
            this.serie.background,null,this.serie.genre,
            this.serie.rating,this.serie.minAge,this.serie.time);
          this.onSerieSelected(this.serie);
        }, 500);
      }else if(this.rota === 'Filmes'){
        this.appService.getFilmeById(this.id).subscribe(filme =>{
          this.filme=filme;
        }, error => {
          console.log(error);
        });
        setTimeout(()=>{
          this.onFilmeSelected(this.filme);
        },500);
      }
    }else if(this.rota==='NovoFilme'){
      this.filme=new Filme(0,"","",
        "","","",
        "","/mnt/Filmes/Filmes/' '","",
        0,0,0);
    }else if(this.rota==='NovaSerie'){
      this.serie = new Serie(null, null, null, null, null, null, null,null, null, null, null, null, []);
      this.temporada= new Season(null, null, null, null, []);
      this.episodio= new Episode(null, null, null, null, null);
      this.filme=new Filme(this.id,this.serie.name,this.serie.nameBr,
        this.serie.year,this.serie.description,this.serie.thumbnail,
        this.serie.background,null,this.serie.genre,
        this.serie.rating,this.serie.minAge,this.serie.time);
    }else{
      this.getNovidade(0);
    }
  }

  getNovidade(page: number){
    if(sessionStorage.getItem('cineflixAtualizaFilme') || !localStorage.getItem('CineflixNovidades')){
      this.appService.getCategoriaNovidade(page).subscribe(filmes => {
        if (filmes.length > 0) {
          this.filmes = [...this.filmes, ...filmes];
          this.getNovidade(page + 1);
        }else{
          const randomIndex = Math.floor(Math.random() * this.filmes.length);
          this.filme = this.filmes[randomIndex];
          localStorage.setItem('CineflixNovidades',JSON.stringify(this.filmes));
        }
      }, error => {
        console.log(error);
      });
    }else if(localStorage.getItem('CineflixNovidades')){
      // console.log("localStorage",JSON.parse(localStorage.getItem('CineflixNovidades')) )
       this.filmes= JSON.parse(localStorage.getItem('CineflixNovidades'));
       const randomIndex = Math.floor(Math.random() * this.filmes.length);
          this.filme = this.filmes[randomIndex];
          localStorage.setItem('CineflixNovidades',JSON.stringify(this.filmes));
    }
  }

  onSerieSelected(serie: Serie) {
    this.serieSelecionada.emit(serie);
  }

  onFilmeSelected(filme: Filme){
    this.filmeSelecionado.emit(filme);
  }

  onSeasonSelected() {
    if (this.idTemp) {
      this.serie.season.forEach(temporada =>{

        if (temporada.id==this.idTemp){
          this.temporada = temporada;
        }
      });
    }else{
    this.temporada = new Season(0,0,this.serie.id,"",[]);
    }

  }

  onEpisodeSelected() {
    if(this.idEpisode){
      this.temporada.episode.forEach(episodio =>{

      if (episodio.id==this.idEpisode){
        this.episodio = episodio;
      }
    });
    }else{
      this.episodio =new Episode(0,`/mnt/Filmes/Séries/${this.serie.nameBr}/${this.temporada.numSeason} Temporada/Episódio `,"", 0,this.temporada.id);
    }

  }

  salvar() {
    if(this.serie){
      if(this.serie.id!==0){
        this.serie.background = this.filme.background;
        this.serie.description = this.filme.description;
        this.serie.genre = this.filme.genre;
        this.serie.minAge = this.filme.minAge;
        this.serie.name = this.filme.name;
        this.serie.nameBr = this.filme.nameBr;
        this.serie.rating = this.filme.rating;
        this.serie.thumbnail = this.filme.thumbnail;
        this.serie.time = this.filme.time;
        this.serie.year =this.filme.year;
        if (this.temporada.id===0){
          this.appService.cadastrarTemporada(this.temporada).subscribe(
            (response) =>{
              let newResponse: any;
              newResponse =response;
              let message = newResponse.message; // "Created season with ID 12345"
              let idStartIndex = message.indexOf("ID") + 3; // índice do primeiro dígito do ID
              let id = message.substring(idStartIndex); // extrai a substring a partir do índice encontrado
              this.temporada.id = id;
              this.serie.season.push(this.temporada)
            },
            (error) => {
              console.error('Erro ao cadastrar temporada:', error);
            }
          );
        }
        if(this.episodio.id ===0){
          this.appService.cadastrarEpisodio(this.episodio).subscribe(
            (response) =>{
              let newResponse: any;
              newResponse =response;
              let message = newResponse.message;
              let idStartIndex = message.indexOf("ID") + 3;
              let id = message.substring(idStartIndex);
              this.episodio.id = id;
              this.temporada.episode.push(this.episodio)
            },
            (error) => {
              console.error('Erro ao cadastrar temporada:', error);
            }
          );
        }
        this.appService.atualizarSerie(this.serie).subscribe(
          (response) => {
            console.log('Serie atualizada com sucesso:', response);
          },
          (error) => {
            console.error('Erro ao atualizar série:', error);
          }
        );
      }
      this.router.navigate(['series']);
    }else{
      if(this.filme.id!==0){
        this.appService.atualizarFilme(this.filme).subscribe(
          (response) => {
            console.log('Filme atualizado com sucesso:', response);
            // Exiba a mensagem de sucesso para o usuário
          },
          (error) => {
            console.error('Erro ao atualizar filme:', error);
            // Exiba a mensagem de erro para o usuário
          }
        );
      }else{
        this.appService.cadastrarFilme(this.filme).subscribe(
          (response) => {
            console.log('Filme cadastrado com sucesso:', response);
            // Exiba a mensagem de sucesso para o usuário
          },
          (error) => {
            console.error('Erro ao cadastrar filme:', error);
            // Exiba a mensagem de erro para o usuário
          }
        );
      }
    this.router.navigate(['filmes']);
    }
  }

  remover(){
    if(this.filme){
      this.appService.removerFilme(this.filme.id).subscribe(
        (response) => {
          console.log('Filme removido com sucesso:', response);
          // Exiba a mensagem de sucesso para o usuário
        },
        (error) => {
          console.error('Erro ao remover filme:', error);
          // Exiba a mensagem de erro para o usuário
        }
      );
      this.router.navigate(['filmes'])
    }
  }

  editar() {
    this.modoEdicao=true;
  }

   getSerie(id: number) {
    if(sessionStorage.getItem('cineflixAtualizaSerie') || !localStorage.getItem('CineflixSeries')){
      this.getSeries(0);
    }else{
      this.series= JSON.parse(localStorage.getItem('CineflixSeries'));
    }
    try{
      this.serie = this.series.find(f => f.id === id);
    }catch{
      this.appService.getSerieById(this.id).subscribe(serie => {
        this.serie = serie;
      }, error => {
        console.log(error);
      });
    }
  }

  getSeries(page: number){
    this.appService.getSeries(page).subscribe(series => {
      if (series.length > 0) {
        this.series = [...this.series, ...series];
        this.getSeries(page + 1);
      }else{
        localStorage.setItem('CineflixSeries',JSON.stringify(this.series));
      }
    }, error => {
      console.log(error);
    });
  }



}


