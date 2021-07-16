import { AccessToken } from '@/domain/models'
import { AuthenticationError } from '@/domain/errors'

export interface facebookAuthentication {
  perform: (params: facebookAuthentication.Params) => Promise<facebookAuthentication.Result>
}

namespace facebookAuthentication {
  export type Params = {
    token: string
  }

  export type Result = AccessToken | AuthenticationError
}
