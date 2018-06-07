<template>
    <div>
        <div class="addTaskButton" v-if="nowCondition == 'show'" @click="addTask">
            <i class="fas fa-plus plusIcon"></i>
            <p>Add Task</p>
        </div>
        <AddTodoItem
            v-show="['edit','create'].includes(nowCondition)"
            :now-condition.sync="nowCondition"
            :edit-data.sync="editData"
            :empty-edit-data="emptyEditData"
            :task-list.sync="taskList"
            @updateList="fetchTaskList"
            @changeFilter="changeFilter"
        ></AddTodoItem>
        <div class="taskList">
            <draggable v-model="filterTaskList" element="ul">
                <li v-for="task in filterTaskList" class="titleGroup"
                    :class="$store.getters.titleCollectStyle(task)"
                    v-if="task.key != editData.key">
                    <div class="inputGroup">
                        <label class="checkBox" :class="{ active : task.done }" @change="toggleFun(task , 'done')" >
                            <input type="checkbox" style="display:none">
                            <i class="fa fa-check"></i>
                        </label>
                        <div class="typeGroup">
                            <p class="typeBox" :class="{ done : task.done }">{{ task.name }}</p>
                            <div class="infoGroup">
                                <div class="info dateGroup">
                                    <i class="far fa-calendar-alt"></i>
                                    <span>{{ task.date }}</span>
                                </div>
                                <div class="info file">
                                    <i class="far fa-file"></i>
                                </div>
                                <div class="info comment" v-if="task.comment">
                                    <i class="far fa-comment"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="controlGroup">
                        <div class="star" @click="toggleFun(task , 'collected')">
                            <i class="fas fa-star" v-if="task.collected"></i>
                            <i class="far fa-star" v-else></i>
                        </div>
                        <div class="edit" @click="editFun(task)">
                            <i class="fa fa-pencil-alt" aria-hidden="true"></i>
                        </div>
                    </div>
                </li>
            </draggable>
        </div>
        <div class="leftTask">
            <p>{{ leftWord }}</p>
        </div>
    </div>
</template>
<script>
    import _ from 'lodash'
    import AddTodoItem from './common/AddTodoItem';
    export default {
        data() {
            return{
                taskList: [],
                filterTaskList : [],
                nowCondition: 'show',
                editData: {},
                emptyEditData: {
                    name : "",
                    done : false,
                    collected : false,
                    time : "",
                    date : '',
                    file : "",
                    comment : "",
                    key : ''
                },
            }
        },
        props: ['nowTab'],
        watch: {
            nowTab() {
                this.changeFilter();
            }
        },
        computed: {
            leftWord() {
                let completed = 0;
                let progress = 0;
                for (const key in this.taskList) {
                    let task = this.taskList[key];
                    if(task.done){
                        completed ++;
                    }else{
                        progress ++;
                    }
                }
                switch (this.nowTab) {
                    case 'MyTasks':
                        return progress + ' tasks lefted'
                        break;
                    case 'InProgress':
                        return progress + ' tasks lefted'
                        break;
                    case 'Completed':
                        return completed + ' tasks completed'
                        break;
                    default:
                        break;
                }
            },
        },
        components: {
            AddTodoItem
        },
        created() {
            this.fetchTaskList();
            // this.testFuntion();
        },
        methods: {
            fetchTaskList() {
                axios.get('/show').then( rs => {
                    let arr = [];
                    for (const key in rs.data) {
                        let task = rs.data[key];
                        task.key = key;
                        arr.push(task);
                    }
                    this.taskList = arr;
                    this.filterTaskList = arr;
                    this.$store.state.loading = false;
                    this.changeFilter();
                });
            },
            addTask() {
                this.nowCondition = 'create';
                this.editData = { ...this.emptyEditData };
            },
            editFun(task) {
                this.nowCondition = 'edit';
                this.editData = { ...task };
            },
            toggleFun: _.debounce(function(task , change) {
                let sendData = { key : task.key };
                this.taskList = this.taskList.map(otask => {
                    if(otask.key == task.key){
                        otask[change] = !otask[change];
                        sendData[change] = otask[change];
                    }
                    return otask;
                })
                axios.put('/modify',sendData).then(rs => {
                    // this.fetchTaskList();
                });
                this.changeFilter();
            },100),
            changeFilter() {
                let newList = {};
                switch (this.nowTab) {
                    case 'MyTasks':
                        this.filterTaskList = this.taskList;
                        break;
                    case 'InProgress':
                        this.filterTaskList = this.taskList.filter(task => !task.done);
                        break;
                    case 'Completed':
                        this.filterTaskList = this.taskList.filter(task => task.done);
                        break;
                    default:
                        break;
                }
            },
            testFuntion() {
                let list = {
                    thing1 : {
                        name : 'task1',
                        done : true,
                        collected : true,
                        date : '5/4',
                        file : '5566.txt',
                        comment : ''
                    },
                    thing2 : {
                        name : 'task2',
                        done : false,
                        collected : false,
                        date : '5/4',
                        file : '5566.txt',
                        comment : '555666777'
                    },
                    thing3 : {
                        name : 'task3',
                        done : true,
                        collected : true,
                        date : '5/4',
                        file : '5566.txt',
                        comment : '555666777'
                    },
                };
                let arr = [];
                for (const key in list) {
                    let task = list[key];
                    task.key = key;
                    arr.push(task);
                }
                this.taskList = arr;
                this.filterTaskList = arr;
                this.$store.state.loading = false;
            }
        }
    }
