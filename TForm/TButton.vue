<template>
    <button @click="$emit('click','args')" type="button">
         <slot></slot>   
    </button>
</template>

<script>
// 渲染按钮，并设置按钮type="button"阻止form默认刷新
export default {
};
</script>

<style scoped>
button {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
  border: 1px solid #dcdfe6;
  text-align: center;
  box-sizing: border-box;
  line-height: 1;
  margin: 0;
  font-weight: 500;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
}
</style>