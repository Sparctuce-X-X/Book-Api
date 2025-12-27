const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Modèle BookLike (Like de livre)
 * Table de liaison pour les likes des utilisateurs sur les livres
 * Contraint unique sur (userId, bookId) pour éviter les doubles likes
 */
const BookLike = sequelize.define(
  'BookLike',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    bookId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'books',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
  {
    tableName: 'book_likes',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'bookId'],
        name: 'unique_user_book_like',
      },
    ],
  }
);

module.exports = BookLike;

