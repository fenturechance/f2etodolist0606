<template>
  <div id="app">
        <div class="navigation">
            <div class="router">
                <a v-for="tab in tabList"  :class="tabStyle(tab)" @click="setNowtab(tab)">
                    <span>{{ tab.name }}</span>
                </a>
            </div>
        </div>
        <div class="mainView">
            <div class="container">
                <MyTasks
                    :now-tab="nowTab"
                ></MyTasks>
            </div>
        </div>
        <transition name="loadingFade">
            <div class="loadingMask" :class="{ loading : $store.state.loading }" v-if="$store.state.loading">
                <div class="loadingIcon">
                    <i class="fas fa-spinner"></i>
                </div>
            </div>
        </transition>
  </div>
</template>

<script>
import MyTasks from './components/MyTasks'
export default {
  name: 'app',
  data () {
    return {
        nowTab : 'MyTasks',
        tabList : [
            {
                key : 'MyTasks',
                name : 'My Tasks'
            },
            {
                key : 'InProgress',
                name : 'In Progress'
            },
            {
                key : 'Completed',
                name : 'Completed'
            }
        ],
    }
  },
  components: {
      MyTasks
  },
  methods: {
      tabStyle(tab){
          return this.nowTab == tab.key ? 'active' : undefined;
      },
      setNowtab(tab) {
          this.nowTab = tab.key;
      },
  }
}
</script>

<style lang="scss">
    %maxContainer{
        max-width: 620px;
        margin: auto;
    }
    *{
        margin: 0;
        padding: 0;
        list-style: none;
    }
    input , textarea{
        border : none;
        padding: 5px 10px;
        border-radius: 5px;
    }
    input:focus{
        outline: none;
    }
    .loadingFade-enter-active{
        opacity: 1;
        transition: .5s;
    }
    .loadingFade-leave-active{
        opacity: 0;
        transition: .5s;
    }
    .loadingMask{
        width: 100vw;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        &.loading{
            background-color: rgba(255,255,255,0.9);
            text-align: center;
            .loadingIcon{
                @keyframes rotate {
                    100%{ transform: rotate(360deg) }
                }
                font-size: 30px;
                line-height: 100vh;
                display: inline-block;
                animation: rotate 1s linear infinite;
            }
        }
    }
    #app{
        font-family: 'Roboto Medium';
        min-height: 100vh;
        background-color: #E1E1E1;
        a{
            text-decoration: none;
        }
        .navigation{
            background: #4A90E2;
            .router{
                @extend %maxContainer;
                display: flex;
                a{
                    padding: 20px 0;
                    color: #fff;
                    text-align: center;
                    flex: 1;
                    font-size: 20px;
                    cursor: pointer;
                    &.active{
                        border-bottom: 5px solid #00408B ;
                    }
                }
            }
        }
        .mainView{
            padding: 10px 0;
            .container{
                @extend %maxContainer;
            }
        }
    }
</style>
