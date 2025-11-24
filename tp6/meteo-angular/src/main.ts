import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { importProvidersFrom } from '@angular/core';
import { RouterModule } from '@angular/router'; // si tu utilises le router
import { BrowserModule } from '@angular/platform-browser';

bootstrapApplication(App, {
  providers: [
    importProvidersFrom(BrowserModule, RouterModule) // facultatif si tu utilises <router-outlet>
  ]
}).catch(err => console.error(err));