</script>
<style lang="scss">
    .addTaskButton{
        display: flex;
        color : #C8C8C8;
        font-size: 20px;
        background-color: #fff;
        padding: 10px 20px;
        border: 2px solid #C8C8C8;
        border-radius: 5px;
        cursor: pointer;
        align-items: center;
        p{
            margin: 0 10px;
        }
    }
    .titleGroup{
        border-bottom: 1px solid #C8C8C8;
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #F2F2F2;
        &.collected{
            background-color: #FFF2DC;
        }
        .inputGroup{
            flex: 10;
            display: flex;
            align-items: center;
            .checkBox{
                width: 20px;
                height: 20px;
                background-color: #fff;
                border-radius: 2px;
                display: inline-block;
                text-align: center;
                cursor: pointer;
                .fa-check{
                    opacity: 0;
                }
                &.active{
                    background-color: #4A90E2;
                    color: #fff;
                    .fa-check{
                        opacity: 1;
                    }
                }
            }
            ::-webkit-input-placeholder { /* Chrome/Opera/Safari */
                color: #000;
            }
            ::-moz-placeholder { /* Firefox 19+ */
                color: #000;
            }
            :-ms-input-placeholder { /* IE 10+ */
                color: #000;
            }
            :-moz-placeholder { /* Firefox 18- */
                color: #000;
            }
            .typeBox{
                background-color: transparent;
                font-size: 20px;
                font-weight: bold;
                margin: 0 10px;
            }
        }
        .controlGroup{
            flex: 1;
            display: flex;
            justify-content: space-around;
            .star{
                .fa-star{
                    cursor: pointer;
                }
            }
            .far.fa-star{
                color: #000;
            }
            .fas.fa-star{
                color: #F5A623;
            }
        }
    }
    .taskList{
        margin: 20px 0;
        .titleGroup{
            margin: 0 0 10px 0;
            align-items: flex-start;
            .inputGroup{
                align-items: flex-start;
                .checkBox{
                    margin: 5px 0 0 0;
                }
                .typeGroup{
                    margin: 0 10px;
                    flex: 1;
                    .typeBox{
                        margin: 0 0 10px 0;
                        &.done{
                            text-decoration: line-through;
                            color: #9B9B9B;
                        }
                    }
                    .infoGroup{
                        flex: 1;
                        display: flex;
                        .info{
                            margin: 0 10px 0 0;
                            color: #757575;
                        }
                    }
                }
            }
            .controlGroup{
                .edit{
                    cursor: pointer;
                    &:hover{
                        color: #4a90e2;
                    }
                }
            }
        }
    }
    .leftTask{
        color : #C8C8C8;
        font-size: 20px;
        padding: 0 20px;
    }
</style>
