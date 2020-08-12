<template>
<div class="search">
    <div class="top">
        <div class="searchGroup">
            <img class="sousuo" src="../../static/img/search _icon.png" alt="">
            <form class="form" action="javascript:return true;">
                <input
                    type="text"
                    class="searchInput"
                    v-model="keyword"
                    placeholder="搜索展品名称..."
                    @keyup.13="search(keyword)"
                />
            </form>
            <span class="clear" @click.stop="clearInput"></span>
        </div>
        <button class="button" @click="cancel">取消</button>
    </div>
    <div class="bottom">
        <div class="keyword" v-if="keywords.length">
            <div class="title">
                <span>最近搜索</span>
                <div class="delete" @click="delKeyword">
                    <img src="../../static/img/lajixiang.png" alt="">    
                </div>
            </div>
            <div class="words">
                <span class="word"
                    @click="search(word)" 
                    v-for="(word, index) in keywords" 
                    :key="index">
                    {{word}}
                </span>
            </div>
        </div>
        <div class="list">
            <div class="none" v-show="show&&!list.length">
                没有找到相关内容
            </div>
            <div class="item" v-for="(i, index) in list" :key="index" @click="go(i)">
                <img class="image" :src="thumbsimg(i.exhibit_list_img,200,200,33)" alt="">
                <div class="right">
                    <p class="title" v-html="i.exhibit_name"></p>
                    <p class="content">{{i.content}}</p>
                </div>
                <div class="go">

                </div>
            </div>
        </div>
    </div>
    
</div>
</template>

<script>
  import {toThumbsimg} from '../assets/js/toThumbsimg';
    import { exhibitSearch } from '../http/interface'
    export default {
        components: {
        },
        inject: ['app'],
        data() {
            return {
                keyword: '',
                list: [],
                keywords: [],
                show: false
            }
        },
        methods: {
            async search(val) {
                let vm = this;
                try {
                    vm.app.showLoading()
                    if(vm.keyword!=val) {
                        vm.keyword = val
                    }
                    let data = {
                        keyword: val
                    }
                    const res = await exhibitSearch(data)
                    console.log(res)
                    if(val&&vm.keywords.indexOf(val)===-1) {
                        vm.keywords.push(val)
                        if(vm.keywords.length>=11) {
                            let i = vm.keywords.length-10
                            for(let j=i;j--;j>=0){
                                vm.keywords.shift()
                            }
                        }
                        window.localStorage.setItem('keywords', JSON.stringify(vm.keywords))
                    }
                    if(res.data) {
                        vm.list = res.data
                    }
                    if(res.data.length==0) {
                        vm.show = true
                    }
                    vm.app.hideLoading()
                } catch (error) {
                    vm.app.hideLoading()
                }
                // vm.axios({
                //     method: "get",
                //     url: "/api/exhibit_search_sign",
                //     params: {
                //         keyword: val,
                //         // exhibition: 0//展厅id
                //     }
                // }).then((res) => {
                //     /**
                //      * 最多允许储存十条搜索记录，大于十条将第一条记录删除，记录重复不做储存
                //      */
                    // if(val&&vm.keywords.indexOf(val)===-1) {
                    //     vm.keywords.push(val)
                    //     if(vm.keywords.length>=11) {
                    //         let i = vm.keywords.length-10
                    //         for(let j=i;j--;j>=0){
                    //             vm.keywords.shift()
                    //         }
                    //     }
                    //     window.localStorage.setItem('keywords', JSON.stringify(vm.keywords))
                    // }
                    // if(res.data.data) {
                    //     vm.list = res.data.data
                    // }
                    // if(res.data.data.length==0) {
                    //     vm.show = true
                    // }
                // }).catch((error) => {
                //     console.log(error);
                // });
            },
            clearInput() {
                this.keyword = ''
            },
            cancel() {
                this.$router.go(-1)
            },
            /*生成缩略图链接*/
            thumbsimg: function (path, width, height, type) {
                return toThumbsimg(path, width, height, type);
            },
            go(val) {
                this.$router.push({
                    path: '/exhibit/detail/'+val.exhibit_id
                })
            },
            delKeyword() {
                this.keywords = []
                window.localStorage.removeItem('keywords')
            }
        },
        mounted() {
            let keywords = window.localStorage.getItem('keywords')||'[]'
            this.keywords = JSON.parse(keywords)
        }
    }
