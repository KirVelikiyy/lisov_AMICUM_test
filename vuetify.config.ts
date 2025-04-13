import { defineVuetifyConfiguration } from 'vuetify-nuxt-module/custom-configuration'

const lightTheme = {
  dark: false,
  colors: {
    background: '#F0F0F0',
    surface: '#FFFFFF',
    'surface-bright': '#FFFFFF',
    'surface-light': '#E0E0E0',
    'surface-variant': '#6A7180',
    'on-surface-variant': '#37474F',
    primary: '#6F7DAD',
    'primary-darken-1': '#3700B3',
    secondary: '#03DAC6',
    'secondary-darken-1': '#018786',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FF9800',
  },
}

const darkTheme = {
  dark: true,
  colors: {
    background: '#121212',
    surface: '#1E1E1E',
    'surface-bright': '#2C2C2C',
    'surface-light': '#424242',
    'surface-variant': '#B0BEC5',
    'on-surface-variant': '#FFFFFF',
    primary: '#6F7DAD',
    'primary-darken-1': '#3700B3',
    secondary: '#03DAC6',
    'secondary-darken-1': '#018786',
    error: '#CF6679',
    info: '#BBDEFB',
    success: '#81C784',
    warning: '#FFB74D',
  },
}

export default defineVuetifyConfiguration({
  // your Vuetify options here
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: darkTheme,
      light: lightTheme
    }
  },
})
