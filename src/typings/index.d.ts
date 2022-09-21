export type SnackbarItem = {
    text: string;
    color?: string;
  };

  interface Paginate {
    links: PaginateLinks;
    meta: PaginateMeta;
  }

  export interface LaravelRes<T> extends Paginate {
    data: T;
    message: string;
  }

  export interface LaravelValidateError {
    message: string;
    errors: { [key in string]: string | string[] };
  }