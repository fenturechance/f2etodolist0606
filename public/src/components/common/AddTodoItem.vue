<template>
    <div class="addTodoItemGroup">
        <header class="titleGroup" :class="$store.getters.titleCollectStyle(editData)">
            <div class="inputGroup">
                <label class="checkBox" :class="{ active : editData.done }">
                    <input type="checkbox" style="display:none" v-model="editData.done">
                    <i class="fa fa-check"></i>
                </label>
                <input class="typeBox" type="text" placeholder="Type Something Here..." v-model="editData.name">
            </div>
            <div class="controlGroup">
                <div class="star">
                    <label>
                        <i class="fas fa-star" v-if="editData.collected"></i>
                        <i class="far fa-star" v-else></i>
                        <input type="checkbox" style="display:none" v-model="editData.collected">
                    </label>
                </div>
                <div class="edit">
                    <i class="fa fa-pencil-alt" aria-hidden="true"></i>
                </div>
            </div>
        </header>
        <main>
            <ul>
                <li>
                    <div class="iconGroup">
                        <i class="far fa-calendar-alt"></i>
                    </div>
                    <div class="detailGroup">
                        <p class="title">Deadling</p>
                        <div class="inputGroup">
                            <input type="date" v-model="editData.date">
                            <input type="time" v-model="editData.time">
                        </div>
                    </div>
                </li>
                <li class="addFile">
                    <div class="iconGroup">
                        <i class="far fa-file"></i>
                    </div>
                    <div class="detailGroup">
                        <p class="title">File</p>
                        <label>
                            <i class="fas fa-plus"></i>
                            <input type="file" style="display:none">
                        </label>
                    </div>
                </li>
                <li class="comment">
                    <div class="iconGroup">
                        <i class="far fa-comment"></i>
                    </div>
                    <div class="detailGroup">
                        <p class="title">Comment</p>
                        <textarea cols="30" rows="10" placeholder="Type your memo here..." v-model="editData.comment"></textarea>
                    </div>
                </li>
            </ul>
        </main>
        <footer>
            <a class="action cancel" @click="cancelAdd">
                <div class="icon">
                    <i class="fas fa-times"></i>
                </div>
                <p>Cancel</p>
            </a>
            <a class="action addTask" @click="submit">
                <div class="icon">
                    <i class="fas fa-plus"></i>
                </div>
                <p>{{ actionText }}</p>
            </a>
        </footer>
    </div>
</template>
<script>
    export default {
        data() {
            return{
                sendData: {
                    create: {
                        url : '/create',
                        method : 'post',
                    },
                    edit :{
                        url : '/modify',
                        method : 'put'
                    }
                }
            }
        },
        props: ['nowCondition','editData','emptyEditData','taskList'],
        computed: {
            actionText() {
                return this.nowCondition == 'create' ? 'Add Task' : 'Save';
            }
        },
        methods: {
            cancelAdd() {
                this.$emit('update:nowCondition','show');
                this.$emit('update:editData',{ ...this.emptyEditdata });
            },
            submit() {
                let editData = { ...this.editData }
                let sendData = {
                    url : this.sendData[this.nowCondition].url,
                    method : this.sendData[this.nowCondition].method,
                    data : editData
                }
                let callbackFunction = () => {};
                switch (this.nowCondition) {
                    case 'create':
                        this.$store.state.loading = true;
                        callbackFunction = () => this.$emit('updateList');
                        break;
                    case 'edit':
                        let newTaskList = this.taskList.map(task => {
                            if(task.key == this.editData.key) {
                                task = { ...this.editData };
                            }
                            return task;
                        })
                        this.$emit('update:taskList',newTaskList);
                        this.$emit('changeFilter');
                        break;
                    default:
                        break;
                }
                axios(sendData).then(rs => {
                    callbackFunction();
                });
                this.cancelAdd();
            }
        }
    }
</script>
<style lang="scss">
    .addTodoItemGroup{
        background-color: #F2F2F2;
        border-radius: 5px;
        box-shadow: 0 0 5px rgba(0,0,0,0.2);
        .fa-pencil-alt{
            color : #4A90E2;
        }
        main{
            width: 80%;
            margin: auto;
            li{
                margin: 20px 0;
                display: flex;
                .iconGroup{
                    margin: 0 10px 0 0;
                }
                .detailGroup{
                    .title{
                        font-weight: bold;
                        margin: 0 0 5px 0;
                    }
                    ::-webkit-input-placeholder { /* Chrome/Opera/Safari */
                        color: #C8C8C8;
                    }
                    ::-moz-placeholder { /* Firefox 19+ */
                        color: #C8C8C8;
                    }
                    :-ms-input-placeholder { /* IE 10+ */
                        color: #C8C8C8;
                    }
                    :-moz-placeholder { /* Firefox 18- */
                        color: #C8C8C8;
                    }
                }
                &.addFile{
                    label{
                        background-color: #C8C8C8;
                        color: #fff;
                        width: 25px;
                        height: 25px;
                        display: inline-block;
                        text-align: center;
                        border-radius: 5px;
                        cursor: pointer;
                        i{
                            line-height: 25px;
                        }
                    }
                }
                &.comment{
                    .detailGroup{
                        flex: 1;
                    }
                    textarea{
                        width: 60%;
                        resize: none;
                    }
                }
            }
        }
        footer{
            display: flex;
            text-align: center;
            .action{
                flex: 1;
                display: flex;
                padding: 10px;
                justify-content: center;
                font-size: 20px;
                cursor: pointer;
                .icon{
                    margin: 0 10px;
                }
                &.cancel{
                    background-color: #fff;
                    color : #D0021B;
                }
                &.addTask{
                    background-color: #4A90E2;
                    color : #fff;
                }
            }
        }
    }
</style>
