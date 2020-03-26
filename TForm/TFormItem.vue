<template>
  <div class="formItem">
    <label v-if="label">{{label}}</label>
    <div class="inputItem">
      <slot></slot>
      <div class="error">{{errorMessage}}</div>
    </div>
  </div>
</template>

<script>
// 安装 async-validator(npm i async-validator -S)
import Schema from "async-validator";
// 1.给Input预留插槽 - slot
// 2.能够展示label和校验信息errorMessage
// 3.能够进行校验validate()
export default {
  inject: ["form"],
  props: {
    label: {
      type: String,
      default: ""
    },
    prop: {
      type: String
    }
  },
  data() {
    return {
      errorMessage: ""
    };
  },
  mounted() {
    this.$on("validate", () => {
      this.validate();
    });
  },
  methods: {
    validate() {
      const desc = {
        [this.prop]: this.form.rules[this.prop]
      };
      const validator = new Schema(desc);
      return validator.validate(
        { [this.prop]: this.form.model[this.prop] },
        errors => {
          if (errors) {
            this.errorMessage = errors[0].message;
          } else {
            this.errorMessage = "";
          }
        }
      );
    }
  }
};
</script>

<style scoped>
.formItem {
  margin-bottom: 22px;
  position: relative;
}
.inputItem {
  margin-left: 100px;
  line-height: 40px;
  position: relative;
  font-size: 14px;
}
.error {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
  top: 100%;
  left: 0;
  position: absolute;
}
label {
  color: #606266;
  font-size: 14px;
  float: left;
  text-align: right;
  vertical-align: middle;
  line-height: 40px;
  padding: 0 12px 0 0;
  box-sizing: border-box;
  width: 98px;
}
</style>