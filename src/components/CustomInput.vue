<template>
  <label>
    {{ label }}
    <input :type="inputType" v-model="inputValue" />
  </label>
</template>

<script>
export default {
  name: 'CustomInput',
  props: {
    label: String,
    inputType: String,
    modelValue: String
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
</style>
