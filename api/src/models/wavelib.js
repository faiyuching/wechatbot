import { DataTypes, Op } from "sequelize";
import { DB } from "../util/index.js";
const db = new DB().getInstance();
const Group = db.define('Group', {
    groupid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    groupname: {
        type: DataTypes.STRING,
    },
    libraryid: {
        type: DataTypes.INTEGER,
    },
    photo: {
        type: DataTypes.STRING,
    }
}, {
    tableName: 'group',
    timestamps: false,
});
Group.processPhoto = function (photo) {
    if (!photo) {
        return '';
    }
    return 'http://park.sanzhi.org.cn/uploadfile/group/' + photo;
};
/**
  * 微澜社区用户信息模型
  */
const UserInfo = db.define('UserInfo', {
    userid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
    },
    sex: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        defaultValue: "",
    },
    idcard: {
        type: DataTypes.STRING,
        defaultValue: "",
    },
    face: {
        type: DataTypes.STRING,
        defaultValue: "",
    },
    about: {
        type: DataTypes.STRING,
        defaultValue: "",
    },
    isadmin: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
    addtime: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    testtime: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    renzhengtime: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    isrenzheng: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    grade: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'user_info',
    timestamps: false
});
UserInfo.processPhoto = function (photo) {
    if (!photo) {
        return '';
    }
    return 'http://park.sanzhi.org.cn/uploadfile/user/' + photo;
};
/**
  * 微澜社区用户模型
  */
const User = db.define('User', {
    userid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    pwd: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    salt: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'user',
    timestamps: false,
});
User.hasOne(UserInfo, {
    targetName: 'userid',
    foreignKey: 'userid',
});
UserInfo.belongsTo(User, {
    targetName: 'userid',
    foreignKey: 'userid'
});

/**
  * 微澜社区分馆用户模型
  */
const GroupUser = db.define('GroupUser', {
    userid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    groupid: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    grouptype: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    isvo: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    addtime: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'group_user',
    timestamps: false,
});

const UserApply = db.define('UserApply', {
    applyid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userid: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    groupid: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    type: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    score: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    addtime: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'user_apply',
    timestamps: false
});

const Weibo = db.define('Weibo', {
    weiboid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userid: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    addtime: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'weibo',
    timestamps: false
});

export { Group };
export { User };
export { UserInfo };
export { GroupUser };
export { UserApply };
export { Weibo };
export default {
    Group,
    User,
    UserInfo,
    GroupUser,
    UserApply,
    Weibo
};
