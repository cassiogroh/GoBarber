import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';

import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {};

  public async execute({ email, password }: Request): Promise<Response> {

    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Incorrect e-mail/password combination.', 401);
    };

    const passwordMatched = await this.hashProvider.compareHash(password, user.password);

    if (!passwordMatched) {
      throw new AppError('Incorrect e-mail/password combination.', 401);
    };

    // Usuário autenticado

    /**
     * sign: Primeiro parâmetro: payload (permissões, email, nome, etc...)
     *       Segundo parâmetro : "secret" que somente a aplicação sabe (site para gerar hash: md5 online)
     *       Terceiro parâmetro: configurações
     * 
     * jwt.io : Decodificar token jwt
     */

    const { secret, expiresIn } = authConfig.jwt;
    
    const token = sign({}, secret, {
      subject: user.id, // Sempre será o user.id
      expiresIn: expiresIn,
    });

    return {
      user,
      token
    };
  }
};

export default AuthenticateUserService;