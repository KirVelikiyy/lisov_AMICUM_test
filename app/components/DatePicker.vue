<template>
   <div 
      v-show="value" 
      ref="picker"
      class="picker" 
   >
      <div class="picker-header">
         <div class="cursor-pointer" @click="setCurrentView('monthes')">
            <v-icon 
               icon="mdi-menu-left" 
               size="small"
               z-index="10"
               @click.stop="decrementMonth"
            />
            <span>{{ monthNames[localDate.monthIndex] }}</span>
            <v-icon 
               icon="mdi-menu-right" 
               size="small" 
               z-index="10"
               @click.stop="incrementMonth" 
            />
         </div>
         <div class="cursor-pointer" @click="setCurrentView('years')">
            <v-icon 
               icon="mdi-menu-left" 
               size="small"
               z-index="10" 
               @click.stop="decrementYear"
            />
            <span>{{ localDate.year }}</span>
            <v-icon 
               icon="mdi-menu-right" 
               size="small" 
               z-index="10"
               @click.stop="incrementYear" 
            />
         </div>
      </div>
      <div class="picker-content">
         <div v-if="currentView === 'days'">
            <div class="days-of-week">
               <span
                  v-for="(day, index) of daysOfWeek"
                  :key="index"
                  class="day-of-week"
               >
                  {{ day }}
               </span>
            </div>
            <div class="days">
               <div
                  v-for="(day, index) of days" 
                  :key="index"
                  class="day-container"
               >
                  <button
                     :ref="el => { if (el && day) daysRef[day] = el }"
                     class="date"
                     :class="{empty: !day}"
                     @click="day ? setDate('day', day) : null"
                  >
                     {{ day }}
                  </button>
               </div>
            </div>
         </div>
         <div v-else-if="currentView === 'monthes'" class="monthes">
            <button
               :ref="el => { if (el) monthesRef[index] = el }"
               v-for="(month, index) of monthNames" 
               :key="index"
               class="date"
               @click="setDate('monthIndex', index)"
            >
               {{ month }}
            </button>
         </div>
         <div v-else-if="currentView === 'years'" class="years">
            <div
               :ref="el => { if (el) yearsRef[year] = el }"
               v-for="(year, index) of years" 
               :key="index"
               class="date"
               @click="setDate('year', year)"
            >
               {{ year }}
            </div>
         </div>
      </div>
      <div class="picker-actions">
         <button class="confirm" @click="onConfirm">Подтвердить</button>
         <button class="cancel" @click="onClosed">Отменить</button>
      </div>
   </div>
</template>

<script setup lang="ts">
import { onMounted, type ComponentPublicInstance } from 'vue';
import type { ILocalDate } from '~/types'

interface IProps {
   value?: boolean,
   currentDate?: string
}

type TLocalDateKey = 'day'|'monthIndex'|'year';

const { value = false, currentDate = '' } = defineProps<IProps>();

function parseCurrentDate(date: string) {
   if (!date) {
      return;
   }
   const [ year, month, day ] = date.split('-')
   localDate.day = Number(day);
   localDate.monthIndex = Number(month) - 1;
   localDate.year = Number(year);
   selectedDate.value = { ...localDate };
}

watch(
   () => value,
   (newValue) => {
      if (!newValue) {
         return;
      }
      setCurrentView('days');
      parseCurrentDate(currentDate);
   }
);

const emit = defineEmits<{
   (e: 'submit', date: ILocalDate): void;
   (e: 'closed'): void;
}>();

const picker = ref(null);
defineExpose({ picker });

