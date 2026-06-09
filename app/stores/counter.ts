export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)

  const increment = () => {
    count.value += 1
  }

  const decrement = () => {
    count.value -= 1
  }

  return {
    count,
    doubleCount,
    increment,
    decrement
  }
}, {
  persist: {
    storage: piniaPluginPersistedstate.localStorage()
  }
})
