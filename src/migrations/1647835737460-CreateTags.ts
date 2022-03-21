import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTags1647835737460 implements MigrationInterface {
  name = 'CreateTags1647835737460';

  // do
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tags" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`,
    );
  }

  // undo
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "tags"`);
  }
}
