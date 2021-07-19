import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features/facebook-authentication'

class FacebookAuthenticationService {
  constructor (private readonly loadFacebookUserApi: LoadFacebookUserApiSpy) {

  }

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    await this.loadFacebookUserApi.loadUserByToken(params)
    return new AuthenticationError()
  }
}

interface LoadFacebookUserApi {
  loadUserByToken: (params: LoadFacebookUserApi.Params) => Promise<LoadFacebookUserApi.Result>
}
namespace LoadFacebookUserApi {
  export type Params = {
    token: string
  }
  export type Result = undefined
}

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: string
  result = undefined
  async loadUserByToken (params: LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result> {
    this.token = params.token
    return this.result
  }
}

describe('FacebookAuthenticationService', () => {
  it('shoud call LoadFacebookUserApiSpy with correct params', async () => {
    const loadFacebookUserApi = new LoadFacebookUserApiSpy()
    const sut = new FacebookAuthenticationService(loadFacebookUserApi)
    await sut.perform({ token: 'some_token' })

    expect(loadFacebookUserApi.token).toBe('some_token')
  })

  it('shoud return AuthenticationError when LoadFacebookUserApiSpy returns undefined', async () => {
    const loadFacebookUserApi = new LoadFacebookUserApiSpy()
    loadFacebookUserApi.result = undefined
    const sut = new FacebookAuthenticationService(loadFacebookUserApi)
    const authResult = await sut.perform({ token: 'some_token' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})
