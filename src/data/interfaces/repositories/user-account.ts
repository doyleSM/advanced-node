
export interface LoadUserAccountRepository {
  load: (params: LoadUserAccountRepository.Params) => Promise<LoadUserAccountRepository.Result>
}

export namespace LoadUserAccountRepository {
  export type Params = {
    email: string
  }
  export type Result = undefined | {
    id: string
    name?: string
  }
}

export interface CreateFacebookAccountRepository {
  createFromFacebook: (params: CreateFacebookAccountRepository.Params) => Promise<void>
}

export namespace CreateFacebookAccountRepository {
  export type Params = {
    name: string
    email: string
    facebookId: string
  }
}

export interface UpdateFabookAccountRepository {
  updateWithFacebook: (param: UpdateFabookAccountRepository.Param) => Promise<void>
}

export namespace UpdateFabookAccountRepository {
  export type Param = {
    id: string
    name: string
    facebookId: string
  }
  export type Result = Param
}
