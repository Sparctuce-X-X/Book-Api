const User = require('./User');
const Book = require('./Book');
const BookLike = require('./BookLike');

// Définition des associations
User.hasMany(Book, {
  foreignKey: 'ownerId',
  as: 'books',
});

Book.belongsTo(User, {
  foreignKey: 'ownerId',
  as: 'owner',
});

// Associations pour les likes
User.belongsToMany(Book, {
  through: BookLike,
  foreignKey: 'userId',
  as: 'likedBooks',
});

Book.belongsToMany(User, {
  through: BookLike,
  foreignKey: 'bookId',
  as: 'likedBy',
});

module.exports = {
  User,
  Book,
  BookLike,
};

