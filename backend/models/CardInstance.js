module.exports = (sequelize, DataTypes) => {
    const CardInstance = sequelize.define("CardInstance", {
        width: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        height: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        top: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        left: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    })


    return CardInstance;
}