import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VideojComponent } from './videoj/videoj.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, VideojComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  nameProyect = 'games44';
  descripcion = 'Esto es un programa de compra de videojuegos'
  autor = 'Mateo Bolivar'
}
