import store from '@/store';
import { apiURL } from "@/utils";
import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";

@Module({dynamic: true, name:'permissionIndexStore', store, namespaced: true})
class PermissionIndexStore extends VuexModule {
  permissionsState: any =  {
    meta: {
      last_page: 1,
      current_page: 1,
      total: 0
    }
  }

  queryState: any =  {
    length: 10,
    dir: "desc",
    column: 0,
    search: "",
    page: 1
  }

  fetchingState: any =  false

  get permissions(): any {
    return this.permissionsState;
  }

  get query(): any {
    return this.queryState;
  }

  get fetching(): any {
    return this.fetchingState;
  }

  fetchData(query = null) {
    this.SET_FETCHING(true);
    return new Promise((resolve, reject) => {
      return apiURL
        .get(
          "permissions",
          query != null ? { params: query } : { params: this.queryState }
        )
        .then(res => {
          const { data, meta, links } = res.data;
          this.SET_ALL({ meta, links, data })
          resolve(res.data);
        })
        .catch(err => {
          reject(err.response);
        })
        .finally(() => {
          this.SET_FETCHING(false);
        });
    });
  }

  @Action
  setQuery(query: any) {
    this.SET_QUERY(query);
  }
  
  @Action
  resetState() {
    this.INIT_STATE;
  }

  @Mutation
  SET_ALL(data: any) {
    this.permissionsState = data;
  }

  @Mutation
  SET_FETCHING(stus: any) {
    this.fetchingState = stus;
  }

  @Mutation
  SET_QUERY(query: any) {
    this.queryState = query;
  }
  
  @Mutation
  INIT_STATE() {
    this.permissionsState =  {
      meta: {
        last_page: 1,
        current_page: 1,
        total: 0
      }
    }
  
    this.queryState =  {
      length: 10,
      dir: "desc",
      column: 0,
      search: "",
      page: 1
    }
  
    this.fetchingState =  false
  }
}

const permissionIndexStore = getModule(PermissionIndexStore);
export default permissionIndexStore;