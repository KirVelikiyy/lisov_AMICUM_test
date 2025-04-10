<template>
   <div 
      ref="picker"
      v-show="value" 
      class="picker" 
   >
      <div class="picker-header">
         <div>
            <v-icon 
               icon="mdi-menu-left" 
               size="small" 
               @click="decrementMonth"
            />
            <span>{{ monthNames[localDate.monthIndex] }}</span>
            <v-icon 
               icon="mdi-menu-right" 
               size="small" 
               @click="incrementMonth" 
            />
         </div>
         <div>
            <v-icon 
               icon="mdi-menu-left" 
               size="small" 
               @click="decrementYear"
            />
            <span>{{ localDate.year }}</span>
            <v-icon 
               icon="mdi-menu-right" 
               size="small" 
               @click="incrementYear" 
            />
         </div>
      </div>
      <div class="picker-content">
         <div class="picker-content-inside">
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
                     :ref="el => { if (el) daysRef[day] = el }"
                     class="day"
                     :class="{empty: !day}"
                     @click="setDay(index)"
                  >
                     {{ day }}
                  </button>
               </div>
               
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
import { onMounted } from 'vue';
interface IProps {
   value?: boolean,
}

interface ILocalDate {
   day: number|null,
   monthIndex: number,
   year: number
}

withDefaults(defineProps<IProps>(), {
   value: false
})

const emit = defineEmits<{
   (e: 'submit', date: ILocalDate): void;
   (e: 'closed'): void;
}>()

const picker = ref(null);
defineExpose({ picker });

const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const monthNames = [
   'Январь', 'Февраль', 'Март', 'Апрель', 
   'Май', 'Июнь', 'Июль', 'Август', 
   'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
]

const days = ref<(number|null)[]>([]);

const localDate = reactive<ILocalDate>({
   day: null,
   monthIndex: 4,
   year: 2025,
})

const selectedDate = ref<ILocalDate|null>(null);

const incrementMonth = () => {
   if (localDate.monthIndex === 11) {
      localDate.monthIndex = 0;
      incrementYear();
   } else {
      localDate.monthIndex++;
   }
   setUpDates();
}

const decrementMonth = () => {
   if (localDate.monthIndex === 0) {
      localDate.monthIndex = 11;
      decrementYear();
   } else {
      localDate.monthIndex--;
   }
   setUpDates();
}

const incrementYear = () => {
   if (localDate.year < 9999) {
      localDate.year++;
   }
   setUpDates();
}

const decrementYear = () => {
   if (localDate.year > 0) {
      localDate.year--;
   }
   setUpDates();
}

const setDay = (index: number) => {
   const day = days.value[index];
   if (day) {
      if (selectedDate.value?.day) {
         unmarkSelectedDay();
      }
      localDate.day = day;
      selectedDate.value = { ...localDate };
      markSelectedDay();
   }
}

const onConfirm = () => {
   emit('submit', localDate);
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
   ]

   if (isSelectedDateMonthOpen()) {
      markSelectedDay();
   } else {
      unmarkSelectedDay();
   }
}

const daysRef = ref([]);

const markSelectedDay = () => {
   setTimeout(() => {
      const component = daysRef.value[selectedDate.value?.day];
      if (component) {
         component.classList.add('selected-day')
      }
   }, 0);
}

const unmarkSelectedDay = () => {
   const component = daysRef.value[selectedDate.value?.day];
   if (component) {
      component.classList.remove('selected-day')
   }
}

onMounted(() => {
   setUpDates();
});
</script>

<style>
.picker {
   width: 268px;
   height: 340px;
   border: 1.5px #6F8BB7 solid;

   font-family: Roboto;
   font-size: 12px;
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
   outline-color: #647CAB;

   color: #6484C5;

   background-color: #F2F4FD;

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
.day {
   width: 100%;
   padding: 10px;

   font-weight: 500;
   letter-spacing: -3%;
   color: #6A7180;
}
.day:hover {
   background-color: #dadada;
}
.day:focus,
.day:active,
.selected-day {
   background-color: #6F7DAD;
   color: white;
}
.empty {
   display: none;
}
.picker-actions {
   width: 100%;
   height: 36px;
}
.confirm {
   width: 50%;
   height: 100%;
   background-color: #6484C5;
   color: white;
   font-weight: 400;

   outline-width: 1px;
   outline-style: solid;
   outline-color: #647CAB;
}
.cancel {
   width: 50%;
   height: 100%;
   background-color: #D9DBE1;
   color: #687793;
   font-weight: 400;

   outline-width: 1px;
   outline-style: solid;
   outline-color: #647CAB;
}
</style>