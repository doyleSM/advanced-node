import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthenticationService } from '@/data/services'

import { mock, MockProxy } from 'jest-mock-extended'
import { LoadFacebookUserApi } from '@/data/interfaces/apis'
import { CreateFacebookAccountRepository, LoadUserAccountRepository } from '@/data/interfaces/repositories'

const token = 'any_token'

describe('FacebookAuthenticationService', () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>
  let sut: FacebookAuthenticationService
  let userAccountRepository: MockProxy <CreateFacebookAccountRepository & LoadUserAccountRepository >

  beforeEach(() => {
    facebookApi = mock()
    facebookApi.loadUser.mockResolvedValue({
      email: 'any_fb_email',
      name: 'any_fb_name',
      facebookId: 'any_fb_id'
    })
    userAccountRepository = mock()
    sut = new FacebookAuthenticationService(
      facebookApi,
      userAccountRepository
    )
  })

  it('should call LoadFacebookUserApiSpy with correct params', async () => {
    await sut.perform({ token })

    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token })
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadFacebookUserApiSpy returns undefined', async () => {
    facebookApi.loadUser.mockResolvedValue(undefined)
    const authResult = await sut.perform({ token })

    expect(authResult).toEqual(new AuthenticationError())
  })

  it('should return loadUserAccountRepository when LoadFacebookUserApiSpy returns data', async () => {
    await sut.perform({ token })

    expect(userAccountRepository.load).toHaveBeenCalledWith({ email: 'any_fb_email' })
    expect(userAccountRepository.load).toHaveBeenCalledTimes(1)
  })

  it('should call createUserAccountRepository when loadUserAccountRepository returns undefined', async () => {
    userAccountRepository.load.mockResolvedValue(undefined)
    await sut.perform({ token })

    expect(userAccountRepository.createFromFacebook).toHaveBeenCalledWith({
      email: 'any_fb_email',
      name: 'any_fb_name',
      facebookId: 'any_fb_id'
    })
    expect(userAccountRepository.createFromFacebook).toHaveBeenCalledTimes(1)
  })
})