</script>

<style lang="scss" scoped>
    .search{
        height: 100vh;
        display: flex;
        flex-direction: column;
        background: #ffffff;
        .top{
            width: 100%;
            height: 104px;
            background: #ededed;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            padding: 20px;
            .searchGroup{
                width: 100%;
                height: 100%;
                // border: 1px solid #bfbfbf;
                border-radius: 6px;
                background: #ffffff;
                display: flex;
                align-items: center;
                position: relative;
                display: flex;
                padding-right: 50px;
                .sousuo{
                    width: 21px;
                    height: 21px;
                    margin-left: 27px;
                    margin-right: 7px;
                    flex-shrink: 0;
                }
                .form{
                    flex: 1;
                    height: 100%;
                    display: flex;
                    .searchInput{
                        border: none;
                        outline: none;
                        font-size: 24px;
                        flex: 1;
                        width: 100%;
                        height: 100%;
                    }
                }
                .clear{
                    width: 26px;
                    height: 26px;
                    background-image: url('../../static/img/clear.png');
                    position: absolute;
                    right: 20px;
                    background-size: 100% 100%;
                    background-repeat: no-repeat;
                }
            }
            .button{
                width: 100px;
                height: 100%;
                border: none;
                background: transparent;
                font-size: 28px;
                color: #999999;
                outline: none;
            }
        }
        .bottom{
            overflow-y: auto;
        }
        .keyword{
            .title{
                height: 84px;
                padding: 0 20px;
                border-bottom: 1px solid #E0E0E0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                span{
                    font-size: 26px;
                    color: #333333;
                    border-left: 4px solid #A33336;
                    padding-left: 14px;
                }
                .delete{
                    height: 100%;
                    width: 60px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    img{
                        width: 24px;
                        height: 30px;
                    }
                }
            }
            .words{
                padding: 20px;
                .word{
                    display: inline-block;
                    font-size: 28px;
                    color: #4A4A4A;
                    background: #EDEDED;
                    padding: 15px 23px;
                    margin-right: 24px;
                    margin-bottom: 24px;
                    border-radius: 5px;
                    // line-height: 
                }
            }
        }
        .list{
            width: 100%;
            flex: 1;
            padding: 30px 22px;
            .none{
                width: 100%;
                height: 100%;
                font-size: 12px;
                background-image: url(../../static/img/searchzero.png);
                background-repeat: no-repeat;
                background-size: 304px auto;
                background-position: center 295px;
                padding-top: 502px;
                text-align: center;
                color: #bebebe;
                font-size: 28px;
            }
            .item{
                display: flex;
                align-items: center;
                border-bottom: 1px solid #e0e0e0;
                width: 100%;
                box-shadow:0px 5px 20px 0px rgba(5,57,135,0.1);
                border-radius: 10px;
                height:200px;
                padding: 30px;
                margin: 0 auto;
                margin-bottom: 20px;
                display: flex;
                justify-content: space-between;
                .image{
                    width: 140px;
                    height: 140px;
                    margin-right: 36px;
                    flex-shrink: 0;
                    border-radius: 8px;
                    border: 3px solid #f6cccd;
                }
                .right{
                    // width: 353px;
                    // height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    flex: 1;
                    .title{
                        font-size: 30px;
                        font-weight: 600;
                        color: #323232;

                        overflow:hidden;
                        text-overflow:ellipsis;
                        white-space:nowrap;
                        /deep/ .tag-selected{
                            font-size: 30px;
                            color: #A33336;
                        }
                    }
                    .content{
                        font-size: 24px;
                        color: #666666;

                        overflow : hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                    }
                }
                .go{
                    width: 118px;
                    height: 100%;
                    background-image: url('../../static/img/bg21.png');
                    background-size: 21px 38px;
                    background-repeat: no-repeat;
                    background-position: 97px center;
                    // background-size: 100% 100%;
                    // margin-left: 3.23rem;
                    flex-shrink: 0;
                }
            }
        }
    }
</style>