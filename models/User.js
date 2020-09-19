module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [5, 20],
                    msg: 'username must be at least 5 characters and less than 20 characters'
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [8, 60],
                    msg: 'password must be more than 8 characters and less than 60 characters'
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                args: true,
                msg: 'this email is already registered'
            },
            validate: {
                len: {
                    args: [1, 200],
                    msg: 'email must be less than 200 characters long'
                }
            }
        }
    })
    
    User.associate = models => {
        User.hasMany(models.Card, {
            foreignKey: {
                allowNull: false
            }
        });
        User.hasMany(models.Board, {
            foreignKey: {
                allowNull: false
            }
        });
    }

    return User;
}