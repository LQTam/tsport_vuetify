import store from '@/store';
import { apiURL } from "@/utils";
import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import alertStore from '../alert';
import permissionIndexStore from '.';

@Module({dynamic: true, name:'PermissionSingleStore', store, namespaced: true})
class PermissiongSingleStore extends VuexModule {
  permissionState: any= {
    id: "",
    name: ""
  }
  fetchingState: any= false

  get permission(): any {
    return this.permissionState;
  }

  get fetching(): any {
    return this.fetchingState;
  }

  @Action
  fetch() {
    apiURL
      .get(`permissions/${this.permissionState.id}`, this.permissionState)
      .then(res => {
        this.SET_PERMISSION(res.data.data);
      })
      .catch(err => {
        let { errors, message } = err.response.data;
        alertStore.setAlert({ errors, message, color: "danger" });
      });
  }

  @Action
  store() {
    this.SET_FETCHING(true);
    return new Promise((resolve, reject) => {
      apiURL
        .post("permissions", this.permissionState)
        .then(res => {
          permissionIndexStore.fetchData();
          resolve(res);
        })
        .catch(err => {
          const { errors, message } = err.response.data;
          alertStore.setAlert({ errors, message, color: "danger" })
          reject(err.response);
        })
        .finally(() => this.SET_FETCHING(false));
    });
  }
  
  @Action
  update() {
    this.SET_FETCHING(true);
    return new Promise((resolve, reject) => {
      apiURL
        .put(`permissions/${this.permissionState.id}`, this.permissionState)
        .then(res => {
          permissionIndexStore.fetchData();
          resolve(res);
        })
        .catch(err => {
          const { errors, message } = err.reponse.data;
          alertStore.setAlert({ errors, message, color: "danger" })
          reject(err);
        })
        .finally(() => this.SET_FETCHING(false));
    });
  }

  @Action
  delete() {
    this.SET_FETCHING(true);
    return new Promise((resolve, reject) => {
      apiURL
        .delete(`permissions/${this.permissionState.id}`, this.permissionState)
        .then(res => {
          permissionIndexStore.fetchData();
          resolve(res);
        })
        .catch(err => {
          const { errors, message } = err.reponse.data;
          alertStore.setAlert({ errors, message, color: "danger" })
          reject(err);
        })
        .finally(() => this.SET_FETCHING(false));
    });
  }

  @Action
  updateName(name: any) {
    this.UPDATE_NAME(name);
  }

  @Action
  setPermission(permission = { id: "", name: "" }) {
    this.SET_PERMISSION(permission);
  }

  @Action
  resetState() {
    this.INIT_STATE;
  }

  @Mutation
  SET_FETCHING(stus: any) {
    this.fetchingState = stus;
  }

  @Mutation
  UPDATE_NAME(name: any) {
    this.permissionState.name = name;
  }

  @Mutation
  SET_PERMISSION(permission: any) {
    this.permissionState = permission;
  }

  @Mutation
  INIT_STATE() {
    this.permissionState= {
      id: "",
      name: ""
    }
    this.fetchingState= false
  }
}

const PermissionSingleStore = getModule(PermissiongSingleStore);

export default PermissionSingleStore;