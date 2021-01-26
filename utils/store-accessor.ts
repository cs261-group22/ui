import { Store } from 'vuex';
import { getModule } from 'vuex-module-decorators';

import DashboardModule from '~/store/dashboard';

/* eslint import/no-mutable-exports: 0 */

let dashboardStore: DashboardModule;

function initialiseStores(store: Store<any>): void {
  dashboardStore = getModule(DashboardModule, store);
}

export { dashboardStore, initialiseStores };
