/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('users', (table) => {
      table.increments('id').primary();
      table.string('name', 255).notNullable();
      table.string('email', 255).notNullable().unique();
      table.string('password', 255).notNullable();
      table.enum('role', ['admin', 'user']).defaultTo('user');
      table.boolean('is_active').defaultTo(true);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());

      // 索引
      table.index('email', 'idx_users_email');
      table.index('role', 'idx_users_role');
      table.index('is_active', 'idx_users_is_active');
    })
    .then(() => {
      console.log('Users table created successfully');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users');
};
