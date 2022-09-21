import store from '@/store';
import { apiURL } from "@/utils";
import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import alertStore from './alert';

@Module({dynamic: true, name: 'orderIndexStore', store, namespaced: true})
class OrderIndexStore extends VuexModule {
    ordersState: any = {
        meta: {
            last_page: 1,
            current_page: 1,
            total: 0
        }
    }

    fetchingState: any = false

    sortKeyState: any = "id"

    sortGroupState: any = {}

    queryState: any = {
        length: 10,
        page: 1,
        column: 0,
        dir: "desc",
        search: ""
    }

    get orders(): any {
        return this.ordersState;
    }

    get fetching(): any {
        return this.fetchingState;
    }

    get query(): any {
        return this.queryState;
    }

    @Action
    fetchData(query = null) {
        this.SET_FETCHING(true);
        return new Promise((resolve, reject) => {
            return apiURL
                .get(
                    "orders",
                    { params: query }
                )
                .then(({ data }) => {
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
    confirmOrder(data: any) {
        return new Promise((resolve, reject) => {
            return apiURL
                .post(
                    `confirmOrder/${data.madh}`,
                )
                .then(({ data }) => {
                    resolve(data);
                })
                .catch(err => {
                    reject(err.response);
                })
        });
    }
    @Action
    fetchOrdersByUserID(uid:any) {
        return new Promise((resolve, reject) => {
            apiURL.get(`fetchOrders/${uid}`)
                .then(({ data }) => resolve(data))
                .catch(({ response }) => reject(response))

        })
    }

    @Action
    outOfStock(data: any) {
        return new Promise((resolve, reject) => {
            return apiURL
                .post(
                    `outOfStock/${data.madh}`,
                )
                .then(({ data }) => {
                    resolve(data);
                })
                .catch(err => {
                    reject(err.response);
                })
        });
    }

    @Action
    delete(data:any) {
        return new Promise((resolve, reject) => {
            return apiURL
                .delete(
                    `delete/${data.madh}`,
                )
                .then(({ data }) => {
                    this.fetchData();
                    resolve(data);
                })
                .catch(err => {
                    reject(err.response);
                })
        });
    }

    @Action
    setQuery(query:any) {
        this.SET_QUERY(query);
    }

    @Action
    resetState() {
        this.INIT_STATE
    }
    
    @Mutation
    SET_ALL(data:any) {
        this.ordersState = data;
    }
    @Mutation
    SET_FETCHING(data:any) {
        this.fetchingState = data;
    }

    @Mutation
    SET_QUERY(data:any) {
        this.queryState = data;
    }

    @Mutation
    INIT_STATE() {
        this.ordersState = {
            meta: {
                last_page: 1,
                current_page: 1,
                total: 0
            }
        }

        this.fetchingState = false

        this.sortKeyState = "id"

        this.sortGroupState = {}

        this.queryState = {
            length: 10,
            page: 1,
            column: 0,
            dir: "desc",
            search: ""
        }
    }
}

const orderIndexStore = getModule(OrderIndexStore);

export default orderIndexStore;
