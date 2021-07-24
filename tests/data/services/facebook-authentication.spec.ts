import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthenticationService } from '@/data/services'

import { mock, MockProxy } from 'jest-mock-extended'
import { LoadFacebookUserApi } from '@/data/interfaces/apis'
import { SaveFacebookAccountRepository, LoadUserAccountRepository } from '@/data/interfaces/repositories'
import { mocked } from 'ts-jest/utils'
import { AccessToken, FacebookAccount } from '@/domain/models'
import { TokenGenerator } from '@/data/interfaces/crypto'
const token = 'any_token'

jest.mock('@/domain/models/facebook-account')

describe('FacebookAuthenticationService', () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>
  let sut: FacebookAuthenticationService
  let userAccountRepository: MockProxy<SaveFacebookAccountRepository & LoadUserAccountRepository>
  let crypto: MockProxy<TokenGenerator>
  beforeEach(() => {
    facebookApi = mock()
    facebookApi.loadUser.mockResolvedValue({
      email: 'any_fb_email',
      name: 'any_fb_name',
      facebookId: 'any_fb_id'
    })
    userAccountRepository = mock()
    userAccountRepository.load.mockResolvedValue(undefined)
    userAccountRepository.saveWithFacebook.mockResolvedValue({
      id: 'any_account_id'
    })
    crypto = mock()
    crypto.generateToken.mockResolvedValue('any_generated_token')
    sut = new FacebookAuthenticationService(
      facebookApi,
      userAccountRepository,
      crypto
    )
  })

  it('should call LoadFacebookUserApiSpy with correct params', async () => {
    await sut.perform({ token })

    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token })
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadFacebookUserApiSpy returns undefined', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined)
    const authResult = await sut.perform({ token })

    expect(authResult).toEqual(new AuthenticationError())
  })

  it('should return loadUserAccountRepository when LoadFacebookUserApiSpy returns data', async () => {
    await sut.perform({ token })

    expect(userAccountRepository.load).toHaveBeenCalledWith({ email: 'any_fb_email' })
    expect(userAccountRepository.load).toHaveBeenCalledTimes(1)
  })

  it('should call SaveFacebookAccountRepository with FacebookAccount', async () => {
    const fbAccountStub = jest.fn().mockImplementation(() => ({ any: 'any' }))
    mocked(FacebookAccount).mockImplementation(fbAccountStub)

    await sut.perform({ token })

    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith({ any: 'any' })
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  it('should call TokenGenerator with correct params', async () => {
    await sut.perform({ token })

    expect(crypto.generateToken).toHaveBeenCalledWith({
      key: 'any_account_id',
      expirationInMs: AccessToken.expirationInMs
    })
    expect(crypto.generateToken).toHaveBeenCalledTimes(1)
  })

  it('should return AccessToken on Success', async () => {
    const authRes = await sut.perform({ token })

    expect(authRes).toEqual(new AccessToken('any_generated_token'))
  })
})
