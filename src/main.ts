import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { VideojComponent } from './app/videoj/videoj.component';

bootstrapApplication(VideojComponent, appConfig)
  .catch((err) => consle.error(err));