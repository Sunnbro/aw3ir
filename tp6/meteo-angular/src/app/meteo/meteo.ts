import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MeteoItem } from '../meteoItem';

@Component({
  selector: 'app-meteo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './meteo.html',
  styleUrl: './meteo.css'
})
export class MeteoComponent {
  city: MeteoItem = { id: 0, name: '', weather: null };
  cityList: MeteoItem[] = [];

  constructor() {
    this.loadCityList();
  }

  // Charger la liste depuis le localStorage
  loadCityList() {
    const storedList = localStorage.getItem('cityList');
    if (storedList) {
      this.cityList = JSON.parse(storedList);
    } else {
      this.cityList = [];
    }
  }

  // Ajouter une ville
  onSubmit() {
    if (this.city.name && !this.isCityExist(this.city.name)) {
      const newCity: MeteoItem = {
        id: this.cityList.length + 1,
        name: this.city.name,
        weather: '☀️'
      };
      this.cityList.push(newCity);
      this.city.name = '';
      this.saveCityList();
      console.log(newCity.name, 'ajouté à la liste');
    } else {
      console.log(this.city.name, 'existe déjà dans la liste');
    }
  }

  // Supprimer une ville
  remove(city: MeteoItem) {
    this.cityList = this.cityList.filter(item => item.name !== city.name);
    this.saveCityList();
  }

  // Vérifier si la ville existe déjà
  isCityExist(cityName: string): boolean {
    return this.cityList.some(
      item => item.name?.toUpperCase() === cityName.toUpperCase()
    );
  }

  // Sauvegarder dans localStorage
  saveCityList() {
    localStorage.setItem('cityList', JSON.stringify(this.cityList));
  }
}
