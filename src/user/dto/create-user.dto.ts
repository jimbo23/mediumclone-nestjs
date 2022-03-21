export class CreateUserDto {
  // why readonly? because this is our payload
  readonly username: string;
  readonly email: string;
  readonly password: string;
}
