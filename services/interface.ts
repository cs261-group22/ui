import { NuxtAxiosInstance } from '@nuxtjs/axios';

// prettier-ignore
export abstract class ApiService<T> {
  protected axios: NuxtAxiosInstance

  constructor(axios: NuxtAxiosInstance) {
    this.axios = axios;
  }

  all?(): Promise<T[]>

  get?(params: RequestParams): Promise<T>

  create?(entry: T): Promise<boolean | T>

  update?(params: RequestParams, entry: T): Promise<boolean | T>

  delete?(params: RequestParams): Promise<boolean>
}

export interface RequestParams {}
