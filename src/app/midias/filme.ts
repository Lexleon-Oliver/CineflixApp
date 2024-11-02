export class Filme {
    id: number;
    tmdb: string;
    name: string;
    nameBr: string;
    year: string;
    description: string;
    thumbnail: string;
    background: string;
    storage: string;
    genre: string;
    rating: number;
    minAge: number;
    time: number;

    constructor(id: number, tmdb:string, name: string, nameBr: string, year: string, description: string,
                thumbnail: string, background: string, storage: string, genre: string, rating: number,minAge: number, time: number) {
        this.id = id;
        this.tmdb = tmdb;
        this.name = name;
        this.nameBr = nameBr;
        this.year = year;
        this.description = description;
        this.thumbnail = thumbnail;
        this.background = background;
        this.storage = storage;
        this.genre = genre;
        this.rating = rating;
        this.minAge = minAge;
        this.time = time;
    }
}
