module.exports = (sequelize, DataTypes) => {
    const UserBoard = sequelize.define('UserBoard', {
        role: DataTypes.STRING
    });
    return UserBoard;
}