import store from '@/store';
import { apiURL } from "@/utils";
import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import alertStore from '../alert';

@Module({dynamic: true, name: "productIndexStore", store, namespaced: true})
class ProductIndexStore extends VuexModule {
  productsState: any =  {
    meta: {
      last_page: 1,
      current_page: 1,
      total: 0
    }
  };

  fetchingState: any =  false;

  paginationState: any =  {
    page: 1,
    dir: "desc",
    column: 0,
    search: "",
    length: 10
  };

  sortKeyState: any =  "id";

  sortGroupState: any =  {};

  queryState: any =  {
    length: 10,
    page: 1,
    column: 0,
    dir: "desc",
    search: ""
  };

  get products(): any {
    return this.productsState;
  }

  get fetching(): any {
    return this.fetchingState;
  }

  get pagination(): any {
    return this.paginationState;
  }

  get sortGroup(): any {
    return this.sortGroupState;
  }

  get sortKey(): any {
    return this.sortKeyState;
  }

  get query(): any {
    return this.queryState;
  }

  @Mutation
  SET_ALL(data: any) {
    this.productsState = data;
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
    this.productsState.meta.current_page = page;
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
    this.productsState =  {
      meta: {
        last_page: 1,
        current_page: 1,
        total: 0
      }
    };
  
    this.fetchingState =  false;
  
    this.paginationState =  {
      page: 1,
      dir: "desc",
      column: 0,
      search: "",
      length: 10
    };
  
    this.sortKeyState =  "id";
  
    this.sortGroupState =  {};
  
    this.queryState =  {
      length: 10,
      page: 1,
      column: 0,
      dir: "desc",
      search: ""
    };
  }

  @Action
  fetchData(query = null) {
    this.SET_FETCHING(true);
    return new Promise((resolve, reject) => {
      return apiURL
        .get(
          "products",
          query != null ? { params: query } : { params: this.queryState }
        )
        .then(res => {
          const data = res.data;
          this.SET_ALL(data);
          resolve(data);
        })
        .catch(err => {
          alertStore.setAlert(err.response);
          reject(err.response);
        })
        .finally(() => {
          this.SET_FETCHING(false);
        });
    });
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

const productIndexStore = getModule(ProductIndexStore);
export default productIndexStore;
