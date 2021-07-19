import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthenticationService } from '@/data/services'

import { mock, MockProxy } from 'jest-mock-extended'
import { LoadFacebookUserApi } from '../interfaces/apis'

type SutTypes = {
  loadFacebookUserApi: MockProxy<LoadFacebookUserApi>
  sut: FacebookAuthenticationService
}

const makeSut = (): SutTypes => {
  const loadFacebookUserApi = mock<LoadFacebookUserApi>()
  const sut = new FacebookAuthenticationService(loadFacebookUserApi)

  return {
    sut,
    loadFacebookUserApi
  }
}

describe('FacebookAuthenticationService', () => {
  it('shoud call LoadFacebookUserApiSpy with correct params', async () => {
    const { sut, loadFacebookUserApi } = makeSut()
    await sut.perform({ token: 'some_token' })

    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token: 'some_token' })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('shoud return AuthenticationError when LoadFacebookUserApiSpy returns undefined', async () => {
    const { sut, loadFacebookUserApi } = makeSut()

    loadFacebookUserApi.loadUser.mockResolvedValue(undefined)
    const authResult = await sut.perform({ token: 'some_token' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})
