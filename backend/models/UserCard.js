module.exports = (sequelize, DataTypes) => {
    const UserCard = sequelize.define('UserCard', {
        role: DataTypes.STRING
    });
    return UserCard;
}