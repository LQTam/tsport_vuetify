import store from '@/store';
import { apiURL } from "@/utils";
import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import productSingleStore from './Product/single';

@Module({dynamic: true, name:"supplierStore", store, namespaced: true})
class SupplierStore extends VuexModule {
    supplierState: any= {};

    loadingState: any= false;

    get supplier(): any{
        return this.supplier;
    }

    @Mutation
    SET_SUPPLIER(supplier: any) {
        this.supplierState = supplier
    }

    @Action({})
    store(data:any) {
        return new Promise((resolve, reject) => {
            apiURL.post('suppliers', data)
                .then(({ data }) => {
                    resolve(data)
                    productSingleStore.fetchSuppliersAll();
                })
                .catch(({ response }) => reject(response))
        })
    }
}

const supplierStore = getModule(SupplierStore);
export default supplierStore;