import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import store from "..";

@Module({dynamic: true, name: "alert", store, namespaced: true})
class AlertStore extends VuexModule {
  errorsData: [] = [];

  messageData: string = "";

  colorData: string = "success";

  get errors(): [] {
    return this.errorsData;
  }

  get message(): string {
    return this.messageData;
  }

  get color(): string {
    return this.color;
  }

  @Mutation
  SET_MESSAGE(message: any) {
    this.messageData = message;
  }

  @Mutation
  SET_COLOR(color: any) {
    this.colorData = color;
  }

  @Mutation
  SET_ERRORS(errors: any) {
    this.errorsData = errors;
  }

  @Mutation
  RESET_ALERT() {
    this.messageData = "";
    this.colorData = "success";
    this.errorsData = [];
  }

  @Action({commit: "SET_ERRORS"})
  setErrors(errors: any) {
    return errors;
  }

  @Action({commit: "SET_MESSAGE"})
  setMessage(message: any) {
    return message;
  }

  @Action({commit: "SET_COLOR"})
  setColor(color: any) {
    return color;
  }

  @Action({})
  setAlert(data: any) {
    this.messageData = data.message;
    this.colorData = data.color;
    this.errorsData = data.errors;
  }

  @Action({})
  resetState() {
    this.messageData = "";
    this.colorData = "success";
    this.errorsData = [];
  }
}

const alertStore = getModule(AlertStore);
export default alertStore;