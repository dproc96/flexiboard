module.exports = (sequelize, DataTypes) => {
    const Board = sequelize.define('Board', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [3, 50],
                    msg: 'board name must be between 3 and 50 characters'
                }
            }
        }
    })

    Board.associate = models => {
        Board.hasMany(models.CardInstance, {
            foreignKey: {
                allowNull: false
            }
        })

        Board.belongsToMany(models.User, {
            through: models.UserBoard,
            foreignKey: {
                allowNull: false
            }
        })
    }

    return Board;
}