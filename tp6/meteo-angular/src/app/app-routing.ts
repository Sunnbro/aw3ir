import { Routes } from '@angular/router';
import { MeteoComponent } from './meteo/meteo';
import { MeteoDetailComponent } from './meteo-detail/meteo-detail';

export const appRoutes: Routes = [
  { path: '', component: MeteoComponent },
  { path: 'meteo/:name', component: MeteoDetailComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
