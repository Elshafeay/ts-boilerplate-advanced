import { Knex, knex } from 'knex';
import DBManager, { dbManagerInstance } from '../../../config/DBManager';
import { ICreateUser, IUserModel, IUserSerialized } from './user.interfaces';
import Logger from '../../middlewares/logger';
import { Logger as ILogger } from 'winston';
import { UserDefColumn } from './user.enums';
import { boundMethod } from 'autobind-decorator';

export class UserRepository {
  private readonly tableName = 'users';
  private queryBuilder: DBManager;
  private flatColumns: UserDefColumn[];
  private logger: ILogger;

  constructor(
  ) {
    this.logger = Logger;
    this.queryBuilder = dbManagerInstance;
    this.flatColumns = Object.values(UserDefColumn);
  }

  @boundMethod
  public async findOneById(id: number): Promise<IUserSerialized|null>{
    const user = await this.queryBuilder.mysql<IUserModel>(this.tableName)
      .select(...this.flatColumns)
      .where({ id })
      .first();

    return user || null;
  }

  @boundMethod
  public async findOneByEmail(email: string): Promise<IUserModel|null>{
    const user = await this.queryBuilder.mysql<IUserModel>(this.tableName)
      .select()
      .where({ email })
      .first();

    return user || null;
  }

  @boundMethod
  public async findAll(): Promise<IUserSerialized[]>{
    const users = await this.queryBuilder.mysql<IUserModel>(this.tableName)
      .select(this.flatColumns);

    return users;
  }

  @boundMethod
  public async create(user: ICreateUser): Promise<number>{
    const [newUserId] = await this.queryBuilder.mysql<IUserModel>(this.tableName)
      .insert(user);

    this.logger.info('New User Has Been Created!');
    return newUserId;
  }
}

export default new UserRepository();