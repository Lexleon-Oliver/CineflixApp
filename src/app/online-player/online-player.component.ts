import { Component, Input, OnInit } from '@angular/core';
import { SafeUrlPipe } from "../pipes/safe-url.pipe";

@Component({
  selector: 'app-online-player',
  standalone: true,
  imports: [SafeUrlPipe],
  templateUrl: './online-player.component.html',
  styleUrl: './online-player.component.scss'
})
export class OnlinePlayerComponent implements OnInit{

  @Input() type: string = 'serie';  // 'filme' ou 'serie'
  @Input() imdb: string = '';       // ID do IMDB ou TMDB
  @Input() season?: string;         // Temporada (opcional para filmes)
  @Input() episode?: string;        // Episódio (opcional para filmes)
  iframeSrc: string = '';


  ngOnInit(): void {
    this.updateIframeSrc();
  }

  updateIframeSrc() {
    // Constrói a URL do iframe baseado nos inputs
    const seasonPath = this.season ? `/${this.season}` : '';
    const episodePath = this.episode ? `/${this.episode}` : '';
    this.iframeSrc = `https://superflixapi.dev/${this.type}/${this.imdb}${seasonPath}${episodePath}`;
  }
}
