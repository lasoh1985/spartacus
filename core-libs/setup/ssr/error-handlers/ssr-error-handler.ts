import { ErrorHandler, Injectable, inject } from '@angular/core';
import { Logger } from '@spartacus/core';
import { loggerFeatureFlag } from '../logger';

export const ssrErrorHandlerFactory = () => {
  const isLoggerEnabled = inject(loggerFeatureFlag);

  return isLoggerEnabled ? new SsrErrorHandler() : new ErrorHandler();
};

@Injectable({
  providedIn: 'root',
})
export class SsrErrorHandler implements ErrorHandler {
  logger = inject(Logger);

  handleError(error: any): void {
    this.logger.error(error);
  }
}
