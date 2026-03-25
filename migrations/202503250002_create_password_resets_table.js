/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('password_resets', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable();
      table.string('token', 255).notNullable().unique();
      table.timestamp('expires_at').notNullable();
      table.boolean('used').defaultTo(false);
      table.timestamp('created_at').defaultTo(knex.fn.now());

      // 外键约束
      table
        .foreign('user_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');

      // 索引
      table.index('user_id', 'idx_password_resets_user_id');
      table.index('token', 'idx_password_resets_token');
      table.index('expires_at', 'idx_password_resets_expires_at');
    })
    .then(() => {
      console.log('Password resets table created successfully');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('password_resets');
};
