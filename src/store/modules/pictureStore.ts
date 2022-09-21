import store from '@/store';
import { apiURL, convertObjectToFormData } from "@/utils";
import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import productSingleStore from './productSingleStore';

@Module({dynamic: true, name: "pictureStore", store, namespaced: true})
class PictureStore extends VuexModule {
  pictureState: any = {};

  fetchingState: any =  false;

  get picture(): any {
    return this.picture;
  }

  @Action
  fetch(data: any){
    apiURL.get(`products/${data.product_id}/colors/${data.color_id}`)
    .then(({data:{data}})=>{
        this.SET_PICTURE(data);
    })
    .catch(({response})=>console.log(response))
  }
  
  @Action
  addImageForColorProduct(product: any){
    const formData = new FormData()
    convertObjectToFormData(product,formData)
    return new Promise((resolve,reject)=>{
      apiURL.post(`products/${product.id}/colors/${product.color_name.id}`,formData)
      .then(({data})=> {
        productSingleStore.fetch(product);
        resolve(data)
      })
      .catch(({response})=>reject(response))
    });
  }
  
  @Action
  deleteSelectedItem(data: any){
    return new Promise((resolve,reject)=>{
      apiURL.post('colorpicture/deleteSelectedItem',data)
      .then(({data})=>{
        resolve(data)
      })
      .catch(({response})=>reject(response))
    })
  }
  
  @Action
  resetState() {
    this.INIT_STATE;
  }

  @Mutation
  SET_PICTURE(pic: any){
    this.pictureState = pic
  }

  @Mutation
  INIT_STATE() {
    this.pictureState = {};
    this.fetchingState =  false;
  }
}

const pictureStore = getModule(PictureStore);
export default pictureStore;