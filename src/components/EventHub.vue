<template>
  <v-snackbar v-if="snackbar" v-model="snackbarStatus" :color="snackbar.color" :timeout="snackbarDelay" top right>
    {{ snackbar.text }}
  </v-snackbar>
</template>


<script lang="ts">
import {Component, Vue, Watch} from "vue-property-decorator";
import ruleStore from "@/store/modules/rules";
import appStore from "@/store/modules/appStore";
import { SnackbarItem } from "@/typings";

@Component({})
export default class Snackbar extends Vue {
  snackbarStatus = false;

  get snackbar(): SnackbarItem | null {
    return appStore.snackbar;
  }

  get snackbarDelay() {
    return appStore.toastQueue.delay;
  }

  get rules() {
    return ruleStore.rules;
  }
  created() {
    this.$root.$on("create-success", this.itemCreated);
    this.$root.$on("update-success", this.itemUpdated);
    this.$root.$on("delete-success", this.itemDeleted);
    this.$root.$on("rules-update", this.rulesUpdate);
  }
  
  itemCreated() {
    this.$awn.success("Your item has been successfully saved.");
  }

  itemUpdated() {
    this.$awn.success("Your item has been successfully updated.");
  }

  itemDeleted() {
    this.$awn.success("Your item has been successfully deleted.");
  }

  rulesUpdate() {
    this.$ability.update([{ subject: "all", actions: this.rules }]);
  }

  @Watch('snackbar')
  watchSnackbar() {
    this.snackbarStatus = true;
  }
}
</script>


<style scoped>
</style>
