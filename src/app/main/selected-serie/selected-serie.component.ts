import { AppService, serie } from './../../services/app.service';
import { Serie } from 'src/app/midias/serie';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Filme } from 'src/app/midias/filme';

@Component({
  selector: 'app-selected-serie',
  templateUrl: './selected-serie.component.html',
  styleUrls: ['./selected-serie.component.scss']
})
export class SelectedSerieComponent implements OnInit {

  @Output() onSerieSelected: EventEmitter<Serie> = new EventEmitter<Serie>();
  @Output() onFilmeSelected: EventEmitter<Filme> = new EventEmitter<Filme>();
  @Input() rota:string;
  id:number = 0;
  serie:Serie;
  filme: Filme;
  avaliacao: number = 0;

  constructor(private route: ActivatedRoute,
    private appService: AppService) { }

  ngOnInit(): void {
    if(this.route.snapshot.paramMap.get('id')){
      this.id = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    }
    if(this.rota === 'Séries'){
      this.appService.getSerieById(this.id).subscribe(serie => {
        this.serie = serie;
        this.onSerieSelected.emit(serie);
      }, error => {
        console.log(error);
      });

    }else if(this.rota ==='Filmes' && this.id){
      this.appService.getFilmeById(this.id).subscribe(filme => {
        this.filme = filme;
        this.onFilmeSelected.emit(filme);
      }, error => {
        console.log(error);
      });
    }
  }

  avaliar() {
    if(this.avaliacao!==0){
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
    }
  }

  public onRatingChanged(rating: number): void {
    this.avaliacao=rating;
  }

  abrirPlayer(filme: Filme) {
    this.appService.executar(filme.storage).subscribe(resposta => {
      console.log('Filme executado com sucesso!', resposta);
    }, erro => {
      console.error('Erro ao executar filme', erro);
    });
  }
    

}
