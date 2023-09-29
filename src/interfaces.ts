export interface IMovies {
    id: number;
    name: string;
    category: string;
    duration: number;
    price: number;
}

export type TMoviesUpdateData = Partial<Pick<IMovies, 'name' | 'category' | 'duration' | 'price'>>;