import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  // why readonly? because this is our payload
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;
}
