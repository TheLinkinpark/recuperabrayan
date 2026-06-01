<template>
  <div class="container-fluid mt-4 bg-light p-4 rounded">
    <h3 class="text-center my-1 bg-primary-subtle py-1 mb-4">Panel de Estadísticas</h3>
  </div>
</template>

<script setup>
/*
import { ref, onMounted, computed } from "vue";
import { getEmpleados } from "../api/empleados.js";
import { getTareas } from "../api/tareas.js";

const empleadosRef = ref([]);
const tareasRef = ref([]);

onMounted(async () => {
  try {
    empleadosRef.value = await getEmpleados();
    tareasRef.value = await getTareas();
  } catch (error) {
    console.error("Error en la carga", error);
  }
});

// métodos que podrían servir

// CONTAR TAREAS por EMPLEADO, para una tabla de numero de tareas de cada empleado
const resumen = computed(() => {
  return empleadosRef.value.map(emp => {
    // Buscar tareas de este empleado
    const susTareas = tareasRef.value.filter(t => String(t.empleadoId) === String(emp.empleadoId));
    return {
      nombre: emp.nombre,
      apellidos: emp.apellidos,
      puesto: emp.puesto,
      numTareas: susTareas.length
    };
  });
});
*/
</script>



<style scoped>
</style>