<template>
  <div>
    <input :value="value" @input="OnInput" v-bind="$attrs" />
  </div>
</template>

<script>
export default {
  // 禁止将属性向上传递（v-bind="$attrs"用来传递剩余的属性）
  inheritAttrs: false,
  props: {
    value: {
      type: String,
      default: ""
    }
  },
  methods: {
    OnInput(e) {
      // 1.双向绑定：@input、:value
      // 2.派发校验事件
      this.$emit("input", e.target.value);
      this.$parent.$emit("validate");
    }
  }
};
</script>

<style scoped>
input {
  line-height: 40px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  color: #606266;
  width: 360px;
  position: relative;
}
</style>