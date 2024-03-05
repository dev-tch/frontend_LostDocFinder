import {Component, Inject, Optional} from '@angular/core';
import {isServer} from "../../../services/platform";
import {RESPONSE} from "../../../express.tokens";
import {Response} from "express";

@Component({
  selector: 'app-not-found-page',
  standalone: true,
  templateUrl: './not-found-page.component.html',
})
export class NotFoundPageComponent {

    constructor(
        @Optional() @Inject(RESPONSE) private response: Response,
      ) {
        if (isServer() && this.response) {
          this.response.status(404);
        } else {
          console.error(`response status code ${404}`);
        }
      }
    }