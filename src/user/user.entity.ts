import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { hash } from 'bcrypt';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  // safer to by default unselect the password
  // coz userEntity is reused a lot
  @Column({ select: false })
  password: string;

  @Column()
  username: string;

  @Column({ default: '' })
  bio: string;

  @Column({ default: '' })
  image: string;

  @BeforeInsert()
  async hashPassword() {
    // overwrite with hashed version
    // res = await hash(plainPassword, salt)
    this.password = await hash(this.password, 10);
  }
}
