import {inject, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser, isPlatformServer} from "@angular/common";

export const isServer = () => isPlatformServer(inject(PLATFORM_ID))
export const isBrowser = () => isPlatformBrowser(inject(PLATFORM_ID))
