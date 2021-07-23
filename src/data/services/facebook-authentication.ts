import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '@/data/interfaces/apis'
import { LoadUserAccountRepository, CreateFacebookAccountRepository } from '@/data/interfaces/repositories'

export class FacebookAuthenticationService {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepository: LoadUserAccountRepository & CreateFacebookAccountRepository
  ) {

  }

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(params)
    if (fbData !== undefined) {
      await this.userAccountRepository.load({ email: fbData.email })
      await this.userAccountRepository.createFromFacebook(fbData)
    }
    return new AuthenticationError()
  }
}
