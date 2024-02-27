import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
 .catch((err) => console.error(err));
//import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
//import { BaseModule } from './app/modules/base.module';

//platformBrowserDynamic().bootstrapModule(BaseModule);
