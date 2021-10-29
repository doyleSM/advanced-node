import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/interfaces/repositories'
import { getRepository, Repository } from 'typeorm'
import { PgUser } from '@/infra/postgres/entities'

export class PgUserAccountRepository implements LoadUserAccountRepository, SaveFacebookAccountRepository {
  private readonly pgUserRepo: Repository<PgUser> = getRepository(PgUser)
  async load (params: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const pgUser = await this.pgUserRepo.findOne({ email: params.email })
    if (pgUser != null) {
      return {
        id: String(pgUser?.id),
        ...((pgUser?.name != null) && { name: pgUser?.name })
      }
    }
    return undefined
  }

  async saveWithFacebook (params: SaveFacebookAccountRepository.Params): Promise<SaveFacebookAccountRepository.Result> {
    if (params.id === undefined) {
      const userAccount = await this.pgUserRepo.save({
        email: params.email,
        name: params.name,
        facebookId: params.facebookId
      })
      return {
        id: String(userAccount.id)
      }
    }
    await this.pgUserRepo.update({
      id: parseInt(params.id)
    }, {
      name: params.name,
      facebookId: params.facebookId
    })

    return { id: String(params.id) }
  }
}
