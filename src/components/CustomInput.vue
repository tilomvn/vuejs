<template>
  <label>
    {{ label }}
    <input :type="inputType" v-model="inputValue" />
    <label v-if="invalidMsg != ''">{{ invalidMsg }}</label>
  </label>
</template>

<script>
export default {
  name: 'CustomInput',
  props: {
    label: String,
    inputType: String,
    modelValue: String,
    invalidMsg: String
  },
  computed: {
    inputValue: {
      get () {
        return this.modelValue
      },
      set (value) {
        this.$emit('update:modelValue', value)
      }
    }
  }
}
</script>

<style scoped>
  input {
    display: block;
    margin-top: 5px;
    margin-bottom: 10px;
  }

  label label {
    color: red
  }
</style>
