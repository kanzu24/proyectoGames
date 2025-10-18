import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-videoj',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './videoj.component.html',
  styleUrl: './videoj.component.css'
})
export class VideojComponent {
  
  videojuegos: string [] = [];

  nuevoJuego: string = "";

  addJuego() {
    if(this.nuevoJuego && this.nuevoJuego.trim()){
      this.videojuegos.push(this.nuevoJuego.trim());

      this.nuevoJuego = "";
    }
  }

}
