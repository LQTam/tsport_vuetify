import { Router } from "vue-router";
import { Store } from "vuex";
import { RootState } from "..";
import axios from 'axios';
declare module "vue/types/vue" {
    interface Vue {
        $http: typeof axios;
        $store: Store<RootState>;
        $router: Router;
        $storage: Storage;
    }
}