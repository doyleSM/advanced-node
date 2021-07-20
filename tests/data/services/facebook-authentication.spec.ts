import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthenticationService } from '@/data/services'

import { mock, MockProxy } from 'jest-mock-extended'
import { LoadFacebookUserApi } from '../interfaces/apis'

const token = 'any_token'

describe('FacebookAuthenticationService', () => {
  let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>
  let sut: FacebookAuthenticationService

  beforeEach(() => {
    loadFacebookUserApi = mock()
    loadFacebookUserApi.loadUser.mockResolvedValue({
      email: 'any_fb_email',
      name: 'any_fb_name',
      facebookId: 'any_fb_id'
    })
    sut = new FacebookAuthenticationService(loadFacebookUserApi)
  })

  it('shoud call LoadFacebookUserApiSpy with correct params', async () => {
    await sut.perform({ token })

    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('shoud return AuthenticationError when LoadFacebookUserApiSpy returns undefined', async () => {
    loadFacebookUserApi.loadUser.mockResolvedValue(undefined)
    const authResult = await sut.perform({ token })

    expect(authResult).toEqual(new AuthenticationError())
  })

  it('shoud return loadUserByEmailRepo when LoadFacebookUserApiSpy returns data', async () => {
    await sut.perform({ token })

    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
  })
})

interface LoadUserRepository {
  loadUser: (params: LoadUserRepository.Params) => Promise<void>
}

namespace LoadUserRepository {
  export type Params = {
    email: string
  }
}
