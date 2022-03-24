import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  // why readonly? because this is our payload
  @IsNotEmpty()
  readonly username: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;
}
