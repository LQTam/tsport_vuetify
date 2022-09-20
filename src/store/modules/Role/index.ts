import store from '@/store';
import { apiURL } from "@/utils";
import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";

@Module({name: "roleIndexStore", dynamic: true, store, namespaced: true})
class RoleIndexStore extends VuexModule {
  rolesState: any = {
    meta: {
      last_page: 1,
      current_page: 1,
      total: 0
    }
  };

  queryState: any = {
    length: 10,
    dir: "desc",
    column: 0,
    search: "",
    page: 1
  };

  fetchingState: any = false;

  get roles(): any {
    return this.rolesState;
  }

  get query(): any {
    return this.queryState;
  }

  get fetching(): any {
    return this.fetchingState;
  }

  @Action
  fetchData(query = null) {
    this.fetchingState = true;
    return new Promise((resolve, reject) => {
      return apiURL
        .get(
          "roles",
          query != null ? { params: query } : { params: this.queryState }
        )
        .then(res => {
          const { data, meta, links } = res.data;
          this.SET_ALL({meta, links, data});
          resolve(res.data);
        })
        .catch(err => {
          reject(err.response);
        })
        .finally(() => {
          this.fetchingState = false;
        });
    });
  }

  @Mutation
  SET_FETCHING(stus: any) {
    this.fetchingState = stus;
  }

  @Mutation
  SET_ALL(data: any) {
    this.rolesState = data;
  } 

  @Mutation
  SET_QUERY(query: any) {
    this.queryState = query;
  }

  @Mutation
  INIT_STATE() {
    this.rolesState = {
      meta: {
        last_page: 1,
        current_page: 1,
        total: 0
      }
    },
    this.queryState = {
      length: 10,
      dir: "desc",
      column: 0,
      search: "",
      page: 1
    },
    this.fetchingState = false
  }

  @Action({commit: "SET_QUERY"})
  setQuery(query: any) {
    return query;
  }

  @Action
  resetState() {
    this.INIT_STATE;
  }
}

const roleIndexStore = getModule(RoleIndexStore);
export default roleIndexStore;