const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const monthNames = [
   'Январь', 'Февраль', 'Март', 'Апрель', 
   'Май', 'Июнь', 'Июль', 'Август', 
   'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];
const days = ref<(number|null)[]>([]);
const years = ref<number[]>([]);

const localDate = reactive<ILocalDate>({
   day: null,
   monthIndex: 4,
   year: 2025,
})

const selectedDate = ref<ILocalDate>(localDate);

const incrementMonth = () => {
   if (localDate.monthIndex === 11) {
      setDate('monthIndex', 0);
      incrementYear();
   } else {
      setDate('monthIndex', localDate.monthIndex + 1);
   }
   setUpDates();
}

const decrementMonth = () => {
   if (localDate.monthIndex === 0) {
      setDate('monthIndex', 11);
      decrementYear();
   } else {
      setDate('monthIndex', localDate.monthIndex - 1);
   }
   setUpDates();
}

const incrementYear = () => {
   if (localDate.year < 9999) {
      setDate('year', localDate.year + 1);
   }
   setUpDates();
}

const decrementYear = () => {
   if (localDate.year > 0) {
      setDate('year', localDate.year - 1);
   }
   setUpDates();
}

function setDate(key: TLocalDateKey, value: number) {
   unmarkSelectedDate(key);
   localDate[key] = value;
   if (key === 'day') {
      selectedDate.value = { ...localDate };
   }
   if (key === 'year') {
      updateYears();
   }
   markSelectedDate(key);
}

const onConfirm = () => {
   if (currentView.value === 'years') {
      setCurrentView('monthes');
   } else if (currentView.value === 'monthes') {
      setCurrentView('days');
   } else if (currentView.value === 'days') {
      emit('submit', localDate);
   }
}

const onClosed = () => {
   emit('closed');
}

const getMonthInfo = (year: number, month: number) => {
   const firstDay = new Date(year, month, 1);
   // последний день месяца берем, отталкиваясь от следуюшего месяца
   const lastDay = new Date(year, month + 1, 0);

   const firstDayOfWeek = firstDay.getDay();

   return {
      daysInMonth: lastDay.getDate(),
      //              тут 0 это воскресенье, поэтому так жестко локализуем 
      firstDayOfWeek: firstDayOfWeek ? firstDayOfWeek : 7
   }
};

const isSelectedDateMonthOpen = () => {
   return selectedDate.value 
      && selectedDate.value.monthIndex === localDate.monthIndex 
      && selectedDate.value.year === localDate.year;
}

const setUpDates = () => {
   const { daysInMonth, firstDayOfWeek } = getMonthInfo(localDate.year, localDate.monthIndex);
   const nulls = Array(firstDayOfWeek - 1).fill(null);
   const dayNumbers = [];

   for (let i = 1; i <= daysInMonth; i++) {
      dayNumbers.push(i);
   }

   days.value = [
      ...nulls,
      ...dayNumbers
   ];

   if (isSelectedDateMonthOpen()) {
      markSelectedDate('day');
   } else {
      unmarkSelectedDate('day');
   }
}

const daysRef = ref<(Component | ComponentPublicInstance)[]>([]);
const monthesRef = ref<(Component | ComponentPublicInstance)[]>([]);
const yearsRef = ref<(Component | ComponentPublicInstance)[]>([]);

const refsByKeys = {
   day: daysRef,
   monthIndex: monthesRef,
   year: yearsRef,
}

function markSelectedDate(key: TLocalDateKey) {
   const resource = key === 'day' ? selectedDate.value : localDate;
   setTimeout(() => {
      if (typeof (resource[key]) === 'number') {
         const component = refsByKeys[key]?.value[resource[key]] as HTMLElement;
         component?.classList.add('selected-date')
      }
   }, 0);
}

function unmarkSelectedDate(key: TLocalDateKey) {
   const resource = key === 'day' ? selectedDate.value : localDate;
   if (typeof (resource[key]) === 'number') {
      const component = refsByKeys[key]?.value[resource[key]] as HTMLElement;
      component?.classList.remove('selected-date')
   }
}

type TCurrentView = 'days'|'monthes'|'years';

const currentView = ref<TCurrentView>('days');

function setCurrentView(value: TCurrentView) {
   currentView.value = value;
   const currentViewAsLocalDateKey = {
      days: "day",
      monthes: "monthIndex",
      years: "year"
   }

   const localDateKey = currentViewAsLocalDateKey[value] as TLocalDateKey;
   
   if (localDateKey === 'year') {
      updateYears();
   }

   if (localDateKey === 'day' && isSelectedDateMonthOpen()) {
      markSelectedDate(localDateKey);
   } else if (localDateKey !== 'day') {
      markSelectedDate(localDateKey);
   }
}

function updateYears() {
   const newYears = [];
   for (let i = -4; i < 8; i++) {
      newYears.push(localDate.year + i);
   }
   years.value = newYears;
}

onMounted(() => {
   setUpDates();
   updateYears();
});
</script>

<style>
.picker {
   width: 268px;
   height: 340px;
   border: 1.5px rgb(var(--v-theme-surface-variant)) solid;

   font-family: Roboto;
   font-size: 12px;

   position: absolute;
   top: 4rem;

   z-index: 50;
}
.picker-header {
   display: flex;
   flex-direction: row;
   width: 100%;
   height: 36px;
}
.picker-header > * {
   height: 100%;
   width: 50%;
   padding: 8px 12px;

   outline-width: 1px;
   outline-style: solid;
   outline-color: rgb(var(--v-theme-surface-variant));

   color: #6484C5;

   background-color: rgb(var(--v-theme-background));

   display: flex;
   justify-content: space-between;
   align-items: center;
   
   letter-spacing: -3%;
   font-size: 14px;
   font-weight: 500;
}
.picker-content {
   width: 100%;
   height: 268px;

   padding: 12px 8px;

   display: flex;
   flex-direction: column;
   gap: 10px;

   background-color: rgb(var(--v-theme-background));
}
.days-of-week {
   display: flex;
   justify-content: space-between;
   width: 100%;
   height: 19px;
}
.day-of-week {
   display: flex;
   align-items: center;
   width: 36px;
   height: 19px;
   padding: 0 10px;

   line-height: 16px;
   letter-spacing: -0.5px;
   font-weight: 400;

   color: #9096A3;
}
.days {
   display: grid;
   grid-template-columns: repeat(7, 1fr);
   grid-template-rows: auto;
}
.day-container {
   text-align: center;
}
.date {
   width: 100%;
   padding: 10px;

   font-weight: 500;
   letter-spacing: -3%;
   color: #6A7180;

   display: flex;
   justify-content: center;
   align-items: center;
}
.date:hover {
   background-color: #dadada;
}
.date:focus,
.date:active,
.selected-date {
   background-color: rgb(var(--v-theme-primary));
   color: white;
}
.empty {
   display: none;
}
.monthes,
.years {
   display: grid;
   grid-template-columns: repeat(3, 1fr);
   grid-template-rows: auto;
   height: 100vh;
}
.picker-actions {
   width: 100%;
   height: 36px;
}
.confirm {
   width: 50%;
   height: 100%;
   background-color: rgb(var(--v-theme-primary));
   color: white;
   font-weight: 400;

   outline-width: 1px;
   outline-style: solid;
   outline-color: rgb(var(--v-theme-surface-variant));
}
.cancel {
   width: 50%;
   height: 100%;
   background-color: rgb(var(--v-theme-background));
   color: #687793;
   font-weight: 400;

   outline-width: 1px;
   outline-style: solid;
   outline-color: rgb(var(--v-theme-surface-variant));
}
</style>