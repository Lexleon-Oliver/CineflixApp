import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-estrelas',
  templateUrl: './estrelas.component.html',
  imports:[
    CommonModule,
  ],
  standalone: true,
  styleUrls: ['./estrelas.component.scss']
})
export class EstrelasComponent implements OnInit {
  @Input() maxRating: number = 5;
  @Input() rating: number = 0;
  @Output() onRatingChange: EventEmitter<number> = new EventEmitter();

  public stars: number[];

  constructor() { }

  ngOnInit(): void {
    this.stars = Array(this.maxRating).fill(0).map((_, i) => i + 1);
  }

  public rate(event: MouseEvent) {

    const star = event.target as HTMLElement;
    const starIndex = this.stars.indexOf(Number((star.closest('span') as HTMLElement).dataset['value']));
    if (starIndex !== -1) {
      const newRating = starIndex + 1;
      this.rating = newRating === this.rating ? newRating - 1 : newRating;
      this.onRatingChange.emit(this.rating);
    }
  }
}

