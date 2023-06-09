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
    is_welcome_open: {
        type: DataTypes.ENUM,
        values: [0, 1],
        defaultValue: 1,
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
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM,
        values: [1, 2, 3],
        defaultValue: 1,
    },
    reply: {
        type: DataTypes.JSON,
    },
    is_friend_welcome: {
        type: DataTypes.ENUM,
        values: [0, 1],
        defaultValue: 0,
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
            name: 'name',
            unique: true,
            fields: ['name']
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
/**
 * 自动回复
 */
const WechatAutoReply = db.define('WechatAutoReply', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    keyword: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM,
        values: [0, 1],
        defaultValue: 1,
    },
}, {
    tableName: 'wechat_auto_reply',
    timestamps: false,
    indexes: [
        {
            name: 'uk_keyword',
            unique: true,
            fields: ['keyword']
        }
    ],
});
/**
 * 行为消息关联表
 */
const WechatAutoReplyInformation = db.define('WechatAutoReplyInformation', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    auto_reply_id: {
        type: DataTypes.INTEGER,
    },
    information_id: {
        type: DataTypes.INTEGER,
    },
}, {
    tableName: 'wechat_auto_reply_information',
    timestamps: false,
    indexes: [
        {
            name: 'uk_auto_reply_id_information_id',
            unique: true,
            fields: ['auto_reply_id', 'information_id']
        }
    ],
});
/**
 *  群组与消息关联
 */
const WechatRoomInformation = db.define('WechatRoomInformation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    room_id: {
        type: DataTypes.INTEGER,
    },
    information_id: {
        type: DataTypes.INTEGER,
    },
    created_at: {
        type: DataTypes.DATE,
    },
    updated_at: {
        type: DataTypes.DATE,
    },
}, {
    tableName: 'wechat_room_information',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            name: 'room_id_information_id',
            unique: true,
            fields: ['room_id','information_id']
        }
    ],
});
/**
 * 群发消息
 */
const WechatBulkMessage = db.define('WechatBulkMessage', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    info_ids: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    group_ids: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM,
        values: [0, 1, 2],
        defaultValue: 0,
    },
    post_at: {
        type: DataTypes.DATE,
    },
    created_at: {
        type: DataTypes.DATE,
    },
    updated_at: {
        type: DataTypes.DATE,
    },
}, {
    tableName: 'wechat_bulk_message',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});
/**
 * 群发消息开关
 */
const WechatSendMsgToRoom = db.define('WechatSendMsgToRoom', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    is_send_msg_to_room: {
        type: DataTypes.ENUM,
        values: [0, 1],
        defaultValue: 0,
    },
}, {
    tableName: 'wechat_send_msg_to_room',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});
export { WechatRoom };
export { WechatKeyword };
export { WechatInformation };
export { WechatTag };
export { WechatInformationTag };
export { WechatAutoReply };
export { WechatAutoReplyInformation };
export { WechatRoomInformation };
export { WechatBulkMessage };
export { WechatSendMsgToRoom };
export default {
    WechatRoom,
    WechatKeyword,
    WechatInformation,
    WechatTag,
    WechatInformationTag,
    WechatAutoReply,
    WechatAutoReplyInformation,
    WechatRoomInformation,
    WechatBulkMessage,
    WechatSendMsgToRoom,
};
