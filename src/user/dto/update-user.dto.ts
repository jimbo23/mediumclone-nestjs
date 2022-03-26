import { IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsOptional()
  bio: string;

  @IsOptional()
  image: string;
}
