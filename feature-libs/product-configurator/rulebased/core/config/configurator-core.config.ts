import { Injectable } from '@angular/core';
import { Config } from '@spartacus/core';

export interface ProductConfiguratorCoreConfig {
  enableVariantSearch?: boolean;
}

@Injectable({
  providedIn: 'root',
  useExisting: Config,
})
export abstract class ConfiguratorCoreConfig {
  productConfigurator?: ProductConfiguratorCoreConfig;
}

 
