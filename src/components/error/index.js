import ErrorComponent from './Error.vue' // 引入先前写好的vue

const Error = {}

// 注册Error
Error.install = function(Vue) {
    // 生成一个Vue的子类
    const ErrorConstructor = Vue.extend(ErrorComponent)

    // 生成一个该子类的实例
    const instance = new ErrorConstructor()

    // 将这个实例挂载在我创建的div上
    // 并将此div加入全局挂载点内部
    instance.$mount(document.createElement('div'))
    document.body.appendChild(instance.$el)

    // 通过Vue的原型注册一个方法
    // 让所有实例共享这个方法 <br>
    Vue.prototype.$Error = (msg, goBack, reload) => {
        instance.msg = msg
        instance.showError = true

        // instance.goBack = goBack
        // instance.reload = reload
    }
}

export default Error