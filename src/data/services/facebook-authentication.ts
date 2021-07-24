import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '@/data/interfaces/apis'
import { LoadUserAccountRepository, CreateFacebookAccountRepository, UpdateFabookAccountRepository } from '@/data/interfaces/repositories'

export class FacebookAuthenticationService {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepository: LoadUserAccountRepository & CreateFacebookAccountRepository & UpdateFabookAccountRepository
  ) {

  }

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(params)
    if (fbData !== undefined) {
      const accountData = await this.userAccountRepository.load({ email: fbData.email })
      if (accountData?.name !== undefined) {
        await this.userAccountRepository.updateWithFacebook({
          id: accountData.id,
          name: accountData.name,
          facebookId: fbData.facebookId
        })
      } else {
        await this.userAccountRepository.createFromFacebook(fbData)
      }
    }
    return new AuthenticationError()
  }
}
