import { injectable, inject } from 'tsyringe';
import { isAfter, addHours } from 'date-fns';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface Request {
  token: string;
  password: string;
}

@injectable()
export default class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private UserTokensRepository: IUserTokensRepository,

    @inject('HashProvider')
    private HashProvider: IHashProvider,
  ) {};

  public async execute({ token, password }: Request): Promise<void> {
    const userToken = await this.UserTokensRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('User token does not exist', 404)
    }

    const user = await this.usersRepository.findById(userToken?.user_id);

    if (!user) {
      throw new AppError('User does not exist', 404)
    }

    const tokenCreatedAt = userToken.created_at;
    const compareDate = addHours(tokenCreatedAt, 2);

    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('Token expired')
    }

    user.password = await this.HashProvider.generateHash(password);

    await this.usersRepository.save(user);
  }
}