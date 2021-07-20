import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthenticationService } from '@/data/services'

import { mock, MockProxy } from 'jest-mock-extended'
import { LoadFacebookUserApi } from '@/data/interfaces/apis'
import { LoadUserAccountRepository } from '@/data/interfaces/repositories'

const token = 'any_token'

describe('FacebookAuthenticationService', () => {
  let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>
  let sut: FacebookAuthenticationService
  let loadUserAccountRepository: MockProxy<LoadUserAccountRepository>

  beforeEach(() => {
    loadFacebookUserApi = mock()
    loadFacebookUserApi.loadUser.mockResolvedValue({
      email: 'any_fb_email',
      name: 'any_fb_name',
      facebookId: 'any_fb_id'
    })
    loadUserAccountRepository = mock()
    sut = new FacebookAuthenticationService(
      loadFacebookUserApi,
      loadUserAccountRepository
    )
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

  it('shoud return loadUserAccountRepository when LoadFacebookUserApiSpy returns data', async () => {
    await sut.perform({ token })

    expect(loadUserAccountRepository.load).toHaveBeenCalledWith({ email: 'any_fb_email' })
    expect(loadUserAccountRepository.load).toHaveBeenCalledTimes(1)
  })
})
