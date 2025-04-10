<template>
   <div>
      <v-text-field
         v-model="date"
         variant="outlined"
         :type="type"
      >
         <template #append-inner>
            <v-icon 
               icon="mdi-calendar-today" 
               color="#4B7CDD" 
               size="x-small" 
               @click="openDatePicker" 
            />
         </template>
      </v-text-field>

      <DatePicker
         ref="pickerRef"
         :value="picker"
         @submit="submitHandler"
         @closed="closeDatePicker"
      />
  </div>
</template>

<script setup lang="ts">
import type { ValidationRule } from 'vuetify';

interface IProps {
   rules?: ValidationRule[],
   label?: string,
   type?: string,
   isRangeSelect?: boolean,
   hideDetails?: boolean|'auto'
}

withDefaults(defineProps<IProps>(), {
   type: 'date',
   isRangeSelect: false,
   hideDetails: 'auto'
});

const picker = ref(false);

const date = ref('');

const submitHandler = (e) => {
   setDate(e);
   closeDatePicker();
}

const setDate = ({year, monthIndex, day}) => {
   const d = new Date(year, monthIndex, day + 1 || 0);
   const iso = d.toISOString();
   date.value = iso.substring(0, iso.indexOf('T'));
}

const pickerRef = ref<HTMLDivElement|null>(null);

const openDatePicker = () => {
   if (!picker.value) {
      picker.value = true;
      // добавляем прослушивание в следующей глобальной таске, после отрисовки календаря
      setTimeout(() => {
         document.addEventListener('click', listenClickOutside);
      }, 0)
      console.log('openPicker')
   }
}

const closeDatePicker = () => {
   picker.value = false;
   document.removeEventListener('click', listenClickOutside);
   console.log('closePicker')
}

const listenClickOutside = event => {
   const element = pickerRef.value?.picker;
   if (element && !element.contains(event.target)) {
      closeDatePicker();
   }
}

</script>

<style>
input[type="date"]::-webkit-calendar-picker-indicator,
input[type="datetime-local"]::-webkit-calendar-picker-indicator
{
   display: none;
}
</style>
