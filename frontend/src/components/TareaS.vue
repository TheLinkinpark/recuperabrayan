<template>
  <div class="container-fluid mt-4 bg-light p-4 rounded">
    <h3 class="text-center my-1 bg-primary-subtle py-1 mb-3">Gestión de Tareas</h3>

    <div class="row g-4">
      <!-- Columna Izquierda: Formulario -->
      <div class="col-12 col-lg-4">

        <h4>{{ nuevaTarea.id ? "Editar Tarea" : "Nueva Tarea" }}</h4>

        <form @submit.prevent="addTarea">
          <label for="fecha" class="form-label">Fecha: </label>
          <input
            type="date"
            id="fecha"
            name="fecha"
            class="form-control"
            v-model="nuevaTarea.fecha"
            required
          />

          <label for="titulo" class="form-label">Título</label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            class="form-control"
            v-model="nuevaTarea.titulo"
            required
          />

          <label for="descripcion" class="form-label">Descripción</label>
          <input
            type="text"
            id="descripcion"
            name="descripcion"
            class="form-control"
            v-model="nuevaTarea.descripcion"
            required
          />

          <label for="prioridad" class="form-label">Estado</label>
          <select
            id="prioridad"
            name="prioridad"
            class="form-select"
            v-model="nuevaTarea.estado"
            required
          >
            <option value="pendiente">Pendiente</option>
            <option value="proceso">En proceso</option>
            <option value="finalizada">Finalizada</option>
          </select>

          <label for="prioridad" class="form-label">Prioridad</label>
          <label for="prioridad1">Baja</label>
          <input type="radio" id="prioridad1" name="prioridad" class="form-check" v-model="nuevaTarea.prioridad" value="baja"/>
          <label for="prioridad2">Media</label>
          <input type="radio" id="prioridad2" name="prioridad" class="form-check" v-model="nuevaTarea.prioridad" value="media" />
          <label for="prioridad3">Alta</label>
          <input type="radio" id="prioridad3" name="prioridad" class="form-check" v-model="nuevaTarea.prioridad" value="alta" />
          
          <label for="empleadoId" class="form-label">Empleado</label>
          <input type="button">
            <i class="fas fa-search"></i>
          </input>
          
          <button type="submit" class="btn btn-primary mt-3 w-30 d-block mx-auto">
            {{ nuevaTarea.id ? "Actualizar" : "Guardar" }}
          </button>
        </form>
      </div>

      <!-- Columna Derecha: Tabla -->
      <div class="col-12 col-lg-8">
        <div class="table-responsive">
          <h4 class="mb-3">Listado de tareas</h4>
          <table
            class="table table-bordered table-striped table-hover table-sm align-middle"
          >
            <thead class="table-primary">
              <tr>
                <th class="text-center">Fecha</th>
                <th class="text-center">Título</th>
                <th class="text-center">Descripción</th>
                <th class="text-center">Estado</th>
                <th class="text-center">Prioridad</th>
                <th class="text-center">Empleado</th>
                <th class="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="tarea in getTareas()" :key="tarea.id">
                <td class="text-center">{{ tarea.fecha }}</td>
                <td class="text-center">{{ tarea.titulo }}</td>
                <td class="text-center">{{ tarea.descripcion }}</td>
                <td class="text-center">{{ tarea.estado }}</td>
                <td class="text-center">{{ tarea.prioridad }}</td>
                <td class="text-center">{{ tarea.empleadoId }}</td>
                <td class="text-center">
                  <div class="d-flex gap-2 justify-content-center align-items-center flex-wrap">
                    <button class="btn btn-sm btn-warning" @click="selTarea(tarea.id)"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-danger" @click="delTarea(tarea.id)"><i class="fas fa-trash"></i></button>
                  </div>
                </td>

              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

onMounted(() => {
  getTareas();
});

const nuevaTarea = ref({
  id: null,
  fecha: "",
  titulo: "",
  descripcion: "",
  estado: "",
  prioridad: "",
  empleadoId: null,
});

// Array de tareas inicial
let tareas = [
  {
    id: 1,
    fecha: "2026-04-07",
    titulo: "Terminar entrega proyecto",
    descripcion: "Entregar el proyecto antes del 14 de abril",
    estado: "pendiente",
    prioridad: "alta",
    empleadoId: 1,
  },
  {
    id: 2,
    fecha: "2026-04-08",
    titulo: "Reunión con cliente",
    descripcion: "Reunión para discutir los detalles del proyecto",
    estado: "proceso",
    prioridad: "media",
    empleadoId: 2,
  },
];

const tareasRef = ref(tareas);


/* FUNCIONES CRUD */

const addTarea = () => {
  if (!validaciones(nuevaTarea.value)) {
    alert("Por favor, corrija los errores en el formulario.");
    return;
  }
  
  if (nuevaTarea.value.id) {
    // Actualizar tarea existente
    const index = tareasRef.value.findIndex((e) => e.id === nuevaTarea.value.id);
    if (index !== -1) {
      tareasRef.value[index] = { ...nuevaTarea.value };
    }
  } else {
    // Crear nueva tarea
    nuevaTarea.value.id = generarId();
    tareasRef.value.push(nuevaTarea.value);
  }
  
  limpiarFormulario();
};

function generarId() {
  // Obtener el ID máximo actual y sumar 1
  const maxId = tareasRef.value.length > 0 ? Math.max(...tareasRef.value.map((e) => e.id)) : 0;
  return maxId + 1;
}

function selTarea(id) {
  const tarea = tareasRef.value.find((e) => e.id === id);
  if (tarea) {
    nuevaTarea.value = { ...tarea };
  }
}

function delTarea(id) {
  tareasRef.value = tareasRef.value.filter((e) => e.id !== id);
}

function getTareas() {
  return tareasRef.value;
}

function validaciones(tarea) {
  let esValido = true;

  if (!tarea.titulo.trim() || !tarea.descripcion.trim() || !tarea.fecha.trim()) {
    esValido = false;
  }
  return esValido;
}

function limpiarFormulario() {
  nuevaTarea.value = {
    id: null,
    fecha: "",
    titulo: "",
    descripcion: "",
    estado: "",
    prioridad: "",
    empleadoId: null,
  };
}
</script>

<style scoped></style>
