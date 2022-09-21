import store from '@/store';
import { apiURL } from "@/utils";
import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import alertStore from './alert';
import roleIndexStore from './roleIndexStore';

@Module({dynamic:true, name:"roleSingleStore", store, namespaced: true})
class RoleSingleStore extends VuexModule {
  roleState: any = {
    id: "",
    name: "",
    permission: []
  };

  permissionsAllState: any = [];

  fetchingState: any = false;

  get role(): any {
    return this.roleState;
  }

  get fetching(): any {
    return this.fetchingState;
  }

  get permissionsAll(): any {
    return this.permissionsAllState;
  }

  @Mutation
  SET_FETCHING(stus: any) {
    this.fetchingState = stus;
  }

  @Mutation
  UPDATE_NAME(name: any) {
    this.role.name= name;
  }

  @Mutation
  UPDATE_PERMISSION(permission: any) {
    this.role.permission = permission;
  }

  @Mutation
  SET_PERMISSIONS_ALL(all: any) {
    this.permissionsAllState = all;
  }

  @Mutation
  SET_ROLE(role: any) {
    this.roleState = role;
  }

  @Mutation
  INIT_STATE() {
    this.roleState = {
      id: "",
      name: "",
      permission: []
    };
    this.permissionsAllState = [];
    this.fetchingState = false;
  }

  @Action
  fetch() {
    apiURL
      .get(`roles/${this.roleState.id}`, this.roleState)
      .then(res => {
        this.SET_ROLE(res.data.data);
      })
      .catch(err => {
        const { errors, message } = err.response.data;
        alertStore.setAlert({ errors, message, color: "danger" })
      });
      this.fetchPermisisonsAll();
  }
  
  @Action
  fetchPermisisonsAll() {
    apiURL
      .get("permissions", { params: { showData: true } })
      .then(({ data }) => {
        this.SET_PERMISSIONS_ALL(data);
      })
      .catch(({ response }) =>
        alertStore.setAlert({ errors: response.data, message: response.data, color: "danger" })
      );
  }
  
  @Action
  createRole() {
    this.SET_FETCHING(true);
    const role = {
      ...this.roleState,
      permission: getPermissionID(this.roleState.permission)
    };
    return new Promise((resolve, reject) => {
      apiURL
        .post("roles", role)
        .then(res => {
          roleIndexStore.fetchData();
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
  update() {
    this.SET_FETCHING(true);
    const role = {
      ...this.roleState,
      permission: getPermissionID(this.roleState.permission)
    };
    return new Promise((resolve, reject) => {
      apiURL
        .put(`roles/${this.roleState.id}`, role)
        .then(res => {
          roleIndexStore.fetchData(); 
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
    const role = {
      ...this.roleState,
      permission: getPermissionID(this.roleState.permission)
    };
    return new Promise((resolve, reject) => {
      apiURL
        .delete(`roles/${this.roleState.id}`, role)
        .then(res => {
          roleIndexStore.fetchData(); 
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
  updatePermission(per: any) {
    this.UPDATE_PERMISSION(per);
  }

  @Action
  setRole(role: any = { id: "", name: "", permission: [] }) {
    this.SET_ROLE(role);
  }

  @Action
  resetState() {
    this.INIT_STATE;
  }
}
function getPermissionID(array: any[]) {
  const permission: any = [];
  if (array) {
    array.forEach(v => permission.push(v.id));
  }
  return permission;
}

const roleSingleStore = getModule(RoleSingleStore);
export default roleSingleStore;
