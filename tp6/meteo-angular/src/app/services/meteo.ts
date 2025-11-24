import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MeteoService {
  
  constructor() {}

  getMeteo(name: string): Promise<any> {
    const apiKey = "02816333a1a73457e18eba7f12f2c35d";
    console.log("from service", name);

    return fetch(
      
      `https://api.openweathermap.org/data/2.5/weather/?q=${name}&units=metric&lang=fr&appid=${apiKey}`
    )
      .then(response => response.json())
      .then(json => {
        // test du code retour
        // 200 = OK, 404 = city not found
        if (json.cod === 200) {
          return Promise.resolve(json);
        } else {
          console.error(`Météo introuvable pour ${name} (${json.message})`);
          return Promise.reject(`Météo introuvable pour ${name} (${json.message})`);
        }
      });
  }
}
