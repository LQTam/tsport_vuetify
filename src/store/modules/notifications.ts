import store from '@/store';
import { apiURL } from "@/utils";
import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";

@Module({name:"notificationStore", dynamic: true, store, namespaced: true})
class NotificationStore extends VuexModule {
    notificationsState: any =  [];

    loadingState: any =  false;

    unreadNotificationsState: any =  [];

    get notifications(): any {
        return this.notificationsState;
    }
    get unreadNotifications(): any {
        return this.unreadNotificationsState;
    }

    @Mutation
    SET_ALL(data: any) {
        this.notificationsState = data.notifications
        this.unreadNotificationsState = data.unreadNotifications
    }

    @Mutation
    SET_LOADING(stat: any) {
        this.loadingState = stat
    }

    @Mutation
    INIT_STATE() {
        this.notificationsState = [];
        this.unreadNotificationsState = [];
        this.loadingState = false;
    }

    @Action({})
    fetchNotifications() {
        this.loadingState = true;
        return new Promise((resolve, reject) => {
            return apiURL
                .get("/notifications")
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
    unread(notify: any){
        return new Promise((resolve, reject) => {
            return apiURL
                .get(`/unread/${notify.id}/${notify.notifiable_id}`)
                .then(({ data }) => {
                    this.SET_ALL(data);
                    resolve(data);
                })
                .catch(err => {
                    reject(err.response);
                })
        })
    }

    @Action({})
    delete(data: any){
        return new Promise((resolve, reject) => {
            return apiURL
                .delete(`/deleteNotify/${data.user_id}/${data.notify.id}`)
                .then(({ data }) => {
                    resolve(data);
                })
                .catch(err => {
                    reject(err.response);
                })
        })
    }
}

const notificationStore = getModule(NotificationStore);
export default notificationStore;