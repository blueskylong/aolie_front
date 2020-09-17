import * as _ from 'underscore';

export class TableTools {

    static cellTreeselect(cell: HTMLElement, cfg: CellTreeSelectConfig) {
        TableTools.beforeCellEdit(cell);
        if (_.isUndefined(cfg.value) || _.isNull(cfg.value)) {
            cfg.value = '';
        } else {
            cfg.value = cfg.value.toString();
        }
        if (!cfg.valueSeparator) {
            cfg.valueSeparator = ',';
        }
        const position = TableTools.positionCellEditor(cell, false);
        const $celleditor = TableTools.createCellEditor()
            .addClass('box-shadow')
            .css(position)
            .append('<input type="text" class="search form-control" placeholder="搜索..."/><div class="editor"></div>')
            .one('stop', function () {
                $(this).remove();
            });
        // 搜索处理
        if (cfg.searchable) {
            $celleditor
                .find('>.search')
                .on($.support.leadingWhitespace ? 'input' : 'propertychange', function () {
                    $(this).siblings('.editor').jstree(true).search($(this).val() as any);//TODO confirm
                });
        } else {
            $celleditor
                .find('>.search').hide();
        }
        // jstree初始化
        const $jstree = $celleditor.find('>.editor');
        $jstree.css({
            'min-height': '10px',
            'min-width': $(cell).outerWidth() + 'px',
            'max-height': ($(window).height() - (position.top || position.bottom) - 10 - $celleditor
                .find('>.search').outerHeight(true)) + 'px',
            'max-width': ($(window).width() - (position.left || position.right) - 10) + 'px',
            'overflow': 'auto',
            'padding-bottom': '5px'
        });
        $jstree.on('ready.jstree', function () {
            $(this).on('changed.jstree', function (event, {selected}) {
                const value0 = selected.join(cfg.valueSeparator);
                if (!cfg.multiple) {
                    $(this).parent('.ngs-celleditor').remove();
                    if (value0 !== cfg.value) {
                        cfg.onStop(value0);
                    } else if (cfg.reversible) {
                        cfg.onStop(null);
                    }
                } else {
                    cfg.onStop(value0);
                }
            });
        });

        let dataFn = null;

        if (cfg.lazy) {
            $jstree.on('open_node.jstree', (e0, d) => {
                if (d.node.children[0] === d.node.id + '_children_placeholder') {
                    d.instance.load_node(d.node);
                }
            });
            const ids = [], parents = [];
            for (let o of cfg.options) {
                ids.push(o.id);
                if (o.parent) {
                    parents.push(o.parent)
                }
            }
            dataFn = (obj, callback) => {
                const result = [];
                for (let o of cfg.options) {
                    if (o.parent === obj.id ||
                        (obj.id === '#' && !_.contains(ids, o.parent))) {
                        let d: any = {
                            id: o.id,
                            text: o.text,
                            data: o
                        }
                        if (_.contains(parents, o.id)) {
                            d.children = [{
                                icon: false,
                                id: d.id + '_children_placeholder',
                                text: 'Loading ...'
                            }];
                        }
                        result.push(d);
                    }
                }
                callback(result);
            }
        } else {
            dataFn = function () {
                const data = [],
                    ids = [],
                    parents = [],
                    values = cfg.value ? (cfg.multiple ? cfg.value.split(cfg.valueSeparator) : [cfg.value]) : [];
                for (let o of cfg.options) {
                    ids.push(o.id);
                }
                for (let o of cfg.options) {
                    if (_.contains(ids, o.parent)) {
                        parents.push(o.parent);
                    }
                }
                for (let o of cfg.options) {
                    const item = {
                        id: o.id,
                        text: o.text,
                        parent: _.contains(ids, o.parent) ? o.parent : '#',
                        state: {
                            selected: _.contains(values, o.id.toString()),
                            disabled: cfg.onlyLeafSelect === true ? _.contains(parents, o.id) : false,
                            opened: true
                        },
                        data: o.data
                    };
                    data.push(item);
                }
                return data;
            }()
        }

        $jstree.jstree({
            'core': {
                'themes': {
                    'responsive': false
                },
                'data': dataFn,
            },
            'plugins': function () {
                const plugins = ['themes', 'types'];
                if (cfg.searchable) {
                    plugins.push('search');
                }
                if (cfg.multiple) {
                    plugins.push('checkbox');
                }
                if ($.support.leadingWhitespace) {
                    plugins.push('wholerow');
                }
                return plugins;
            }(),
            'types': {
                'default': {
                    'icon': false  // 关闭默认图标
                },
            },
            'checkbox': {
                'three_state': cfg.threeState === true // 级联选中子节点
            },
            'search': {
                'search_leaves_only': cfg.onlyLeafSelect === true, // 是否只能选择叶子节点
                'show_only_matches': true
            }
        });

        if (typeof cfg.onRender === 'function') {
            cfg.onRender($celleditor, cfg);
        }
    };

    static beforeCellEdit(cell: HTMLElement) {
        // 停止其它单元格编辑
        TableTools.stopCellEdit();
        $(cell).parents().each(function () {
            if (this.scrollHeight > this.clientHeight ||
                this.scrollWidth > this.clientWidth) {
                // 父级滚动时，影藏编辑器处理
                if (_.isUndefined($(this).data('stopcelledit'))) { // 使得scroll事件只绑定一次
                    $(this).on('scroll', function () {
                        if ($(this).data('stopcelledit')) {
                            TableTools.stopCellEdit();
                        } else {
                            $(this).data('stopcelledit', true);
                        }
                    }).data('stopcelledit', true);
                }

            }
        });
    };

    /**
     * 完成编辑
     */
    static stopCellEdit() {
        $('body>.celleditor').trigger('stop');
    };

    /**
     * 获取单元格编辑器定位
     * @param cell
     * @param covered
     * @returns {{top: null, bottom: null, left: null, right: null, display: string}}
     */
    static positionCellEditor(cell: HTMLElement, covered = true) {
        const postion = {
            'top': null,
            'bottom': null,
            'left': null,
            'right': null,
            'display': 'block',
            'z-index': 0
        };
        if ($(cell).offset().top > $(window).height() / 2) {
            postion.bottom = $(window).height() - $(cell).offset().top - (covered ? $(cell).outerHeight() : 0);
        } else {
            postion.top = $(cell).offset().top + (covered ? 0 : $(cell).outerHeight());
        }
        if ($(cell).offset().left > $(window).width() / 2) {
            postion.right = $(window).width() - $(cell).offset().left - $(cell).outerWidth();
        } else {
            postion.left = $(cell).offset().left;
        }
        let zIndex = parseInt($(cell).css('z-index'), 10) || 0;
        $(cell).parents().each(function () {
            zIndex = Math.max(zIndex, parseInt($(this).css('z-index'), 10) || 0);
        });
        postion['z-index'] = zIndex + 10000;
        return postion;
    };

    static createCellEditor() {
        return $('body')
            .append('<div class="ngs-celleditor" style="display: none;"></div>')
            .find('>.ngs-celleditor');
    };

}

export interface CellTreeSelectConfig extends CellConfig {
    options?: Array<any>; // 选择项
    multiple?: boolean; // 是否多选
    valueSeparator?: string; // 值分隔符
    reversible?: boolean; // 可反选的
    searchable?: boolean; // 是否可搜索
    onlyLeafSelect?: boolean; // 是否只能选择子节点
    threeState?: boolean; // jstree中checkbox有三种状态（级联选择子节点）
    lazy?: boolean;
}

interface CellConfig {
    value?: any;
    onStop?: Function;
    onRender?: Function;
}
