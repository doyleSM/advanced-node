import { LoadUserAccountRepository } from '@/data/interfaces/repositories'
import { getRepository } from 'typeorm'
import { PgUser } from '@/infra/postgres/entities'

export class PgUserAccountRepository implements LoadUserAccountRepository {
  async load (params: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const pgUserRepo = getRepository(PgUser)
    const pgUser = await pgUserRepo.findOne({ email: params.email })
    if (pgUser != null) {
      return {
        id: String(pgUser?.id),
        ...((pgUser?.name != null) && { name: pgUser?.name })
      }
    }
    return undefined
  }
}
