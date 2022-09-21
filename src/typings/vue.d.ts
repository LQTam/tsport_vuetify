import { Router } from "vue-router";
import { Store } from "vuex";
import { RootState } from "..";
import axios from 'axios';
import {Swal} from "@/utils"
declare module "vue/types/vue" {
    interface Vue {
        $http: typeof axios;
        $swal: typeof Swal;
        $store: Store<RootState>;
        $router: Router;
        $storage: Storage;
    }
}