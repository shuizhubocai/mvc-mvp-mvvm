/**
 * Author : 水煮菠菜 shuizhubocai@gmail.com
 */

/**
 * 数据模型，提供操作获取数据的接口
 * @param initCount 初始化count
 */
const Model = function (initCount) {
    let count = initCount || 0;

    this.add = function () {
        count += 1;
    };

    this.sub = function () {
        count -= 1;
    };

    this.get = function () {
        return count;
    };
};

/**
 * 视图，提供模板，DOM元素，渲染数据到模板的接口，初始化Presenter，绑定事件
 */
const View = function () {
    let tmpl = `<h1>MVP</h1><div id="count"></div><button id="add">增加 add</button> <button id="sub">减少 sub</button>`;

    this.init = function () {
        document.body.innerHTML = tmpl;

        this.$count = document.getElementById('count');
        this.$add = document.getElementById('add');
        this.$sub = document.getElementById('sub');

        //初始化Presenter
        let presenter = new Presenter(this);

        this.$add.addEventListener('click', presenter.add.bind(presenter), false);
        this.$sub.addEventListener('click', presenter.sub.bind(presenter), false);
    };

    //渲染
    this.render = function (data) {
        this.$count.innerHTML = data.get();
    };

};

/**
 * 在这里可调用数据模型和视图接口，让数据模型和视图解耦
 * @param view，视图实例
 */
const Presenter = function (view) {
    //初始化数据模型
    this.init = function () {
        this.model = new Model(0);
        this.view = view;
        this.view.render(this.model);
    };

    this.add = function () {
        this.model.add();
        this.view.render(this.model);
    };

    this.sub = function () {
        this.model.sub();
        this.view.render(this.model);
    };

    this.init();
};

//最先初始化视图
let view = new View();
view.init();