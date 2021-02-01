/**
 * Author : 水煮菠菜 shuizhubocai@gmail.com
 */

/**
 * 数据模型
 * @param data 初始化的data数据
 */
let Model = function (data) {
    this.data = data || {};
};

/**
 * 视图，提供模板，DOM元素，渲染，绑定事件
 * @param vm ViewModel实例
 */
let View = function (vm) {

    //模板，@change属性值是响应input事件的方法名，@click属性值是响应click事件的方法名
    let tmpl = `<h1>MVVM</h1><input type="number" id="input-count" @change="inputChange"/><div id="count"></div><button id="add" @click="add">增加 add</button> <button id="sub" @click="sub">减少 sub</button>`;

    //暂时只支持click和input事件
    let keyVal = {
        'input': ['@change', 'oninput'],
        'button': ['@click', 'onclick']
    };

    this.init = function () {
        document.body.innerHTML = tmpl;

        this.$count = document.getElementById('count');
        this.$inputCount = document.getElementById('input-count');
        this.$add = document.getElementById('add');
        this.$sub = document.getElementById('sub');

        this.initEvent();

        //测试手动绑定
        /*this.$add.addEventListener('click', e => vm.methods.add.bind(vm)(e), false);
        this.$sub.addEventListener('click', e => vm.methods.sub.bind(vm)(e), false);
        this.$inputCount.addEventListener('input', e => vm.methods.inputChange.bind(vm)(e), false);*/
    };

    //完成事件的绑定
    this.initEvent = function () {
        let $all = document.body.getElementsByTagName('*');
        Array.prototype.slice.call($all).forEach(($item, index) => {
            let nodeName = $item.nodeName.toLowerCase(), attrName, eventName, handleName;

            if (!keyVal[nodeName]) return;
            attrName = keyVal[nodeName][0];
            eventName = keyVal[nodeName][1];
            handleName = $item.getAttribute(attrName);

            //绑定方法，并改变this指向
            $item[eventName] = e => vm.methods[handleName].bind(vm)(e);
        });
    };

    //渲染
    this.render = function () {
        this.$count.innerHTML = vm.data.count;
        this.$inputCount.value = vm.data.count;
    };

    this.init();
};

/**
 * 视图模型，完成对数据到视图，视图到数据的双向绑定
 * @param params 初始化参数
 * @param params.data 数据模型
 * @param params.methods 响应事件的方法
 */
let ViewModel = function (params) {
    this.init = function () {
        this.data = new Model(params.data).data;
        this.methods = params.methods;
        this.view = new View(this);
        this.observerData(this.data);
        this.view.render();
    };

    /**
     * 对数据模型的get和set进行劫持
     * @param obj 劫持的对象
     * @param key 劫持的属性
     * @param val 劫持的属性值
     */
    this.observers = function (obj, key, val) {
        let _this = this;
        Object.defineProperty(obj, key, {
            configurable: true, //不可配置
            enumerable: true,  //可枚举
            get: function () { //获取
                return val;
            },
            set: function (newVal) { //设置值
                //如果新值是字符串数字，则转换为数字类型
                newVal = isNaN(Number(newVal)) ? newVal : Number(newVal);
                if (val == newVal) return;
                val = newVal;
                //修改值后重新渲染
                setTimeout(_this.view.render.bind(_this.view), 0);
            }
        });
    };

    this.observerData = function () {
        Object.keys(this.data).forEach((key, val) => {
            this.observers(this.data, key, val);
        });
    };
};

//初始化
let vm = new ViewModel({
    data: {
        count: 0
    },
    methods: {
        //javascript计算边界提示
        boundaryTips: function (data) {
            (data >= Number.MAX_SAFE_INTEGER || data <= Number.MIN_SAFE_INTEGER) && alert('未处理大数值计算精度丢失问题，计算值会不准确！');
        },

        add: function () {
            this.methods.boundaryTips(this.data.count);
            this.data.count = this.data.count + 1;
        },

        sub: function () {
            this.methods.boundaryTips(this.data.count);
            this.data.count = this.data.count - 1;
        },

        inputChange: function (e) {
            this.data.count = e.target.value;
        }
    }
});
vm.init();