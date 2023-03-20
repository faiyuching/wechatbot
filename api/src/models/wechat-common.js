import { DB } from "../util/index.js";
import { DataTypes } from "sequelize";
const db = new DB().getInstance();
/**
 * 微信群组表
 */
const WechatRoom = db.define('WechatRoom', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    room_ident: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
    owner: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    manage: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    groupid: {
        type: DataTypes.INTEGER,
    },
}, {
    tableName: 'wechat_room',
    timestamps: false,
    indexes: [
        {
            name: 'room_ident',
            unique: true,
            fields: ['room_ident']
        }
    ],
});
/**
 * 关键词回复表
 */
const WechatKeyword = db.define('WechatKeyword', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    keyword: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM,
        values: [1, 2, 3],
        defaultValue: 1,
    },
    reply: {
        type: DataTypes.STRING,
    },
    event: {
        type: DataTypes.STRING,
    },
    scope: {
        type: DataTypes.ENUM,
        values: ['all', 'group', 'personal'],
        defaultValue: 'all',
    },
    status: {
        type: DataTypes.ENUM,
        values: [0, 1],
        defaultValue: 1,
    },
    created_at: {
        type: DataTypes.DATE,
    },
    updated_at: {
        type: DataTypes.DATE,
    },
}, {
    tableName: 'wechat_keyword',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            name: 'title',
            unique: true,
            fields: ['title']
        }
    ],
});
/**
 * 消息
 */
const WechatInformation = db.define('WechatInformation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM,
        values: [1, 2, 3],
        defaultValue: 1,
    },
    reply: {
        type: DataTypes.STRING,
    },
    created_at: {
        type: DataTypes.DATE,
    },
    updated_at: {
        type: DataTypes.DATE,
    },
}, {
    tableName: 'wechat_information',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            name: 'title',
            unique: true,
            fields: ['title']
        }
    ],
});
/**
 * 标签
 */
const WechatTag = db.define('WechatTag', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
    },
    updated_at: {
        type: DataTypes.DATE,
    },
}, {
    tableName: 'wechat_tag',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            name: 'value',
            unique: true,
            fields: ['value']
        }
    ],
});
/**
 * 消息与标签关联表
 */
const WechatInformationTag = db.define('WechatInformationTag', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    information_id: {
        type: DataTypes.INTEGER,
    },
    tag_id: {
        type: DataTypes.INTEGER,
    },
    created_at: {
        type: DataTypes.DATE,
    },
    updated_at: {
        type: DataTypes.DATE,
    },
}, {
    tableName: 'wechat_information_tag',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            name: 'information_tag_id',
            unique: true,
            fields: ['information_id','tag_id']
        }
    ],
});
export { WechatRoom };
export { WechatKeyword };
export { WechatInformation };
export { WechatTag };
export { WechatInformationTag };
export default {
    WechatRoom,
    WechatKeyword,
    WechatInformation,
    WechatTag,
    WechatInformationTag
};