<template>
   <div class="stand-container">
      <DateTimeInput 
         class="field"
         label="Выберите дату"
         type="date"
         :rules="[required]"
      />
      <DateTimeInput 
         class="field"
         label="Выберите дату и время"
         type="datetime-local"
         :rules="[required]"
      />
   </div>
   <div class="stand-container">
      <DateTimeInput 
         class="field"
         label="Выберите дату и время"
         :rules="[required]"
         disabled
      />
   </div>
</template>

<script setup lang="ts">
const required = (v: string) => !!v || "Поле обязательно для заполнения";

</script>

<style>
.stand-container {
   display: flex;
   flex-flow: row wrap;
   gap: .5rem;
}
.field {
   flex: 1 1 0;
}
</style>
