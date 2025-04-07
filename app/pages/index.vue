<template>
  <div class="page-container">
    <div class="content">
      <div class="theme">
        <ThemeToggle />
      </div>
      
      <v-divider />
      
      <DateTimeInputStand />
    </div>
    
  </div>
</template>

<script lang="ts" setup>

</script>

<style>
.page-container {
  display: flex;
  justify-content: center;
  width: 100%;
}
.content {
  width: 100%;
  max-width: 1080px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.theme {
  display: flex;
  justify-content: end;
}
</style>
