import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from './users.repository.interface';

export const IUsersService = Symbol('IUsersService');

export interface IUsersService {
  getProfile(userId: string): Promise<User | null>;
  updateProfile(userId: string, data: UpdateUserDto): Promise<User>;
}
