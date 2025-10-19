import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Videojuego } from '../models/videojuego.model';

@Injectable({
  providedIn: 'root'
})
export class VideojuegosService {
  private apiUrl = '/api/videojuegos'; // Sin http://localhost:3000

  constructor(private http: HttpClient) { }

  // Obtener todos los videojuegos
  getVideojuegos(): Observable<Videojuego[]> {
    return this.http.get<Videojuego[]>(this.apiUrl);
  }

  // Obtener un videojuego por ID
  getVideojuego(id: number): Observable<Videojuego> {
    return this.http.get<Videojuego>(`${this.apiUrl}/${id}`);
  }

  // Crear nuevo videojuego
  createVideojuego(videojuego: Videojuego): Observable<Videojuego> {
    return this.http.post<Videojuego>(this.apiUrl, videojuego);
  }

  // Actualizar videojuego
  updateVideojuego(id: number, videojuego: Videojuego): Observable<Videojuego> {
    return this.http.put<Videojuego>(`${this.apiUrl}/${id}`, videojuego);
  }

  // Eliminar videojuego
  deleteVideojuego(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}