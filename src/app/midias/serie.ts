import { Season } from "./season";

export class Serie {
    id: number;
    name: string;
    nameBr: string;
    year: string;
    description: string;
    thumbnail: string;
    background: string;
    genre: string;
    rating: number;
    minAge: number;
    time: number;
    completed: boolean;
    season: Season[];


    constructor(id: number, name: string, nameBr: string, year: string, description: string,
                thumbnail: string, background: string, genre: string, rating: number, minAge: number,
                time: number, completed: boolean, season: Season[]) {
        this.id = id;
        this.name = name;
        this.nameBr = nameBr;
        this.year = year;
        this.description = description;
        this.thumbnail = thumbnail;
        this.background = background;
        this.genre = genre;
        this.rating = rating;
        this.minAge = minAge;
        this.time =time;
        this.completed = completed;
        this.season = season;
    }
}