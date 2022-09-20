import { UserResource, RoleResource, CustomerResource, SupplierResource } from './../../../models/index';
import {
  apiURL,
  convertObjectToFormData
} from "@/utils";
import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import store from "@/store";
import alertStore from '../alert';
import userIndexStore from '.';

@Module({ namespaced: true, dynamic: true, store, name: 'userSingleStore' })
class UserSingleStore extends VuexModule {
  userResource!: UserResource;

  roleCollection: RoleResource[] = [];

  loading: boolean = false;

  get user(): UserResource {
    return this.userResource;
  }

  get isLoading(): boolean {
    return this.loading;
  }

  get rolesAll(): RoleResource[] {
    return this.roleCollection;
  }

  @Mutation
  SET_USER(user: UserResource) {
    this.userResource = user;
  }

  @Mutation
  UPDATE_PASSWORD(pass: string) {
    this.userResource.password = pass;
  }

  @Mutation
  SET_FETCHING(value: boolean) {
    this.loading = value;
  }

  @Mutation
  SET_ROLES_ALL(data: RoleResource[]) {
    this.roleCollection = data;
  }

  @Mutation
  INIT_STATE() {
    this.userResource = {
      id: 0,
      name: "",
      email: "",
      password: "",
      role: []
    }
    this.loading = false;
    this.roleCollection = [];
  }

  @Mutation
  UPDATE_EMAIL(email: string) {
    this.userResource.email = email;
  }

  @Mutation
  UPDATE_ROLE(role: []) {
    this.userResource.role = role;
  }

  @Mutation
  UPDATE_NAME(name: string) {
    this.userResource.name = name;
  }

  @Action({})
  updateUserProfile(data: UserResource) {
    let formData = new FormData();
    convertObjectToFormData(data, formData);

    formData.append("_method", 'put')
    return new Promise((resolve, reject) => {
      apiURL.post(`auth/update/${data.id}`, formData)
        .then(({
          data
        }) => {
          resolve({
            data
          })
        })
        .catch(({
          response
        }) => reject(response))
    })
  }

  @Action({})
  updateCustomerProfile(data: CustomerResource) {
    let formData = new FormData();
    convertObjectToFormData(data, formData);

    formData.append("_method", 'put')
    return new Promise((resolve, reject) => {
      apiURL.post(`customers/${data.id}`, formData)
        .then(({
          data
        }) => {
          resolve(data)
        })
        .catch(({
          response
        }) => reject(response))
    })
  }

  @Action({})
  updateSupplierProfile(data: SupplierResource) {
    let formData = new FormData();
    convertObjectToFormData(data, formData)
    formData.append('_method', 'put')
    return new Promise((resolve, reject) => {
      apiURL.post(`suppliers/${data.supplier_code}`, formData)
        .then(({
          data
        }) => {
          resolve(data)
        })
        .catch(({
          response
        }) => reject(response))
    })
  }

  @Action({})
  loginUser(user: UserResource) {
    this.loading = true;
    return new Promise((resolve, reject) => {
      return apiURL
        .post("auth/login", user)
        .then(res => {
          this.SET_USER(res.data.user);
          sessionStorage.setItem("user", JSON.stringify(res.data.user));
          sessionStorage.setItem("authToken", res.data.access_token);
          sessionStorage.setItem("userLoggedIn", "logged");

          let d = new Date()
          d.setHours(d.getHours() + (res.data.expires_in / 60 / 60))
          sessionStorage.setItem("expires_in", d.toString());
          resolve(res);
        })  
        .catch(err => {
          reject(err);
        })
        .finally(() => this.loading = false);
    });
  }

  registerUser(user: UserResource) {
    this.loading = true;
    return new Promise((resolve, reject) => {
      return apiURL
        .post("register", user)
        .then(({
          data
        }) => {
          resolve(data);
        })
        .catch(({
          response
        }) => {
          reject(response);
        })
        .finally(() => this.loading = false);
    });
  }

  @Action({})
  fetch(user: UserResource) {
    alertStore.resetState();
    return new Promise((resolve, reject) => {
      apiURL
        .get(`users/${user.id}`)
        .then(({
          data: {
            data
          }
        }) => {

          this.setUser(data);
          this.fetchRolesAll();
          resolve(data)
        })
        .catch(err => reject(err));
    })

  }

  @Action({commit: "SET_ROLES_ALL"})
  fetchRolesAll() {
    apiURL
      .get("roles", {
        params: {
          showData: true
        }
      })
      .then(res => {
        return res.data;
      })
      .catch(err => console.log(err));
  }

  @Action({})
  store(user: UserResource) {
    this.loading = true;
    alertStore.resetState();

    return new Promise((resolve, reject) => {
      apiURL
        .post("users", user)
        .then(res => {
          userIndexStore.fetchData();
          resolve(res);
        })
        .catch(error => {
          let message = error.response.data.message || error.message;
          let errors = error.response.data.errors;
          alertStore.setAlert({
            message,
            errors,
            color: "danger"
          });
          reject(error.response);
        })
        .finally(() => this.loading = false);
    });
  }

  @Action({})
  me() {
    return new Promise((resolve, reject) => {
      apiURL.post('auth/me')
        .then(({
          data
        }) => resolve(data))
        .catch((response) => reject(response))
    })
  }

  @Action({})
  update(user: UserResource) {
    this.loading = true;
    return new Promise((resolve, reject) => {
      apiURL
        .put(`users/${user.id}`, user)
        .then(res => {
          userIndexStore.fetchData();
          resolve(res);
        })
        .catch(err => {
          let message = err.response.data.message || err.message;
          let errors = err.response.data.errors;
          alertStore.setAlert({
            message,
            errors,
            color: "danger"
          });
          reject(err);
        })
        .finally(() => this.loading = false);
    });
  }

  @Action({})
  delete(user: UserResource) {
    this.loading = true;
    return new Promise((resolve, reject) => {
      apiURL
        .delete(`users/${user.id}`, { data: user})

        .then(res => {
          userIndexStore.fetchData();
          resolve(res);
        })
        .catch(err => {
          let {
            errors,
            message
          } = err.reponse.data;
          alertStore.setAlert({
            errors,
            message,
            color: "danger"
          });
          reject(err);
        })
        .finally(() => this.loading = false);
    });
  }

  @Action({})
  logout() {
    return new Promise((resolve, reject) => {
      return apiURL
        .get("auth/logout")
        .then(res => {
          this.INIT_STATE;
          sessionStorage.removeItem("authToken");
          sessionStorage.removeItem("user");
          sessionStorage.removeItem("userLoggedIn");

          sessionStorage.removeItem('expires_in')
          sessionStorage.removeItem('notifyTokenExpireBefore5Minute')
          resolve(res.data);
        })
        .catch(err => reject(err.response));
    });
  }

  @Action({})
  resetState() {
    this.INIT_STATE;
  }

  @Action({})
  setUser(
    user: UserResource = {
      id: 0,
      email: "",
      password: "",
      name: "",
      role: []
    }
  ) {
    this.SET_USER(user);
  }

  @Action({})
  updateRole(role: any) {
    this.UPDATE_ROLE(role);
  }

  @Action({commit: "UPDATE_NAME"})
  updateName(name: string) {
    return name;
  }

  @Action({commit: "UPDATE_EMAIL"})
  updateEmail(email: string) {
    return email;
  }

  @Action({commit: "UPDATE_EMAIL"})
  updatePassword(password: string) {
    return password;
  }
}

const userSingleStore = getModule(UserSingleStore);
export default userSingleStore;