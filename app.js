import bar from './bar';


bar();

import Vue from 'vue'

let app = new Vue({
    el: '#app',
    data: {
        newTodo: '',
        todoList: [],
        actionType: 'signUp',
        bool: true
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
                done: false
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
        }
    },
    computed: {
        toggle_login_register: function() {
            switch (this.actionType) {
                case 'signUp':
                    this.bool = true
                    break;
                case 'login':
                    this.bool = false
                    break;
            }
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

    }
});