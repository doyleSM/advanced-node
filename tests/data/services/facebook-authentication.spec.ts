import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthenticationService } from '@/data/services'

describe('FacebookAuthenticationService', () => {
  it('shoud call LoadFacebookUserApiSpy with correct params', async () => {
    const loadFacebookUserApi = {
      loadUser: jest.fn()
    }
    const sut = new FacebookAuthenticationService(loadFacebookUserApi)
    await sut.perform({ token: 'some_token' })

    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token: 'some_token' })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('shoud return AuthenticationError when LoadFacebookUserApiSpy returns undefined', async () => {
    const loadFacebookUserApi = {
      loadUser: jest.fn()
    }
    loadFacebookUserApi.loadUser.mockResolvedValue(undefined)
    const sut = new FacebookAuthenticationService(loadFacebookUserApi)
    const authResult = await sut.perform({ token: 'some_token' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})
