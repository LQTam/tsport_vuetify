import store from '@/store';
import { apiURL } from "@/utils";
import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import alertStore from './alert';

@Module({dynamic: true, name:"productSingleStore", store, namespaced: true})
class ProductSingleStore extends VuexModule {
  productState: any = {
    id: "",
    product_name: "",
    product_price: "",
    product_description: "",
    size: [],
    color: [],
    image: [],
    supplier: ""
  };

  rolesAllState: any = [];

  sizesAllState: any = [];

  colorsAllState: any = [];

  loadingState: any = false;

  suppliersAllState: any = [];

  get product(): any {
    return this.productState;
  }

  get loading(): any {
    return this.loadingState;
  }

  get rolesAll(): any {
    return this.rolesAllState;
  }

  get sizesAll(): any {
    return this.sizesAllState;
  }

  get colorsAll(): any {
    return this.colorsAllState;
  }

  get suppliersAll(): any {
    return this.suppliersAllState;
  }

  @Mutation
  SET_PRODUCT(product:any) {
    this.productState = product;
  }

  @Mutation
  SET_COLORS_ALL(colors:any) {
    this.colorsAllState = colors;
  }

  @Mutation
  SET_SIZES_ALL(sizes:any) {
    this.sizesAllState = sizes;
  }

  @Mutation
  SET_FETCHING(value:any) {
    this.loadingState = value;
  }

  @Mutation
  UPDATE_PROD_NAME(product_name:any) {
    this.productState.product_name = product_name;
  }

  @Mutation
  UPDATE_PROD_PRICE(product_price:any) {
    this.productState.product_price = product_price;
  }

  @Mutation
  UPDATE_PROD_DESCRIPTION(product_description:any) {
    this.productState.product_description = product_description;
  }

  @Mutation
  UPDATE_PROD_SIZE(product_size:any) {
    this.productState.size = product_size;
  }

  @Mutation
  UPDATE_PROD_COLOR(product_color:any) {
    this.productState.color = product_color;
  }

  @Mutation
  SET_SUPPLIERS_ALL(suppliersAll:any) {
    this.suppliersAllState = suppliersAll
  }

  @Mutation
  UPDATE_PROD_IMAGE(product_image:any) {
    this.productState.image = product_image;
  }

  @Mutation
  INIT_STATE() {
    this.productState = {
      id: "",
      product_name: "",
      product_price: "",
      product_description: "",
      size: [],
      color: [],
      image: [],
      supplier: ""
    },
    this.sizesAllState = []
    this.colorsAllState = []
    this.loadingState = false
    this.suppliersAllState = []
  }

  @Action({})
  fetch(product: any) {
    alertStore.setAlert(null);
    return new Promise((resolve, reject) => {
      apiURL
        .get(`products/${product.id}`)
        .then(({ data }) => {
          this.SET_PRODUCT(data.data);
          resolve(data)
        })
        .catch(err => reject(err.response));
    })
  }

  @Action({})
  updateProdStatus(data: any) {
    return new Promise((resolve, reject) => {
      apiURL.put('products/updateProdStatus/' + data.id, data)
        .then(({ data }) => resolve(data))
        .catch((response) => reject(response))
    })
  }

  @Action({})
  updateQuantity(product: any) {
    return new Promise((resolve, reject) => {
      apiURL.put(`products/saveQuantity/${product.id}`, product)
        .then(({ data: { message } }) => {
          resolve(message)
          // dispatch("ProductIndex/fetchData", null, { root: true })
        })
        .catch(({ response }) => reject(response))
    })
  }

  @Action({})
  createProduct(product: any) {
    this.loadingState = true;
    alertStore.setAlert(null);

    // let formData = new FormData();
    // convertObjectToFormData(product, formData);
    return new Promise((resolve, reject) => {
      apiURL
        .post("products", product)
        .then(({ data }) => {
          // dispatch("ProductIndex/fetchData", null, { root: true });
          resolve(data);
        })
        .catch(error => {
          reject(error.response);
        })
        .finally(() => this.loadingState = false);
    });
  }

  @Action({})
  fetchSuppliersAll() {
    apiURL.get('suppliers', { params: { showData: true } }).then(({ data }) => this.SET_SUPPLIERS_ALL= data)
      .catch(({ response }) => console.log(response))
  }

  @Action({})
  update(product: any) {
    this.loadingState = true;

    return new Promise((resolve, reject) => {
      apiURL
        .put(`products/${product.id}`, product)
        .then(res => {
          this.SET_PRODUCT(res.data.data);
          // dispatch("ProductIndex/fetchData", null, { root: true });
          resolve(res);
        })
        .catch(err => {
          reject(err.response);
        })
        .finally(() => this.loadingState = false);
    });
  }

  @Action({})
  delete(product: any) {
    this.loadingState = true;
    return new Promise((resolve, reject) => {
      apiURL
        .delete(`products/${product.id}`, product)
        .then(({ data }) => {
          // dispatch("ProductIndex/fetchData", null, { root: true });
          resolve(data);
        })
        .catch(err => {
          const { errors, message } = err.reponse.data;
          alertStore.setAlert({ errors, message, color: "danger" });
          reject(err);
        })
        .finally(() => this.loadingState = false);
    });
  }

  @Action({})
  logout() {
    return new Promise((resolve, reject) => {
      return apiURL
        .get("logout")
        .then(res => {
          this.INIT_STATE;
          sessionStorage.removeItem("authToken");
          sessionStorage.removeItem("user");
          sessionStorage.removeItem("userLoggedIn");
          resolve(res.data);
        })
        .catch(err => reject(err.response));
    });
  }

  @Action({})
  fetchSizesAll() {
    apiURL.get("sizes").then(res => {
      this.SET_SIZES_ALL(res.data);
    });
  }

  @Action({})
  fetchColorsAll() {
    apiURL.get("colors").then(res => {
      this.SET_COLORS_ALL(res.data);
    });
  }

  @Action({})
  resetState() {
    this.INIT_STATE;
  }

  @Action({})
  setProduct(
    product : any ={
      id: "",
      product_name: "",
      product_price: "",
      product_description: "",
      size: [],
      color: [],
      image: [],
      supplier: ""
    }
  ) {
    this.SET_PRODUCT(product);
  }

  @Action({})
  updateProdName(name: any) {
    this.UPDATE_PROD_NAME(name);
  }

  @Action({})
  updateProdPrice(name: any) {
    this.UPDATE_PROD_PRICE(name);
  }

  @Action({})
  updateProdDescription(name: any) {
    this.UPDATE_PROD_DESCRIPTION(name);
  }

  @Action({})
  updateProdSize(name: any) {
    this.UPDATE_PROD_SIZE(name);
  }

  @Action({})
  updateProdColor(name: any) {
    this.UPDATE_PROD_COLOR(name);
  }

  @Action({})
  updateProdImage(name: any) {
    this.UPDATE_PROD_IMAGE(name);
  }
}

const productSingleStore = getModule(ProductSingleStore);
export default productSingleStore;