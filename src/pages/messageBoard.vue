<template>
  <div class="messageBoard">
    <!-- <div class="item">
            <div class="lable">姓名</div>
            <div class="inp">
            <input type="text">
            </div>
        </div>
        <div class="item">
            <div class="lable"><span class="tip">*</span>联系电话</div>
            <div class="inp">
            <input type="text">
            </div>
    </div>-->

    <div class="item">
      <div class="lable">姓名</div>
      <div class="inp">
        <input type="text" placeholder="我们怎么称呼您..." v-model="form.name" />
      </div>
    </div>
    <div class="item">
      <div class="lable">
        <span class="tip">*</span>
        联系电话
      </div>
      <div class="inp">
        <input type="text" placeholder="我们怎样联系到您..." v-model="form.tel" />
      </div>
    </div>
    <div class="textArea">
      <textarea class="textarea" v-model="form.text" maxlength="200" placeholder="在此输入您要反馈的信息..."></textarea>
      <div class="num">{{form.text.length}}/{{maxLength}}</div>
    </div>
    <p class="article" v-html="msg">
      <!-- 赤峰市博物馆的发展离不开您的智慧和贡献，为了更好的反映民声，欢迎您对赤峰市博物馆的工作提出宝贵的建议或意见。 -->
    </p>
    <div class="submit" @click="submit">提交留言</div>
  </div>
</template>

<script>
    import { message, submitMsg } from '../http/interface'
    export default {
        name: '',
        data() {
            return {
                msg: '',
                form: {
                    name: '',
                    tel: '',
                    text: ''
                },
                maxLength: 200
            }
        },
        watch: {
            'form.text': {
                handler(val) {
                    if(val.length>=this.maxLength) {
                        this.form.text = this.form.text.substring(0,this.maxLength);
                    }
                }
            }
        },
        mounted() {
            this.getMsg()
        },
        methods: {
            async getMsg() {
                const vm = this
                try {
                    const res = await message()
                    if(res.status == 1) {
                        this.msg = res.data.content
                    }else {

                    }
                } catch (error) {
                }
            },
            // 验证手机号
            checkPhone(phone) {
                return /^1\d{10}$/gi.test(phone);
            },
            async submit() {
                let vm = this
                if(!vm.form.name) {
                    this.$toast('请输入姓名')
                    return
                }
                if(!vm.form.tel) {
                    this.$toast('请输入联系电话')
                    return
                }else if(!vm.checkPhone(vm.form.tel)){
                    this.$toast('请输入正确联系电话')
                    return
                }
                if(!vm.form.text) {
                    this.$toast('请输入反馈内容')
                    return
                }

                try {
                    let data = {
                        name: vm.form.name,
                        content: vm.form.text,
                        phone: vm.form.tel,
                        api_token: vm.getCookie('api_token')
                    }
                    const res = await submitMsg(data)
                    if(res.status == 1) {
                        this.$toast('留言成功')
                        vm.form.name = ''
                        vm.form.text = ''
                        vm.form.tel = ''

                    }else if(res.status == 405){
                        this.$toast(res.msg)
                        let path = this.$route.path;
                        this.isLogin(path)
                    }else {
                        this.$toast(res.msg)
                    }
                } catch (error) {
                    console.log(error)
                }
            },
            getCookie(cname) {
                var name = cname + "=";
                var ca = document.cookie.split(';');
                for(var i = 0; i < ca.length; i++) {
                    var c = ca[i].trim();
                    if(c.indexOf(name) == 0) {
                        return c.substring(name.length, c.length);
                    }
                }
                return "";
            }
        }
    }
</script>

<style lang="scss" scoped>
/** @format */

.messageBoard {
  padding: 36px 60px;
  .item {
    width: 100%;
    height: 60px;
    display: flex; /*设为伸缩容器*/
    line-height: 60px;
    margin-bottom: 40px;
    &:nth-of-type(1) .lable {
      padding-left: 20px;
    }
    .lable {
      width: 150px;
      font-size: 32px;
      font-weight: 600;
      color: #323232;
      line-height: 60px;
      text-align: justify;
      text-align-last: justify;
      margin-right: 20px;
      white-space: nowrap;
      .tip {
        color: #c33c1d;
      }
    }
    .inp {
      flex: 1;
      position: relative;
      // vertical-align: top;
      input {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: none;
        outline: none;
        background: #f7f7f7;
        border-radius: 10px;
        font-size: 28px;
        font-weight: 400;
        // color:rgba(204,204,204,1);
        padding: 15px 24px;
      }
    }
  }
  .textArea {
    position: relative;
    width: 100%;
    height: 344px;
    .textarea {
      width: 100%;
      height: 344px;
      max-height: 344px;
      resize: none;
      outline: none;
      border: none;
      background: #f7f7f7;
      font-size: 28px;
      padding: 22px 20px;
    }
    .num {
      position: absolute;
      right: 20px;
      bottom: 20px;
      font-size: 26px;
      font-weight: 400;
      color: rgba(100, 100, 100, 1);
    }
  }
  .article {
    font-size: 30px;
    font-weight: 500;
    color: rgba(100, 100, 100, 1);
    line-height: 48px;
    text-indent: 2em;
    margin-top: 59px;
  }
  .submit {
    width: 480px;
    height: 72px;
    background: rgba(160, 2, 20, 1);
    border-radius: 36px;
    font-size: 34px;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    line-height: 72px;
    text-align: center;
    margin: 254px auto;
  }
}
</style>