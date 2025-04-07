<template>
   <div>
      <v-text-field 
         :type="type"
         :label="label"
         :rules="rules"
         :hide-details="hideDetails"
         variant="outlined"
         style="min-width: 220px;"
         clearable
      />
   </div>
   
</template>

<script setup lang="ts">
import { withDefaults } from 'vue';
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
</script>