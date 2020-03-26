<template>
  <div>
    <form>
      <slot></slot>
    </form>
  </div>
</template>

<script>
// 1.给FormItem留插槽
// 2.设置数据和校验规则model和rules
// 3.全局校验validate(cb)
export default {
  provide() {
    return {
      form: this
    };
  },
  props: {
    model: {
      type: Object,
      required: true
    },
    rules: {
      type: Object
    }
  },
  methods: {
    validate(cb) {
      const tasks = this.$children
    //   过滤没有验证信息的输入框
        .filter(item => item.prop)
    // 依次执行formItem中的validate返回一个promise<boolean>数组
        .map(item => item.validate());
    // 只要有一个不是true则返回false
      Promise.all(tasks)
        .then(() => cb(true))
        .catch(() => cb(false));
    }
  }
};
</script>

<style scoped>
form {
  display: block;
  margin-top: 0em;
  width: 460px;
}
</style>