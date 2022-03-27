import { Request, Response } from 'express';
import { ICreateUser } from './user.interfaces';
import { NotFoundError } from '../../errors/not-found-error';
import CustomResponse from '../../utils/custom-response';
import userServiceInstance, { UserService } from './user.service';
import Logger from '../../middlewares/logger';
import { Logger as ILogger } from 'winston';
import { boundMethod } from 'autobind-decorator';

class UserController {
  private logger: ILogger;
  private userService: UserService;

  constructor(
  ) {
    this.logger = Logger;
    this.userService = userServiceInstance;
  }

  @boundMethod
  public async getProfile(req: Request, res: Response){
    CustomResponse.send(res, { profile: req.user });
  }

  @boundMethod
  public async getUser(req: Request, res: Response){
    const user = await this.userService.getUser(+req.params.id);
    if(!user){
      throw new NotFoundError('User Not Found!');
    }
    CustomResponse.send(res, { user });
  }

  @boundMethod
  public async getUsers(req: Request, res: Response){
    const users = await this.userService.getUsers();
    CustomResponse.send(res, { users });
  }

  @boundMethod
  public async login(req: Request, res: Response){
    const {
      email,
      password,
    } = req.body;

    const result = await this.userService.login(email, password);
    if(!result){
      return CustomResponse.sendWithError(res, 'Invalid Credentials!', 404);
    }
    CustomResponse.send(res, result, `Welcome Back, ${result.user.firstname}`);
  }

  @boundMethod
  public async signUp(req: Request, res: Response){
    const {
      firstname,
      lastname,
      email,
      password,
    } = req.body;

    const dataObject: ICreateUser = { firstname, lastname, email, password };
    const result = await this.userService.signUp(dataObject);

    return CustomResponse.send(res, result, 'Created Successfully', 201);

  }
}

export default new UserController();