const User = require('./User');
const Book = require('./Book');

// Définition des associations
User.hasMany(Book, {
  foreignKey: 'ownerId',
  as: 'books',
});

Book.belongsTo(User, {
  foreignKey: 'ownerId',
  as: 'owner',
});

module.exports = {
  User,
  Book,
};

