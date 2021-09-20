import { HttpGetClient } from '@/infra/http'

import axios from 'axios'

export class AxiosHttpClient {
  async get <T = any>(args: HttpGetClient.Params): Promise<T> {
    const { params, url } = args

    const result = await axios.get(url, { params })
    return result.data
  }
}
