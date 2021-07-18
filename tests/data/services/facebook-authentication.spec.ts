import { FacebookAuthentication } from '@/domain/features/facebook-authentication'

class FacebookAuthenticationService {
  async perform (params: FacebookAuthentication.Params): Promise<void> {
  }
}

interface LoadFacebookUserByTokenApi {
  loadUserByToken: (token: string) => Promise<void>
}

describe('FacebookAuthenticationService', () => {
  it('', async () => {
    const facebookApi = new LoadFacebookUserByTokenApi()
    const sut = new FacebookAuthenticationService()
    await sut.perform({ token: 'some_token' })

    expect(facebookApi.token).toBe('some_token')
  })
})
