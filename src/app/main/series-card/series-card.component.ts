import { AppService } from '../../services/app.service';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Episode } from 'src/app/midias/episode';
import { Filme } from 'src/app/midias/filme';
import { Serie } from 'src/app/midias/serie';
import { ModalService } from  "src/app/modal/modal.service"

@Component({
  selector: 'app-series-card',
  templateUrl: './series-card.component.html',
  styleUrls: ['./series-card.component.scss']
})
export class SeriesCardComponent implements OnInit {

  constructor(public modalService: ModalService,
    private router: Router,
    private appService: AppService) { }


  @Input() serieObj: Serie;
  @Input() filmeObj: Filme;
  @Input() episodeObj: Episode;
  @Input() iconSeason: string;

  playEpisode(episode: Episode) {
    this.appService.executar(episode.storage).subscribe(resposta => {
      console.log('Episódio executado com sucesso!', resposta);
    }, erro => {
      console.error('Erro ao executar episódio', erro);
    });
  }

  onClick(event) {
    var target = event.target || event.srcElement || event.currentTarget;
    var idAttr = target.attributes.src;
    let value = idAttr.nodeValue
  }

  secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 60);
    var m = Math.floor(d % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? "h " : "h ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? "min " : "min ") : "";
    return hDisplay + mDisplay;
  }

  capitalizeWords(arr) {
    let arrTreated = [];
    arr.map(el => {
      arrTreated.push(el.charAt(0).toUpperCase() + el.toLocaleLowerCase().substring(1));
    })
    return arrTreated
  }


  ngOnInit(): void {

  }

  getRelevance(rating: number): string {
    let retorno: string = '';
    switch (rating) {
    case 5:
      retorno = '81-100% relevante';
      break;
    case 4:
      retorno = '61-80% relevante';
      break;
    case 3:
      retorno = '41-60% relevante';
      break;
    case 2:
      retorno = '21-40% relevante';
      break;
    case 1:
      retorno = '1-20% relevante';
      break;
    default:
      retorno = '0% relevante';
      break;
  }
  return retorno;
  }

  assistirSerie(): void {
    this.router.navigate(['/series', this.serieObj.id]);
  }
  assistirFilme(): void {
    this.appService.rota = '/filmes';
    this.appService.setIdSelecionado(this.filmeObj.id);
    this.router.navigate(['/filmes', this.filmeObj.id]);
  }


}
