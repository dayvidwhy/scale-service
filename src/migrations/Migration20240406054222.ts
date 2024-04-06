import { Migration } from '@mikro-orm/migrations';

export class Migration20240406054222 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "scale_job" ("id" serial primary key, "guid" varchar(255) not null, "pending" boolean not null, "type" varchar(255) not null);');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "scale_job" cascade;');
  }

}
