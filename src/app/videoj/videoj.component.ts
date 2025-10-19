import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { VideojuegosService } from '../services/videojuego.service';
import { Videojuego } from '../models/videojuego.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  providers: [VideojuegosService],
  templateUrl: './videoj.component.html',
  styleUrl: './videoj.component.css'
})
export class VideojComponent implements OnInit {
  
  videojuegos: Videojuego[] = [];
  videojuegosFiltrados: Videojuego[] = [];
  isLoading: boolean = false;
  error: string = '';

  nuevoJuego: Videojuego = {
    nombre: '',
    genero: '',
    anio: new Date().getFullYear(),
    desarrollador: '',
    calificacion: 5,
    imagen_url: ''
  };

  juegoEditando: Videojuego | null = null;
  mostrarFormulario: boolean = false;
  modoEdicion: boolean = false;
  filtroGenero: string = '';
  ordenarPor: string = 'nombre';
  mostrarPresentacion: boolean = true;

  generos: string[] = ['Todos', 'FPS', 'Acción', 'Aventura', 'RPG', 'Deportes', 'Carreras', 'Plataformas'];

  constructor(private videojuegosService: VideojuegosService) {}

  ngOnInit(): void {
    this.cargarVideojuegos();
    
    // Ocultar presentación después de 5 segundos
    setTimeout(() => {
      this.mostrarPresentacion = false;
    }, 5000);
  }

  cargarVideojuegos(): void {
    this.isLoading = true;
    this.error = '';
    
    this.videojuegosService.getVideojuegos().subscribe({
      next: (data) => {
        this.videojuegos = data;
        this.aplicarFiltros();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar videojuegos:', err);
        this.error = 'Error al cargar los videojuegos. Verifica que el servidor esté corriendo.';
        this.isLoading = false;
      }
    });
  }

  aplicarFiltros(): void {
    let juegos = [...this.videojuegos];

    // Filtrar por género
    if (this.filtroGenero && this.filtroGenero !== 'Todos') {
      juegos = juegos.filter(j => j.genero === this.filtroGenero);
    }

    // Ordenar
    juegos.sort((a, b) => {
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

    this.videojuegosFiltrados = juegos;
  }

  onFiltroChange(): void {
    this.aplicarFiltros();
  }

  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
    if (!this.mostrarFormulario) {
      this.cancelar();
    }
  }

  addJuego(): void {
    if (this.validarFormulario()) {
      this.isLoading = true;
      
      this.videojuegosService.createVideojuego(this.nuevoJuego).subscribe({
        next: (data) => {
          this.cargarVideojuegos();
          this.resetFormulario();
          this.mostrarFormulario = false;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error al crear videojuego:', err);
          this.error = 'Error al crear el videojuego';
          this.isLoading = false;
        }
      });
    }
  }

  editarJuego(juego: Videojuego): void {
    this.modoEdicion = true;
    this.mostrarFormulario = true;
    this.juegoEditando = juego;
    this.nuevoJuego = { ...juego };
  }

  actualizarJuego(): void {
    if (this.juegoEditando && this.juegoEditando.id && this.validarFormulario()) {
      this.isLoading = true;
      
      this.videojuegosService.updateVideojuego(this.juegoEditando.id, this.nuevoJuego).subscribe({
        next: (data) => {
          this.cargarVideojuegos();
          this.cancelar();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error al actualizar videojuego:', err);
          this.error = 'Error al actualizar el videojuego';
          this.isLoading = false;
        }
      });
    }
  }

  eliminarJuego(id: number | undefined): void {
    if (!id) return;
    
    if (confirm('¿Estás seguro de que deseas eliminar este videojuego?')) {
      this.isLoading = true;
      
      this.videojuegosService.deleteVideojuego(id).subscribe({
        next: () => {
          this.cargarVideojuegos();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error al eliminar videojuego:', err);
          this.error = 'Error al eliminar el videojuego';
          this.isLoading = false;
        }
      });
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
      nombre: '',
      genero: '',
      anio: new Date().getFullYear(),
      desarrollador: '',
      calificacion: 5,
      imagen_url: ''
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

  onImageError(event: any): void {
    event.target.src = 'https://via.placeholder.com/300x400/333333/FFFFFF?text=Sin+Imagen';
  }

  cerrarPresentacion(): void {
    this.mostrarPresentacion = false;
  }
}