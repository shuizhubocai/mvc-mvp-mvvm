/**
 * Author : 水煮菠菜 shuizhubocai@gmail.com
 */

/**
 * 数据模型，提供操作获取数据的接口，注册视图实例接口，以及通知视图更新接口
 * @param initCount 初始化count值
 */
let Model = function (initCount) {
    let count = initCount || 0;

    this.add = function () {
        count = count + 1;
    };

    this.sub = function () {
        count = count - 1;
    };

    this.get = function () {
        return count;
    };

    //以下使用观察者模式
    let views = [];

    this.register = function (v) {
        views.push(v);
    };

    this.notify = function () {
        views.forEach((item, index) => {
            item.render(this);
        });
    };
};

/**
 * 视图，提供模板，DOM元素，渲染数据到模板的接口，绑定事件
 * @param c 控制器实例
 */
let View = function (c) {
    //模板
    let tmpl = `<h1>MVC</h1><div id="count"></div><button id="add">增加 add</button> <button id="sub">减少 sub</button>`;

    //渲染方法
    this.render = function (model) {
        this.$count.innerHTML = model.get();
    };

    this.init = function () {
        document.body.innerHTML = tmpl;

        //保存元素DOM
        this.$count = document.getElementById('count');
        this.$add = document.getElementById('add');
        this.$sub = document.getElementById('sub');

        //绑定事件使用策略模式
        this.$add.addEventListener('click', c.add.bind(c), false);
        this.$sub.addEventListener('click', c.sub.bind(c), false);
    };

    this.init();
};

/**
 * 控制器，初始化数据模型和视图，提供事件的响应方法
 * @constructor
 */
let Control = function () {

    this.init = function () {
        this.model = new Model(0);
        this.view = new View(this);

        //初始化时通知视图更新
        this.model.register(this.view);
        this.model.notify();
    };

    //调用模型的添加方法修改数据后通知视图更新
    this.add = function () {
        this.model.add(1);
        this.model.notify();
    };

    //调用模型的减少方法修改数据后通知视图更新
    this.sub = function () {
        this.model.sub(1);
        this.model.notify();
    };
};

//最先初始化控制器
let control = new Control();
control.init();