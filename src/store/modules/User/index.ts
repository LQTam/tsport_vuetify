import store from '@/store';
import { apiURL } from "@/utils";
import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import alertStore from '../alert';


@Module({dynamic: true, name: "userIndexStore", store, namespaced: true})
class UserIndexStore extends VuexModule {
  usersState: any;

  fetchingState: boolean = false;

  paginationState: any;

  sortKeyState: string = "id";

  sortGroupState: any;

  queryState: any;

  get users(): any {
    return this.usersState;
  }

  get fetching(): any {
    return this.fetchingState;
  }

  get pagination(): any {
    return this.paginationState;
  }

  get sortKey(): any {
    return this.sortKeyState;
  }

  get sortGroup(): any {
    return this.sortGroupState;
  }

  get query(): any {
    return this.queryState;
  }

  @Mutation
  SET_ALL(data: any) {
    this.usersState = data;
  }

  @Mutation
  SET_FETCHING(data: any) {
    this.fetchingState = data;
  }
  
  @Mutation
  SET_PAGINATION(pagination: any) {
    this.paginationState = pagination;
  }

  @Mutation
  SET_KEY(key: any) {
    this.sortKeyState = key;
  }

  @Mutation
  SET_PAGE(page: any) {
    this.usersState.meta.current_page = page;
  }

  @Mutation
  SET_GROUP(sortGroup: any) {
    this.sortGroupState = sortGroup;
  }

  @Mutation
  SET_QUERY(query: any) {
    this.queryState = query;
  }

  @Mutation
  INIT_STATE() {
    this.usersState = {
      meta: {
        last_page: 1,
        current_page: 1,
        total: 0
      }
    },
    this.fetchingState = false,
    this.paginationState = {
      page: 1,
      dir: "desc",
      column: 0,
      search: "",
      length: 10
    },
    this.sortKeyState = "id",
    this.sortGroupState = {},
    this.queryState = {
      length: 10,
      page: 1,
      column: 0,
      dir: "desc",
      search: ""
    }
  }

  @Action({})
  fetchData(query = null) {
    this.fetchingState = true;
    return new Promise((resolve, reject) => {
      return apiURL
        .get(
          "users",
          // { params: state.query },
          query != null ? { params: query } : { params: this.query }
        )
        .then(res => {
          const data = res.data;
          this.SET_ALL(data);
          resolve(data);
        })
        .catch(err => {
          alertStore.setAlert(err.reponse)
          reject(err.response);
        })
        .finally(() => {
          this.fetchingState = false;
        });
    });
  }

  @Action({})
  setQuery(query: any) {
    this.setQuery(query);
  }

  @Action({})
  resetState() {
    this.INIT_STATE();
  }
}

const userIndexStore = getModule(UserIndexStore);

export default userIndexStore;