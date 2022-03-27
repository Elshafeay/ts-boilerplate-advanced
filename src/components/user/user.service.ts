import { Request, Response } from 'express';
import { BadRequestError } from '../../errors/bad-request-error';
import { ICreateUser, IUserSerialized } from './user.interfaces';
import { Password } from '../../utils/password';
import { NotFoundError } from '../../errors/not-found-error';
import CustomResponse from '../../utils/custom-response';
import { JWT } from '../../utils/jwt';
import Logger from '../../middlewares/logger';
import { Logger as ILogger } from 'winston';
import userRepositoryInstance, { UserRepository } from './user.repository';
import { boundMethod } from 'autobind-decorator';

export class UserService {
  private userRepository: UserRepository;
  private logger: ILogger;

  constructor(
  ) {
    this.logger = Logger;
    this.userRepository = userRepositoryInstance;
  }

  @boundMethod
  public async getUser(id: number){
    const user = await this.userRepository.findOneById(id);
    if(!user){
      throw new NotFoundError('User Not Found!');
    }
    return user;
  }

  @boundMethod
  public async getUsers(){
    return await this.userRepository.findAll();
  }

  @boundMethod
  public async login(email: string, password: string){
    const user = await this.userRepository.findOneByEmail(email);
    if(!user){
      return null;
    }

    const isMatch = await Password.compare(user.password, password);
    if(isMatch){
      const token = JWT.sign(user as IUserSerialized);

      const { password, ...userSerialization } = user;

      const result = { user: userSerialization, token };
      return result;
    }else{
      return null;
    }
  }

  @boundMethod
  public async signUp(dataObject: ICreateUser){
    const existingUser = await this.userRepository.findOneByEmail(dataObject.email);
    if(existingUser){
      throw new BadRequestError('There\'s a user with this email already!');
    }
    const hashedPassword = await Password.toHash(dataObject.password);

    dataObject.password = hashedPassword ;
    const userId = await this.userRepository.create(dataObject);
    const user = await this.userRepository.findOneById(userId);
    // Creating a JWT token for this user, and returning it back in the response
    // so that it can be used in the Authentication process
    const token = JWT.sign(user as IUserSerialized);
    const result = { user, token };

    return result;
  }
}

export default new UserService();