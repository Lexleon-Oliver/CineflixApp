export class Episode {
    id: number;
    storage: string;
    nameEpisode: string;
    numEpisode: number;
    season: number;


    constructor(id: number, storage: string, nameEpisode: string, numEpisode: number, season: number) {
        this.id = id;
        this.storage = storage;
        this.nameEpisode = nameEpisode;
        this.numEpisode = numEpisode
        this.season = season;
    }
}