import { LaravelRes, LaravelValidateError } from './../typings/index.d';
import axios, { AxiosError, AxiosResponse } from "axios";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { debounce } from "lodash";
import { DataOptions } from "vuetify";
import appStore from '@/store/modules/appStore';

export const API_PREFIX = 'api';

const token = sessionStorage.authToken
  ? `Bearer ${sessionStorage.authToken}`
  : "";
export const apiURL = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    Authorization: token
  }
});
export const getIndex = (array: [], key: any, value: any) => {
  return array.findIndex(i => i[key] == value);
};

export const convertObjectToFormData = (
  val: any,
  formData = new FormData(),
  namespace = ""
) => {
  if (typeof val !== "undefined" && val !== null) {
    if (val instanceof Date) {
      formData.append(namespace, val.toISOString());
    } else if (val instanceof Array) {
      for (let i = 0; i < val.length; i++) {
        convertObjectToFormData(val[i], formData, namespace + "[" + i + "]");
      }
    } else if (typeof val === "object" && !(val instanceof File)) {
      if (val instanceof FileList) {
        for (let i = 0; i < val.length; i++) {
          formData.append(namespace + "[]", val[i]);
        }
      } else {
        for (const propertyName in val) {
          // eslint-disable-next-line no-prototype-builtins
          if (val.hasOwnProperty(propertyName)) {
            convertObjectToFormData(
              val[propertyName],
              formData,
              namespace ? namespace + "[" + propertyName + "]" : propertyName
            );
          }
        }
      }
    } else if (val instanceof File) {
      formData.append(namespace, val);
    }
    else {
      formData.append(namespace, val.toString());
    }
  }
  return formData;
};

export const convertArrayToFormData = (form_data: FormData, values: any, name: string) => {
  if (!values && name) form_data.append(name, "");
  else {
    if (typeof values == "object") {
      for (const key in values) {
        if (typeof values[key] == "object")
          convertArrayToFormData(
            form_data,
            values[key],
            name + "[" + key + "]"
          );
        else form_data.append(name + "[" + key + "]", values[key]);
      }
    } else form_data.append(name, values);
  }

  return form_data;
};

export { Swal};

export const REDIS_PREFIX = "";
export const REDIS_PREFIX_PRIVATE = REDIS_PREFIX + "private-";

export function sleep(ms: number): Promise<unknown> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function privateChannel(name: string): string {
  return REDIS_PREFIX_PRIVATE + name;
}

export function toggleFullScreen(): void {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(nothing);
  } else if (document.exitFullscreen) {
    document.exitFullscreen().catch(nothing);
  }
}

export function queryString(input: string | (string | null)[]): string {
  if (Array.isArray(input)) {
    return input.length ? (input[0] ? input[0] : "") : "";
  }

  return input;
}

export function nothing(_err: Error): void {
  console.log(_err.message);
}

export function propTrue(value?: string | boolean | number | null): boolean {
  return !!value || typeof value === "string";
}

export function scrollToBottom(id: string) {
  const objDiv = document.getElementById(id);
  if (objDiv) {
    objDiv.scrollTop = objDiv.scrollHeight;
  }
}

export interface CustomDataOptions extends DataOptions {
  search: string;
  installed?: boolean;
}

export const defaultOptions: CustomDataOptions = {
  page: 1,
  search: "",
  itemsPerPage: 10,
  sortBy: [],
  sortDesc: [],
  groupBy: [],
  groupDesc: [],
  mustSort: false,
  multiSort: false,
};

export function defaultLaravelRes<T>(): LaravelRes<T[]> {
  return {
    message: "",
    data: [],
    links: { first: "", last: "" },
    meta: {
      current_page: 1,
      from: 0,
      last_page: 1,
      links: [],
      per_page: 10,
      to: 0,
      total: 0,
    },
  };
}

export function compareString(a: string, b: string): number {
  const nameA = a.toUpperCase();
  const nameB = b.toUpperCase();
  if (nameA < nameB) return -1;
  if (nameA > nameB) return 1;
  return 0;
}

export function escapeRegExp(string: string) {
  // $& means the whole matched string
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&");
}

export function searchString(string: string, search?: string) {
  if (!search) return true;

  return string.toUpperCase().search(new RegExp(escapeRegExp(search.toUpperCase()))) > -1;
}

/**
 * Convert string to pascal case
 * @returns {string}
 */
export const pascalCase = (str: string): string =>
  str
    // Replaces any - or _ characters with a space
    .replace(/[-_]+/g, " ")
    // Removes any non alphanumeric characters
    .replace(/[^\w\s]/g, "")
    // Uppercase the first character in each group immediately following a space
    // (delimited by spaces)
    .replace(/\s+(.)(\w+)/g, (_$1, $2, $3) => `${String($2).toUpperCase() + String($3).toLowerCase()}`)
    // Removes spaces
    .replace(/\s/g, "")
    // Uppercase first letter
    .replace(/\w/, (s) => s.toUpperCase());

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function handleResponseErr(err: Error | AxiosError<LaravelValidateError>): void {
  console.log(err);
  if (axios.isAxiosError(err) && err.response && err.response.status >= 400) {
    if (err.response.data.message) {
      console.log(err.response.data);
      if (err.response.data.errors) {
        appStore.toastQueue.add({ text: `${Object.values(err.response.data.errors)[0]?.toString()}`, color: "error" });
      } else {
        appStore.toastQueue.add({ text: `${err.response.data.message}`, color: "error" });
      }
    } else {
      appStore.toastQueue.add({ text: `${err.response.status}: ${err.response.statusText}`, color: "error" });
    }
  }
}

export function onlyAlphaNumber(text: string): string {
  return text
    .split("")
    .filter((char) => /[a-zA-Z0-9]/.test(char))
    .join("");
}

export function capitalize(value?: string, allWords?: boolean): string {
  if (!value) return "";

  if (allWords) {
    return value.replace(/\b\w/g, (l) => l.toUpperCase());
  } else {
    return value.replace(/\b\w/, (l) => l.toUpperCase());
  }
}

export function download(text: string, name: string, ext: string = ""): void {
  const element = document.createElement("a");
  element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
  element.setAttribute("download", `${name}${ext ? "." : ""}${ext}`);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

export function Debounce(delay: number) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (target: any, prop: string) => {
    return {
      configurable: true,
      enumerable: false,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      value: debounce(target[prop], delay),
    };
  };
}

export function randomPassword(): string {
  return Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
}

export function dowloadFileFromBlob(response: AxiosResponse<Blob>) {
  const url = window.URL.createObjectURL(response.data);
  const link = document.createElement("a");
  link.href = url;
  const contentDisposition = response.headers["content-disposition"];
  let fileName = "unknown";
  if (contentDisposition) {
    fileName = contentDisposition.split("filename=")[1].split(";")[0];
  }
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}