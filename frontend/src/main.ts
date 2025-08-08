import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app.config';
import { AppComponent } from './app.component';
import './polyfills.ts';

// bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));

bootstrapApplication(AppComponent, appConfig)
  .then(() => console.log('Angular app started successfully'))
  .catch((err) => console.error(err));
