export class DmConstants {
    static DEFAULT_SCHEMA_ID = 2;//默认的方案ID
    static DEFAULT_REFERENCE_ID = 0;//默认的引用方案
    /**
     * 关系类型
     */
    static RelationType = {
        /**
         * 一对一关系
         */
        oneToOne: 1,
        /**
         * 一对多关系
         */
        oneToMulti: 2,
        /**
         * 多对一关系
         */
        multiToOne: 3,
        /**
         * 多对多关系
         */
        multiToMulti: 4,
    };
    static ConstField = {
        versionCode: "version_code",
        xh: "xh",
        lvlCode: "lvl_code"
    };

    /**
     * 默认的方案作用
     */
    static DefaultSchemaIDs = {
        /**
         * 默认业务方案ID
         */
        DEFAULT_BS_SCHEMA: 3,
        /**
         * 默认系统方案ID
         */
        DEFAULT_SYS_SCHEMA: 2,
        /**
         * 基础方案方案
         */
        DEFAULT_DM_SCHEMA: 1,
        /**
         * 全局引用方案
         */
        DEFAULT_REFERENCE_SCHEMA: 0,
    }

    static DefaultRsIds = {
        role: 11,
        menu: 12,
        menuButton: 13,
        organization: 14
    }
}
