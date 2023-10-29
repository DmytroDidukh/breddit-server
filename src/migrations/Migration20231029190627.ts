import { Migration } from '@mikro-orm/migrations';

export class Migration20231029190627 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'alter table "post" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));',
        );
        this.addSql('alter table "post" alter column "created_at" set default \'now()\';');
        this.addSql(
            'alter table "post" alter column "updated_at" type timestamptz(0) using ("updated_at"::timestamptz(0));',
        );
        this.addSql('alter table "post" alter column "updated_at" set default \'now()\';');

        this.addSql(
            'alter table "user" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));',
        );
        this.addSql('alter table "user" alter column "created_at" set default \'now()\';');
        this.addSql(
            'alter table "user" alter column "updated_at" type timestamptz(0) using ("updated_at"::timestamptz(0));',
        );
        this.addSql('alter table "user" alter column "updated_at" set default \'now()\';');
    }

    async down(): Promise<void> {
        this.addSql(
            'alter table "post" alter column "created_at" type timestamptz using ("created_at"::timestamptz);',
        );
        this.addSql(
            'alter table "post" alter column "created_at" set default \'2023-10-29 21:06:14.765049+02\';',
        );
        this.addSql(
            'alter table "post" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);',
        );
        this.addSql(
            'alter table "post" alter column "updated_at" set default \'2023-10-29 21:06:14.765049+02\';',
        );

        this.addSql(
            'alter table "user" alter column "created_at" type timestamptz using ("created_at"::timestamptz);',
        );
        this.addSql(
            'alter table "user" alter column "created_at" set default \'2023-10-29 21:06:14.765049+02\';',
        );
        this.addSql(
            'alter table "user" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);',
        );
        this.addSql(
            'alter table "user" alter column "updated_at" set default \'2023-10-29 21:06:14.765049+02\';',
        );
    }
}
