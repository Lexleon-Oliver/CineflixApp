import { Episode } from "./episode";

export class Season {
    id: number;
    numSeason: number;
    serie: number;
    seasonBack: string;
    episode: Episode[];


    constructor(id: number, numSeason: number, serie: number, seasonBack: string, episode: Episode[]) {
        this.id = id;
        this.numSeason = numSeason;
        this.serie = serie;
        this.seasonBack = seasonBack;
        this.episode = episode;
    }
}