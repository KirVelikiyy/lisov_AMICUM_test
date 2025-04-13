<template>
   <div class="input-container">
      <v-text-field
         v-model="date"
         variant="outlined"
         :type="type"
         :rules="rules"
         :disabled="disabled"
         :label="label"
         clearable
      >
         <template #append-inner>
            <v-icon 
               icon="mdi-calendar-today" 
               color="#4B7CDD" 
               size="x-small" 
               :disabled="disabled"
               @click="openDatePicker" 
            />
         </template>
         <template #clear>
            <v-icon
               icon="mdi-close"
               size="x-small"
               @click="date = ''"
            />
         </template>
      </v-text-field>

      <DatePicker
         ref="pickerRef"
         :value="picker"
         :current-date="date"
         @submit="submitHandler"
         @closed="closeDatePicker"
      />
  </div>
</template>

<script setup lang="ts">
import type { ValidationRule } from 'vuetify';
import type { ILocalDate } from '~/types';

interface IProps {
   rules?: ValidationRule[];
   label?: string;
   type?: 'date'|'datetime-local';
   isRangeSelect?: boolean;
   hideDetails?: boolean|'auto';
   disabled?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
   type: 'date',
   isRangeSelect: false,
   hideDetails: 'auto'
});

const picker = ref(false);

const date = ref('');

const submitHandler = (e: ILocalDate) => {
   setDate(e);
   closeDatePicker();
}

const setDate = ({year, monthIndex, day}: ILocalDate) => {
   if (day) {
      const d = new Date(year, monthIndex, day + 1);
      const iso = d.toISOString();
      if (props.type === 'date') {
         date.value = iso.substring(0, iso.indexOf('T'));
      } else if (props.type === 'datetime-local') {
         date.value = iso.substring(0, iso.indexOf('.'));
      }
   }
}

const pickerRef = ref<({picker: HTMLDivElement})|null>(null);

const openDatePicker = () => {
   if (!picker.value) {
      picker.value = true;

      // добавляем прослушивание в следующей глобальной таске, после отрисовки календаря
      setTimeout(() => {
         document.addEventListener('click', listenClickOutside);
      }, 0)
   }
}

const closeDatePicker = () => {
   picker.value = false;
   document.removeEventListener('click', listenClickOutside);
}

const listenClickOutside = (event: Event) => {
   const element = pickerRef.value?.picker;
   if (element && !element.contains(event.target as HTMLInputElement)) {
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

/* решение выше не работает для Mozila. ниже я перекрываю стандартный календарик с помощью display: absolute. */
.v-field__append-inner {
   position: absolute;
   right: 0;

   background-color: rgb(var(--v-theme-background)); /* в идеале intherit, но он почему-то не всегда срабатывает*/

   height: 100%;
   width: 30px;
}

.v-field__clearable {
   position: absolute;
   right: 20px;

   height: 100%;
   width: 30px;
}

.input-container {
   position: relative;
}
</style>
