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
    }
}
