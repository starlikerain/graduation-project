import Vue from 'vue'
import AV from 'leancloud-storage'

let APP_ID = 'x1IPVDJJYqqUrCsHH0pM4wgD-gzGzoHsz';
let APP_KEY = 'eel2mVyI3WisthawOPPGeFvc';
AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});

// check Leanote init success or not
// let TestObject = AV.Object.extend('TestObject');
// let testObject = new TestObject();
// testObject.save({
//     words: 'Hello World!'
// }).then(function(object) {
//     alert('LeanCloud Rocks!');
// })


let app = new Vue({
  el: '#app',
  data: {
    newTodo: '',
    todoList: [],
    actionType: 'signUp',
    currentUser: null,
    formData: {
      username: '',
      password: ''
    }
  },
  watch: {
    todoList: {
      handler: function () {
        this.saveOrUpdateTodos()
      },
      // 监听对象内部值得变化，数组不需要此参数
      deep: true
    }
  },
  methods: {
    addTodo: function () {
      if (this.newTodo == '') {
        return false;
      }
      // 创建日期
      let now_date = new Date();

      this.todoList.push({
        title: this.newTodo,
        createAt: this.getTime(now_date),
        done: false,
        identyfy: this.currentUser.username
      });
      this.newTodo = '';
      this.saveOrUpdateTodos();
    },
    removeTodo: function (todo) {
      let index = this.todoList.indexOf(todo);
      this.todoList.splice(index, 1);
      this.saveOrUpdateTodos();
    },
    getTime: function (t) {
      function setT(t) {
        return t < 10 ? '0' + t : t;
      }

      t = t.length == 10 ? t + '000' : t;
      let time = new Date(Number(t));
      let year   = time.getFullYear(),
          month  = time.getMonth() + 1,
          date   = time.getDate(),
          Hour   = time.getHours(),
          Second = time.getSeconds(),
          Minu   = time.getMinutes();
      return year + '-' + setT(month) + '-' + setT(date) + ' ' + setT(Hour) + ':' + setT(Minu) + ':' + setT(Second);
    },
    getCurrentUser: function () {
      // LeanCloud 文档说 AV.User.current() 可以获取当前登录的用户
      let current = AV.User.current();

      if (current) {
        let {id, createdAt, attributes: {username}} = AV.User.current();
        return {id, username, createdAt}
      } else {
        return null
      }
    },
    signUp: function () {
      let user = new AV.User();
      user.setUsername(this.formData.username);
      user.setPassword(this.formData.password);
      user.signUp().then((loginedUser) => {
        this.currentUser = this.getCurrentUser();
        console.log('signUp success')
      }, (error) => {
        alert('注册失败')
      });
    },
    login: function () {
      AV.User.logIn(this.formData.username, this.formData.password).then((loginedUser) => {
        this.currentUser = this.getCurrentUser()
        this.fetchTodos();
        // window.location.href = window.location.href;
      }, function (error) {
        alert('登录失败')
      });

    },
    logout: function () {
      AV.User.logOut();
      this.currentUser = null;
      window.location.reload()
    },
    saveTodos: function () {
      /** @attention AllTodos */
      let dataString = JSON.stringify(this.todoList);
      let AVTodos = AV.Object.extend('AllTodos');
      let avTodos = new AVTodos();

      let acl = new AV.ACL();
      acl.setReadAccess(AV.User.current(), true);
      acl.setWriteAccess(AV.User.current(), true);

      avTodos.set('content', dataString);
      avTodos.setACL(acl) // 设置访问控制
      avTodos.save().then((todo) => {
        this.todoList.id = todo.id  // 一定要记得把 id 挂到 this.todoList 上，否则下次就不会调用 updateTodos 了
        console.log('保存成功');
      }, function (error) {
        alert('保存失败');
      });

    },
    updateTodos: function () {
      // 想要知道如何更新对象，先看文档 https://leancloud.cn/docs/leanstorage_guide-js.html#更新对象
      let dataString = JSON.stringify(this.todoList) // JSON 在序列化这个有 id 的数组的时候，会得出怎样的结果？
      let avTodos = AV.Object.createWithoutData('AllTodos', this.todoList.id)
      avTodos.set('content', dataString)
      avTodos.save().then(() => {
        console.log('更新成功')
      })
    },
    saveOrUpdateTodos: function () {
      if (this.todoList.id) {
        this.updateTodos()
      } else {
        this.saveTodos()
      }
    },
    fetchTodos: function () {
      if (this.currentUser) {
        var query = new AV.Query('AllTodos');
        query.find()
           .then((todos) => {
             let avAllTodos = todos[0] // 因为理论上 AllTodos 只有一个，所以我们取结果的第一项
             let id = avAllTodos.id
             this.todoList = JSON.parse(avAllTodos.attributes.content) // 为什么有个 attributes？因为我从控制台看到的
             this.todoList.id = id // 为什么给 todoList 这个数组设置 id？因为数组也是对象啊
           }, function (error) {
             console.error(error)
           })
      }
    }
  },
  created: function () {
    this.currentUser = this.getCurrentUser();
    this.fetchTodos()// 将原来的一坨代码取一个名字叫做 fetchTodos
  }
});