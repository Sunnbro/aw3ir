import { Component, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { MeteoComponent } from './meteo/meteo';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MeteoComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = signal('⛅ Weather webapp @Master 3ir²');
}
