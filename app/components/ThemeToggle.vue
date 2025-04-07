<template>
   <v-btn
      variant="outlined"
      @click="toggleTheme"
   >
      <v-icon :icon="icon" />
   </v-btn>
</template>

<script setup lang="ts">
import { useTheme } from 'vuetify'

const theme = useTheme()

function toggleTheme () {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}
const icon = computed(() => {
   return theme.global.current.value.dark ? 'mdi-weather-sunny' : 'mdi-weather-night'
})
</script>