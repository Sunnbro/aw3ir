import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MeteoItem } from '../meteoItem';

@Component({
  selector: 'app-meteo',
  standalone: true,
  imports: [CommonModule, FormsModule], // <-- IMPORTS OBLIGATOIRES
  templateUrl: './meteo.html',
  styleUrl: './meteo.css'
})
export class MeteoComponent {
  city: MeteoItem = { name: '', weather: '' };
  cities: MeteoItem[] = [];

  onSubmit() {
    if (this.city.name && this.city.name.trim().length >= 3) {
      const newCity: MeteoItem = {
        id: this.cities.length + 1,
        name: this.city.name,
        weather: '☀️'
      };
      this.cities.push(newCity);
      this.city.name = '';
    }
  }
}
