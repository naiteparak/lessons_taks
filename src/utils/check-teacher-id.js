import { knexConfig as knex } from '../configs/knex-config.js';

export const checkTeacherId = async function (tableName, id) {
  const result = await knex(tableName).select().where({ id }).first();
  return !!result;
};
