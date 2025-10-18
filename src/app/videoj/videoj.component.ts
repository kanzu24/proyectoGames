import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Videojuego {
  id: number;
  nombre: string;
  genero: string;
  anio: number;
  desarrollador: string;
  calificacion: number;
}

@Component({
  selector: 'app-videoj',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './videoj.component.html',
  styleUrl: './videoj.component.css'
})
export class VideojComponent {
  
  videojuegos: Videojuego[] = [
    { id: 1, nombre: 'Halo 3', genero: 'FPS', anio: 2007, desarrollador: 'Bungie', calificacion: 9.5 },
    { id: 2, nombre: 'Gears of War', genero: 'Acción', anio: 2006, desarrollador: 'Epic Games', calificacion: 9.0 },
    { id: 3, nombre: 'Red Dead Redemption', genero: 'Aventura', anio: 2010, desarrollador: 'Rockstar', calificacion: 9.8 },
    { id: 4, nombre: 'Call of Duty 4', genero: 'FPS', anio: 2007, desarrollador: 'Infinity Ward', calificacion: 9.2 },
    { id: 5, nombre: 'The Elder Scrolls V: Skyrim', genero: 'RPG', anio: 2011, desarrollador: 'Bethesda', calificacion: 9.6 }
  ];

  nuevoJuego: Videojuego = {
    id: 0,
    nombre: '',
    genero: '',
    anio: new Date().getFullYear(),
    desarrollador: '',
    calificacion: 5
  };

  juegoEditando: Videojuego | null = null;
  mostrarFormulario: boolean = false;
  modoEdicion: boolean = false;
  filtroGenero: string = '';
  ordenarPor: string = 'nombre';

  generos: string[] = ['Todos', 'FPS', 'Acción', 'Aventura', 'RPG', 'Deportes', 'Carreras', 'Plataformas'];

  get videojuegosFiltrados(): Videojuego[] {
    let juegos = this.videojuegos;

    // Filtrar por género
    if (this.filtroGenero && this.filtroGenero !== 'Todos') {
      juegos = juegos.filter(j => j.genero === this.filtroGenero);
    }

    // Ordenar
    return juegos.sort((a, b) => {
      switch(this.ordenarPor) {
        case 'nombre':
          return a.nombre.localeCompare(b.nombre);
        case 'anio':
          return b.anio - a.anio;
        case 'calificacion':
          return b.calificacion - a.calificacion;
        default:
          return 0;
      }
    });
  }

  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
    if (!this.mostrarFormulario) {
      this.cancelar();
    }
  }

  addJuego(): void {
    if (this.validarFormulario()) {
      const nuevoId = this.videojuegos.length > 0 
        ? Math.max(...this.videojuegos.map(j => j.id)) + 1 
        : 1;
      
      const juego: Videojuego = {
        ...this.nuevoJuego,
        id: nuevoId
      };

      this.videojuegos.push(juego);
      this.resetFormulario();
      this.mostrarFormulario = false;
    }
  }

  editarJuego(juego: Videojuego): void {
    this.modoEdicion = true;
    this.mostrarFormulario = true;
    this.juegoEditando = juego;
    this.nuevoJuego = { ...juego };
  }

  actualizarJuego(): void {
    if (this.juegoEditando && this.validarFormulario()) {
      const index = this.videojuegos.findIndex(j => j.id === this.juegoEditando!.id);
      if (index !== -1) {
        this.videojuegos[index] = { ...this.nuevoJuego, id: this.juegoEditando.id };
      }
      this.cancelar();
    }
  }

  eliminarJuego(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este videojuego?')) {
      this.videojuegos = this.videojuegos.filter(j => j.id !== id);
    }
  }

  cancelar(): void {
    this.resetFormulario();
    this.modoEdicion = false;
    this.juegoEditando = null;
    this.mostrarFormulario = false;
  }

  resetFormulario(): void {
    this.nuevoJuego = {
      id: 0,
      nombre: '',
      genero: '',
      anio: new Date().getFullYear(),
      desarrollador: '',
      calificacion: 5
    };
  }

  validarFormulario(): boolean {
    return !!(
      this.nuevoJuego.nombre.trim() &&
      this.nuevoJuego.genero.trim() &&
      this.nuevoJuego.desarrollador.trim() &&
      this.nuevoJuego.anio >= 2005 && this.nuevoJuego.anio <= 2013 &&
      this.nuevoJuego.calificacion >= 0 && this.nuevoJuego.calificacion <= 10
    );
  }

  getEstrellas(calificacion: number): string {
    const estrellas = Math.round(calificacion);
    return '★'.repeat(estrellas) + '☆'.repeat(10 - estrellas);
  }
}