import { Store } from 'vuex';
import { Plugin } from '@nuxt/types';

// Declare services for usage in vue components
declare module 'vue/types/vue' {
    interface Vue {
        // declare services here
    }
}

declare module 'vuex-module-decorators' {
    interface VuexModule<S = ThisType<any>, R = any> {
        store: Store<any>;
    }
}

// Declare services for usage in vuex actions
declare module 'vuex' {
    interface Store<S> {
        // declare services here
    }
}

const serviceInjector: Plugin = (context, inject) => {
    // declare services here
};

export default serviceInjector;
