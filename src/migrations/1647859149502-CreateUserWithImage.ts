import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateUserWithImage1647859149502 implements MigrationInterface {
    name = 'CreateUserWithImage1647859149502'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "image" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "image"`);
    }

}
