import { getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import store from '@/store';
import Echo from "laravel-echo";
import { SocketIoPrivateChannel } from "laravel-echo/dist/channel";

@Module({dynamic: true, name: 'socketStore', store, namespaced: true})
class SocketStore extends VuexModule{
    echo: Echo | null = null;

    userChannel: SocketIoPrivateChannel | null = null;

    channels: string[] = [];

    @Mutation
    initEcho() {
        if(this.echo) return;
        this.echo = new Echo({
            // broadcaster: 'socket.io',
            // host: `${window.location.hostname}${process.env.port}`,
            broadcaster:'pusher',
            key: process.env['VUE_APP_PUSHER_APP_KEY'],
            cluster: process.env['VUE_APP_PUSHER_APP_CLUSTER'],
            authEndpoint:'/broadcasting/auth',
            encrypted:true,
            auth:{
                headers:{
                    Authorization:'Bearer '+sessionStorage['authToken']
                }
            },
            forceTLS:true
        })
    }

    @Mutation
    JOIN_USER_CHANNEL(user_id: number) {
        const name = `user.${user_id}`;
        if (!this.channels.includes(name)) {
            this.channels.push(name);
        }
        if (!this.userChannel && this.echo) {
            this.userChannel = this.echo.private(name) as SocketIoPrivateChannel;
        }
    }

    @Mutation
    LISTEN_EVENT<T>(payload: {event: string; listen: (data: T) => void}) {
        if(!this.userChannel) return;

        this.userChannel.listen(payload.event, payload.listen);
    }

    @Mutation
    ON_LOGOUT() {
        if(!this.echo) return;

        this.channels.forEach((channel) => {
            this.echo?.leaveChannel(channel);
        });
    }
}

const socketStore = getModule(SocketStore);

export default socketStore;
