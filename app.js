import Vue from 'vue'
import AV from 'leancloud-storage'

var APP_ID = 'x1IPVDJJYqqUrCsHH0pM4wgD-gzGzoHsz';
var APP_KEY = 'eel2mVyI3WisthawOPPGeFvc';
AV.init({
    appId: APP_ID,
    appKey: APP_KEY
});

// check Leanote init success or not
// var TestObject = AV.Object.extend('TestObject');
// var testObject = new TestObject();
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
    methods: {
        addTodo: function() {
            if (this.newTodo == '') {
                return false;
            }

            let now_date = new Date();

            this.todoList.push({
                title: this.newTodo,
                createAt: this.getTime(now_date),
                done: false,
                identyfy: this.currentUser.username
            });
            this.newTodo = '';
        },
        removeTodo: function(todo) {
            let index = this.todoList.indexOf(todo);
            this.todoList.splice(index, 1);
        },
        getTime: function(t) {
            function setT(t) {
                return t < 10 ? '0' + t : t;
            }
            t = t.length == 10 ? t + '000' : t;
            let time = new Date(Number(t));
            let year = time.getFullYear(),
                month = time.getMonth() + 1,
                date = time.getDate(),
                Hour = time.getHours(),
                Second = time.getSeconds(),
                Minu = time.getMinutes();
            return year + '-' + setT(month) + '-' + setT(date) + ' ' + setT(Hour) + ':' + setT(Minu) + ':' + setT(Second);
        },
        getCurrentUser: function() {
            // LeanCloud 文档说 AV.User.current() 可以获取当前登录的用户
            let current = AV.User.current()
            if (current) {
                let { id, createdAt, attributes: { username } } = AV.User.current()
                return { id, username, createdAt }
            } else {
                return null
            }
        },
        signUp: function() {
            let user = new AV.User()
            user.setUsername(this.formData.username);
            user.setPassword(this.formData.password);
            user.signUp().then((loginedUser) => {
                this.currentUser = this.getCurrentUser()
                console.log('signUp success')
            }, (error) => {
                alert('注册失败')
            });
        },
        login: function() {
            AV.User.logIn(this.formData.username, this.formData.password).then((loginedUser) => {
                this.currentUser = this.getCurrentUser()
            }, function(error) {
                alert('登录失败')
            });

        },
        logout: function() {
            AV.User.logOut()
            this.currentUser = null
            window.location.reload()
        }
    },
    created: function() {
        window.onbeforeunload = () => {
            // input 框
            let this_newTodo = JSON.stringify(this.newTodo);
            window.localStorage.setItem('newTodo', this_newTodo);
            // todoList 列表
            let dataString = JSON.stringify(this.todoList);
            window.localStorage.setItem('myTodos', dataString)
        };

        if (window.localStorage.getItem('newTodo') != '') {
            let newTodo_str = window.localStorage.getItem('newTodo');
            let newTodo_parse = JSON.parse(newTodo_str);
            this.newTodo = newTodo_parse || '';

            window.localStorage.setItem('newTodo', '');
        }

        let oldDataString = window.localStorage.getItem('myTodos');
        let oldData = JSON.parse(oldDataString);
        this.todoList = oldData || [];

        this.currentUser = this.getCurrentUser()
    }
});