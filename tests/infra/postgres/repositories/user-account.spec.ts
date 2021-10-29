import { PgUser } from '@/infra/postgres/entities'
import { PgUserAccountRepository } from '@/infra/postgres/repositories'
import { makeFakeDb } from '@/tests/infra/postgres/mocks'

import { getConnection, getRepository, Repository } from 'typeorm'
import { IBackup } from 'pg-mem'

describe('PgUserAccountRepository', () => {
  let sut: PgUserAccountRepository
  let pgUserRepo: Repository<PgUser>
  let backup: IBackup

  beforeAll(async () => {
    const db = await makeFakeDb([PgUser])
    backup = db.backup()
    pgUserRepo = getRepository(PgUser)
  })

  beforeEach(() => {
    backup.restore()
    sut = new PgUserAccountRepository()
  })

  afterAll(async () => {
    await getConnection().close()
  })
  describe('load', () => {
    it('should return an account if email exists', async () => {
      await pgUserRepo.save({
        email: 'any_email'
      })

      const account = await sut.load({ email: 'any_email' })

      expect(account).toEqual({ id: '1' })
    })

    it('should return undefined if email does exists', async () => {
      const account = await sut.load({ email: 'any_email' })

      expect(account).toBeUndefined()
    })
  })

  describe('save with facebook', () => {
    it('should create an account if id is undefined', async () => {
      const account = await sut.saveWithFacebook({
        email: 'any_email',
        name: 'any_name',
        facebookId: 'any_fb_id'
      })
      const pgUser = await pgUserRepo.findOne({ email: 'any_email' })

      expect(pgUser).toEqual({
        id: 1,
        email: 'any_email',
        name: 'any_name',
        facebookId: 'any_fb_id'
      })
      expect(account?.id).toBe('1')
    })

    it('should update an account if id is defined', async () => {
      await pgUserRepo.save({
        email: 'any_email',
        name: 'any_name',
        facebookId: 'any_fb_id'
      })

      await sut.saveWithFacebook({
        id: '1',
        email: 'new_email',
        name: 'updated_name',
        facebookId: 'updated_fb_id'
      })
      const pgUser = await pgUserRepo.findOne({ id: 1 })

      expect(pgUser).toEqual({
        id: 1,
        email: 'any_email',
        name: 'updated_name',
        facebookId: 'updated_fb_id'
      })
    })
  })
})
