import { Component, signal } from '@angular/core';
import { MeteoComponent } from './meteo/meteo';
import { RouterOutlet } from '@angular/router'; // si tu as du router

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MeteoComponent], // importe tout ce dont tu as besoin
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = signal('⛅ Weather webapp @Master 3ir²');
}
