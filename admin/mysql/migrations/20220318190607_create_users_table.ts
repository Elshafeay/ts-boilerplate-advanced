import { Knex } from 'knex';
import {
  Tables,
  Timestamps,
  User,
} from '../schemas.enums';


function addTimeStamps(knex: Knex, table: Knex.CreateTableBuilder) {
  table.timestamp(Timestamps.createdAt).defaultTo(knex.fn.now());
  table.timestamp(Timestamps.updatedAt).defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
}

function createUserTable(knex: Knex, table: Knex.CreateTableBuilder) {
  table.increments(User.id).unsigned();
  table.string(User.firstname, 100).notNullable();
  table.string(User.lastname, 100).notNullable();
  table.string(User.email, 255).notNullable().unique();
  table.string(User.password, 100).notNullable();
  table.string(User.phoneNumber, 20);
  
  addTimeStamps(knex, table);
}

export async function up(knex: Knex): Promise<void> {

  return knex.schema
    .createTable(Tables.User, (table: Knex.CreateTableBuilder) => createUserTable(knex, table))
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTable(Tables.User)
}
