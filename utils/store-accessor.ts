import { Store } from 'vuex';
import { getModule } from 'vuex-module-decorators';
import ErrorsModule from '~/store/errors';

/* eslint import/no-mutable-exports: 0 */

let errorsStore: ErrorsModule;

function initialiseStores(store: Store<any>): void {
  errorsStore = getModule(ErrorsModule, store);
}

export { errorsStore, initialiseStores };
