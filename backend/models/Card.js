module.exports = (sequelize, DataTypes) => {
    const Card = sequelize.define('Card', {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        body: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })

    Card.associate = models => {
        Card.hasMany(models.CardInstance, {
            foreignKey: {
                allowNull: false
            }
        })
        Card.belongsToMany(models.User, {
            through: models.UserCard,
            foreignKey: {
                allowNull: false
            }
        })
    }

    return Card;
}