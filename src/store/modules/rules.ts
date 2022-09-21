import store from '@/store';
import { apiURL } from "@/utils";
import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";

@Module({dynamic: true, name: "ruleStore", store, namespaced: true})
class RuleStore extends VuexModule {
  rulesState: any = null;

  get rules(): any {
    return this.rulesState;
  }

  @Mutation
  SET_ALL(data: any) {
    this.rulesState = data;
  }

  @Mutation
  INIT_STATE() {
    this.rulesState = null;
  }

  @Action({})
  fetchData() {
    return new Promise((resolve, reject) => {
      return apiURL
        .get("rules")
        .then(res => {
          this.SET_ALL(res.data);
          resolve(res.data);
        })
        .catch(err => reject(err.response));
    });
  }

  @Action({})
  resetState() {
    this.INIT_STATE;
  }
}

const ruleStore = getModule(RuleStore);
export default ruleStore;