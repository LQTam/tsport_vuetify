import userSingleStore from "@/store/modules/userSingleStore";
import axios, { AxiosError, AxiosResponse } from "axios";
import Vue from "vue";
import {Swal } from "@/utils";
import appStore from "@/store/modules/appStore";
// Request interceptor
axios.interceptors.request.use((request) => {
  if (sessionStorage.getItem("authToken") && request.headers) {
    request.headers["Authorization"] = `Bearer ${sessionStorage.getItem("authToken")}`;
  }

  // request.headers['X-Socket-Id'] = Echo.socketId()

  return request;
});

// Response interceptor
axios.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error?.response?.status || 0;

    if (status >= 500) {
      void serverError(error.response);
    }

    if (status === 401) {
      void Swal.fire({
        icon: "warning",
        // title: ("Session Expired!"),
        title: "Session Expired!",
        text: "Please log in again to continue",
        reverseButtons: true,
        confirmButtonText: "Ok",
        cancelButtonText: "Cancel",
      }).then(() => {
        userSingleStore.logout();
        return window.location.reload();
        // return router.push({ name: "login" });
      });
    }

    if (status === 413) {
      appStore.SET_SNACKBAR({ text: ("413 Request Entity Too Large").toString(), color: "error" });
    }

    if (status === 419) {
      let timerInterval: number;
      void Swal.fire({
        title: "Page expired!",
        html: "I will reload in <b></b> milliseconds",
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
          timerInterval = window.setInterval(() => {
            const content = Swal.getHtmlContainer();
            if (content) {
              const b = content.querySelector("b");
              if (b) {
                b.textContent = (Swal.getTimerLeft() || 0).toString();
              }
            }
          }, 100);
        },
        willClose: () => {
          window.clearInterval(timerInterval);
          window.location.reload();
        },
      });
    }

    return Promise.reject(error);
  }
);

let serverErrorModalShown = false;
async function serverError(response: AxiosResponse | undefined) {
  if (!response) return;

  if (serverErrorModalShown) {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  if ((response.headers["content-type"] || "").includes("text/html")) {
    const iframe = document.createElement("iframe");

    if (response.data instanceof Blob) {
      iframe.srcdoc = await response.data.text();
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      iframe.srcdoc = response.data;
    }

    void Swal.fire({
      html: iframe.outerHTML,
      showConfirmButton: false,
      customClass: { container: "server-error-modal" },
      didDestroy: () => {
        serverErrorModalShown = false;
      },
      grow: "fullscreen",
      padding: 0,
    });

    serverErrorModalShown = true;
  } else {
    void Swal.fire({
      icon: "error",
      title: ("Oops").toString(),
      text: ("Something went wrong! Please try again.").toString(),
      reverseButtons: true,
      confirmButtonText: ("Ok").toString(),
      cancelButtonText: ("Cancel").toString(),
    });
  }
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
Vue.prototype.$http = axios;