<template>
  <div>
    <t-form :model="model" :rules="rules" ref="loginForm">
      <t-form-item label="姓名" prop="name">
        <t-input v-model="model.name" />
      </t-form-item>
      <t-form-item label="密码" prop="password">
        <t-input v-model="model.password" type="password" />
      </t-form-item>
      <t-button @click="logIn">登录</t-button>
    </t-form>
  </div>
</template>

<script>
import TInput from "./TInput.vue";
import TFormItem from "./TFormItem.vue";
import TForm from "./TForm.vue";
import TButton from "./TButton.vue";

export default {
  data() {
    return {
      model: {
        name: "Tom",
        password: ""
      },
      rules: {
        name: [{ required: true, message: "姓名不能为空" }],
        password: [{ required: true, message: "密码不能为空" }]
      }
    };
  },
  components: {
    TInput,
    TFormItem,
    TForm,
    TButton
  },
  methods: {
    logIn() {
      this.$refs.loginForm.validate(isValid => {
        if (isValid) {
          alert("登录成功！");
        } else {
          alert("输入错误！");
        }
      });
    }
  }
};
</script>

<style scoped>
</style>