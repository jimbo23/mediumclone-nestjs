import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDb1647835737460 implements MigrationInterface {
  name = 'SeedDb1647835737460';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO tags (name) VALUES ('dragons'), ('coffee'), ('nestjs')`,
    );

    await queryRunner.query(
      // password is kiefer
      `INSERT INTO users (username, email, password) VALUES ('kiefer','kiefer@gmail.com', '$2b$10$0IK5Gujv21Iow6B8Qp2DhOrEkV2Nz9KMKV/Q8UDyGaNHmDOyVPLrO')`,
    );

    await queryRunner.query(
      `INSERT INTO articles (slug, title, description, body, "tagList", "authorId") VALUES ('first-article', 'First Article', 'First Article Description', 'First Article Body', 'coffee,dragons', 1),('second-article', 'Second Article', 'Second Article Description', 'Second Article Body', 'coffee,dragons', 1)`,
    );
  }

  public async down(): Promise<void> {}
}
