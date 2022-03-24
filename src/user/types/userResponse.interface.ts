import { UserType } from '@app/user/types/user.types';

export interface UserResponseInterface {
  // we dont put token property in UserEntity
  // use '&' will merge this 2 types
  // like merge two objects
  user: UserType & { token: string };
}
