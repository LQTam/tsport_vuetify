import store from "../index";
import { apiURL } from "@/utils";
import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";

@Module({dynamic: true, store, name: "categoryIndexStore", namespaced: true})
class CategoryIndexStore extends VuexModule {
    categoriesState: [] = [];

    loadingState: boolean = false;

    categoryState: any = {};

    get categories(): any {
        return () => this.categoriesState;
    }

    get category(): any {
        return this.categoryState;
    }

    @Mutation
    SET_ALL(cates: any) {
        this.categoriesState = cates
    }
    
    @Mutation
    SET_CATEGORY(cate: any) {
        this.categoryState = cate
    }
    
    @Mutation
    SET_LOADING(stat: any) {
        this.loadingState= stat
    }
    
    @Mutation
    INIT_STATE() {
        this.categoriesState =  [];
        this.loadingState =  false;
        this.categoryState =  {};
    }

    @Action
    fetchData(params = null) {
        this.loadingState = true;
        return new Promise((resolve, reject) => {
            return apiURL
                .get("/categories", { params: params })
                .then(({ data }) => {
                    this.SET_ALL(data);
                    resolve(data);
                })
                .catch(err => {
                    reject(err.response);
                })
                .finally(() => this.loadingState = false);
        })
    }

    @Action({})
    store(category: any) {
        return new Promise((resolve, reject) => {
            return apiURL
                .post("/categories", category)
                .then(({ data }) => {
                    this.fetchData();
                    resolve(data);
                })
                .catch(err => {
                    reject(err.response);
                })
        })
    }
}
 
const categoryIndexStore = getModule(CategoryIndexStore);
export default categoryIndexStore;
