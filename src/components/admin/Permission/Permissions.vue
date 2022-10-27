<template>
  <v-layout>
    <v-flex>
      <v-card flat>
        <v-card-title>Permissions</v-card-title>
        <div
          class="row"
          style="position: absolute;
            left: 50%;
            transform: translateX(-50%);"
          v-if="fetching"
        >
          <div class="col-xs-4 col-xs-offset-4">
            <div class="alert text-center">
              <i class="fa fa-spin fa-refresh"></i> Loading
            </div>
          </div>
        </div>
        <data-table
          v-if="!fetching"
          :url="url"
          :columns="columns"
          :itemPerPageOptions="itemPerPageOptions"
          :items="permissions"
          :options="options"
          :sort-key="sortKey"
          :sort-group="sortGroup"
          :search="search"
          @sortBy="sortBy"
          @searchValue="searchValue"
          @paginateValue="paginateValue"
        >
          <template #dialog>
            <v-dialog v-model="dialog" max-width="800px">
              <template v-slot:activator="{ on }">
                <v-btn color="gray" @click.prevent="refreshData">
                  <!-- <v-icon class="mr-1">mdi-refresh</v-icon>Refresh -->
                  <i class="fa fa-refresh" :class="{'fa-spin' : fetching}"></i>Refresh
                </v-btn>
                <v-btn v-show="$can('create_permission')" color="primary" dark v-on="on">New Item</v-btn>
              </template>
              <v-card>
                <v-card-title>{{formTitle}}</v-card-title>

                <v-card-text>
                  <!-- <v-form ref="form"> -->
                  <bootstrap-alert />
                  <v-container ref="form">
                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                        <ValidationProvider
                          class="red--text"
                          name="Name"
                          rules="required|max:191"
                          v-slot="{errors}"
                        >
                          <v-text-field
                            :autofocus="true"
                            :label="'Name'"
                            v-model="permission.name"
                            @input="updateName($event)"
                          ></v-text-field>
                          <span>{{errors[0]}}</span>
                        </ValidationProvider>
                      </v-col>
                    </v-row>
                  </v-container>
                  <!-- </v-form> -->
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" v-if="!isEdit" @click="refreshForm" text>
                    Refresh
                    <v-icon>mdi-refresh</v-icon>
                  </v-btn>
                  <v-btn color="red darken-1" text @click="close">
                    Cancel
                    <v-icon>mdi-cancel</v-icon>
                  </v-btn>
                  <v-btn color="blue darken-1" @click="save" text>
                    Save
                    <v-icon>mdi-content-save</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </template>
          <template v-slot:default="props">
            <tr v-for="v in props.data" :key="v.id">
              <td>{{v.id}}</td>
              <td>{{v.name}}</td>
              <td>
                <div class="btn-group">
                  <button
                    class="btn btn-primary"
                    v-if="$can('edit_permission')"
                    @click="editItem(v)"
                  >Edit</button>
                  <button
                    class="btn btn-danger"
                    v-if="$can('delete_permission')"
                    @click="deleteItem(v)"
                  >Delete</button>
                </div>
              </td>
            </tr>
          </template>
        </data-table>
        <pagination
          v-if="!fetching"
          :length="permissions.meta.last_page"
          @moveToPage="moveToPage"
          :page="permissions.meta.current_page"
          :url="url"
        ></pagination>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import DataTable from "@/components/admin/Table.vue";
import Pagination from "@/components/admin/Pagination.vue";
import { getIndex, Swal } from "@/utils";
import permissionIndexStore from '@/store/modules/permissionIndexStore';
import permissionSingleStore from '@/store/modules/permissionSingleStore';
import appStore from '@/store/modules/appStore';
export default {
  components: { DataTable, Pagination },
  data() {
    let columns = [
      { value: "ID", name: "id", sortable: true, width: "33.33%" },
      { value: "Name", name: "name", sortable: true },
      { value: "Action" }
    ];
    let sortOrders = {};
    columns.forEach(col => (sortOrders[col.name] = -1));
    return {
      columns: columns,
      sortGroup: sortOrders,
      itemPerPageOptions: [
        { value: "5" },
        { value: "10" },
        { value: "25" },
        { value: "50" }
      ],
      dialog: false,
      isEdit: false,
      sortKey: "id",
      options: {
        page: 1,
        length: 10,
        search: "",
        column: 0,
        dir: "desc"
      },
      url: "permissions",
      search: "",
      tableName: "Permissions"
    };
  },
  created() {
    this.options = permissionSingleStore.query;
  },
  mounted(){
    permissionSingleStore.fetchData();
  },
  computed: {
    fetching() {
      return permissionSingleStore.fetching;
    },
    formTitle() {
      return this.isEdit ? "Edit Item" : "Create Item";
    },
    permissions(){
      return permissionIndexStore.permissions;
    }
  },
  watch: {
    options: {
      handler: function(query) {
        permissionIndexStore.setQuery(query);
        permissionIndexStore.fetchData();
      },
      deep: true
    },
    dialog(val) {
      !val && this.refreshForm();
    }
  },
  destroyed() {
    permissionIndexStore.resetState();
  },
  methods: {
    updateName(name) {
      permissionSingleStore.updateName(name);
    },
    refreshData() {
      permissionIndexStore.fetchData({
        page: 1,
        length: 10,
        search: "",
        column: 0,
        dir: "desc"
      });
    },
    refreshForm() {
      permissionSingleStore.setPermission();
      permissionSingleStore.dialog = false;
      this.isEdit = false;
    },
    editItem(item) {
      permissionSingleStore.setPermission(item);
      permissionSingleStore.fetch();
      this.dialog = true;
      this.isEdit = true;
    },
    close() {
      this.dialog = false;
    },
    save() {
      if (this.isEdit) {
        permissionSingleStore.update().then(res => {
          if (res.status == 422) {
            this.dialog = true;
          }
          appStore.toastQueue.add({text: 'Your permission has been update successfull.', color: 'success'})
          this.dialog = false;
          this.isEdit = false;
        });
      } else {
        permissionSingleStore.createPermission().then(res => {
          if (res.status == 422) {
            this.dialog = true;
          }
          if (res.status == 201) {
            appStore.toastQueue.add({text: 'Your permission has been create successfull.', color: 'success'})
            this.dialog = false;
          }
          this.isEdit = false;
        });
      }
    },
    deleteItem(item) {
      Swal.fire({
        title: "Are you sure?",
        text: `You won't be able to revert this!`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete",
        confirmButtonColor: "#dd4b39",
        focusCancel: true,
        reverseButtons: true
      }).then(result => {
        if (result.value) {
          permissionSingleStore.setPermission(item);
          permissionSingleStore.delete().then(() => {
            appStore.toastQueue.add({text: "Your permission has been deleted.", color: 'success'});
          });
        }
      });
    },
    sortBy(key) {
      this.sortKey = key;
      this.sortGroup[key] = this.sortGroup[key] * -1;
      this.options.dir = this.sortGroup[key] >= 1 ? "asc" : "desc";
      this.options.column = getIndex(this.columns, "name", key);
    },
    searchValue(value) {
      this.options.search = value;
    },
    paginateValue(value) {
      permissionIndexStore.resetState();
      this.options.search=""
      this.options.length = value;
    },
    moveToPage(page) {
      this.options.page = page;
    }
  }
};
</script>

<style>
</style>