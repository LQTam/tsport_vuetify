import store from '@/store';
import { SnackbarItem } from '@/typings';
import { getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import ToastQueue from '@/plugins/queue';

@Module({ namespaced: true, dynamic: true, store, name: "appStore" })
class AppStore extends VuexModule {
  snackbar: SnackbarItem | null = null;

  toastQueue= new ToastQueue();

  @Mutation
  SET_SNACKBAR(data: SnackbarItem) {
    this.snackbar = data;
  }
}

const appStore = getModule(AppStore);
export default appStore;