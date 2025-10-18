export interface Videojuego {
  id?: number;
  nombre: string;
  genero: string;
  anio: number;
  desarrollador: string;
  calificacion: number;
  imagen_url?: string;
  created_at?: Date;
  updated_at?: Date;
}