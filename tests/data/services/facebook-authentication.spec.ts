import { AuthenticationError } from '@/domain/errors'
import { LoadFacebookUserApi } from '@/data/interfaces/apis'
import { FacebookAuthenticationService } from '@/data/services'

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: string
  callsCount = 0
  result = undefined
  async loadUserByToken (params: LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result> {
    this.token = params.token
    this.callsCount++
    return this.result
  }
}

describe('FacebookAuthenticationService', () => {
  it('shoud call LoadFacebookUserApiSpy with correct params', async () => {
    const loadFacebookUserApi = new LoadFacebookUserApiSpy()
    const sut = new FacebookAuthenticationService(loadFacebookUserApi)
    await sut.perform({ token: 'some_token' })

    expect(loadFacebookUserApi.token).toBe('some_token')
    expect(loadFacebookUserApi.callsCount).toBe(1)
  })

  it('shoud return AuthenticationError when LoadFacebookUserApiSpy returns undefined', async () => {
    const loadFacebookUserApi = new LoadFacebookUserApiSpy()
    loadFacebookUserApi.result = undefined
    const sut = new FacebookAuthenticationService(loadFacebookUserApi)
    const authResult = await sut.perform({ token: 'some_token' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})
