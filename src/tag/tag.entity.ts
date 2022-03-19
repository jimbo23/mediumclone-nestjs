import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

//* entity in typeORM will create a table in postgres
@Entity({ name: 'tags' })
export class TagEntity {
  @PrimaryGeneratedColumn()
  //**  all id in postgres is number*/
  id: number;

  @Column()
  name: string;
}
