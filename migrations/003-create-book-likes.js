'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('book_likes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      bookId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'books',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Index unique pour éviter les doubles likes
    await queryInterface.addIndex('book_likes', ['userId', 'bookId'], {
      unique: true,
      name: 'unique_user_book_like',
    });

    // Index pour améliorer les performances
    await queryInterface.addIndex('book_likes', ['userId'], {
      name: 'book_likes_userId_idx',
    });
    await queryInterface.addIndex('book_likes', ['bookId'], {
      name: 'book_likes_bookId_idx',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('book_likes');
  },
};

