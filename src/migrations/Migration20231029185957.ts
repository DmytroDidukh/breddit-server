import { Migration } from '@mikro-orm/migrations';

export class Migration20231029185957 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            // eslint-disable-next-line max-len
            'create table "user" ("id" serial primary key, "created_at" timestamptz(0) not null default \'now()\', "updated_at" timestamptz(0) not null default \'now()\', "username" text not null, "password" text not null);',
        );
        this.addSql(
            'alter table "user" add constraint "user_username_unique" unique ("username");',
        );
    }

    async down(): Promise<void> {
        this.addSql('drop table if exists "user" cascade;');
    }
}
