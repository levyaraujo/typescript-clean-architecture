import { IUserRepository } from "../infra/db/user.repository";
import { User, UserEntity } from "../domain/user/user.entity";

interface IUserCases {
  createUser(userData: User): Promise<User | string>;
  listUsers(): Promise<User[]>;
  userExists(email: string): Promise<boolean>;
}

export class UserCases implements IUserCases {
  constructor(private readonly userRepository: IUserRepository) {}

  async createUser(userData: User) {
    const userEntity = new UserEntity(userData);
    const exists = await this.userExists(userData.email);
    if (!exists) {
      await this.userRepository.insert(userEntity.toJSON());
      return userEntity.toJSON();
    }
    return "User already exists";
  }

  async userExists(email: string): Promise<boolean> {
    const exists = await this.userRepository.exists(email);
    return exists;
  }

  async listUsers() {
    const users = await this.userRepository.findAll();
    return users;
  }
}
