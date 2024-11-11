import { Component, Input, OnInit } from '@angular/core';
import {VgCoreModule} from '@videogular/ngx-videogular/core';
import {VgControlsModule} from '@videogular/ngx-videogular/controls';
import {VgOverlayPlayModule} from '@videogular/ngx-videogular/overlay-play';
import {VgBufferingModule} from '@videogular/ngx-videogular/buffering';
@Component({
  selector: 'app-online-player',
  standalone: true,
  imports: [
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
  ],
  templateUrl: './online-player.component.html',
  styleUrl: './online-player.component.scss'
})
export class OnlinePlayerComponent implements OnInit{

  @Input() videoUrl: string | null = null;
  videoError: boolean = false;

  constructor(){
  }

  onError() {
    this.videoError = true;
  }


  ngOnInit(): void {

  }

}
