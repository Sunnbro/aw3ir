import { Component, signal } from '@angular/core';
import { MeteoComponent } from './meteo/meteo';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [MeteoComponent],
  standalone: true,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('⛅ Weather webapp @Master 3ir²')
;
}
