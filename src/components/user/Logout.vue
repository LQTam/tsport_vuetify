<template>
  <div></div>
</template>

<script>
import userSingleStore from '@/store/modules/userSingleStore'
export default {
  created() {
    userSingleStore.logout().then(() => {
      window.location.href='/login'
    });
  }
};
</script>

<style>
</style>