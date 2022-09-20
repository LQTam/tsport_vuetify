import store from '@/store';
import { apiURL } from "@/utils";
import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import alertStore from '../alert';

@Module({dynamic: true, name: 'homeProductStore', store, namespaced: true})
class HomeProductStore extends VuexModule {
  productsState: any = [];

  relatedProductsState: any = [];

  fetchingState: any = false;

  productState: any = {};

  sizesAllState: any = [];

  get products(): any {
    return this.productsState;
  }

  get product(): any {
    return this.productState;
  }

  get relatedProducts(): any {
    return this.relatedProductsState;
  }

  get sizesAll(): any {
    return this.sizesAllState;
  }

  @Action
  fetchData(query = null) {
    this.SET_FETCHING(true);
    return new Promise((resolve, reject) => {
      return apiURL
        .get(
          "getAllProducts",
          { params: query }
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

  @Action
  filterProductsBySize(query:any) {
    return new Promise((resolve, reject) => {
      return apiURL
        .get(
          "filterProductsBySize",
          { params: query }
        )
        .then(({ data }) => {
          console.log(data);
          this.SET_ALL(data);
          resolve(data);
        })
        .catch(({ response }) => {
          reject(response);
        })
    });
  }
  
  @Action
  filterProductsByKeyWord(data:any){
    return new Promise((resolve, reject) => {
      return apiURL
        .get(
          "filterProductsByKeyWord",
          { params: data }
        )
        .then(({ data }) => {
          console.log(data);
          this.SET_ALL(data);
          resolve(data);
        })
        .catch(({ response }) => {
          reject(response);
        })
    });
  }
  
  @Action
  fetchSizesAll(){
    apiURL.get('sizes')
      .then(({ data }) => {
        this.SET_SIZE_ALL(data)
      })
      .catch(({ response }) => {
        console.log(response);
      })
  }
  
  @Action
  fetch(id:any) {
    return new Promise((resolve, reject) => {
      apiURL.get(`getProduct/${id}`)
        .then(({ data: { data } }) => {
          this.SET_PRODUCT(data)
          resolve(data)
        })
        .catch(({ response }) => reject(response))
    })
  }
  
  @Action
  fetchProdsByKey(query:any){
    return new Promise((resolve,reject)=>{
      apiURL.get(`fetchProdsByKey`,{params:query})
      .then(({data})=> {
        resolve(data);
      })
      .catch(({response})=>reject(response.data))
    })
  }
  
  @Action
  fetchRelatedProducts(id:any) {
    apiURL.get(`getRelatedProducts/${id}`)
      .then(({ data: { data } }) => {
        this.SET_RELATED_PRODUCTS(data)
      })
      .catch(({ response }) => console.log(response))
  }
  
  @Mutation
  SET_ALL(data:any) {
    this.productsState = data;
  }
  
  @Mutation
  SET_SIZE_ALL(sizesAll:any) {
    this.sizesAllState = sizesAll
  }

  @Mutation
  SET_FETCHING(stus:any) {
    this.fetchingState = stus
  }
  
  @Mutation
  SET_PRODUCT(product:any) {
    this.productState = product
  }
  
  @Mutation
  SET_RELATED_PRODUCTS(relProds:any) {
    this.relatedProductsState = relProds
  }
  
  @Mutation
  INIT_STATE() {
    this.productsState = [];
    this.relatedProductsState = [];
    this.fetchingState = false;
    this.productState = {};
    this.sizesAllState= [];
  }
}

const homeProductStore = getModule(HomeProductStore);

export default homeProductStore;
