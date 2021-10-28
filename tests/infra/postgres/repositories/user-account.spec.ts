import { LoadUserAccountRepository } from '@/data/interfaces/repositories'
import { newDb } from 'pg-mem'
import { Column, Entity, getRepository, PrimaryGeneratedColumn } from 'typeorm'
class PgUserAccountRepository implements LoadUserAccountRepository {
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

@Entity({ name: 'usuario' })
class PgUser {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ nullable: true, name: 'nome' })
  name?: string

  @Column()
  email!: string

  @Column({ nullable: true, name: 'id_facebook' })
  facebookId?: string
}

describe('PgUserAccountRepository', () => {
  describe('load', () => {
    it('should return an account if email exists', async () => {
      const db = newDb()
      db.public.registerFunction({
        implementation: () => 'test',
        name: 'current_database'
      })
      const connection = await db.adapters.createTypeormConnection({
        type: 'postgres',
        entities: [PgUser]
      })

      await connection.synchronize()

      const pgUserRepo = getRepository(PgUser)

      await pgUserRepo.save({
        email: 'existing_email'
      })

      const sut = new PgUserAccountRepository()

      const account = await sut.load({ email: 'existing_email' })

      expect(account).toEqual({ id: '1' })

      await connection.close()
    })

    it('should return undefined if email does exists', async () => {
      const db = newDb()

      db.public.registerFunction({
        implementation: () => 'test',
        name: 'current_database'
      })
      const connection = await db.adapters.createTypeormConnection({
        type: 'postgres',
        entities: [PgUser]
      })

      await connection.synchronize()

      const sut = new PgUserAccountRepository()

      const account = await sut.load({ email: 'new_email' })

      expect(account).toBeUndefined()

      await connection.close()
    })
  })
})
