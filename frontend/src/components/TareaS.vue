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
          <label for="prioridad">Baja</label>
          <input type="checkbox" id="prioridad" name="prioridad" class="form-check" />
          <label for="prioridad">Media</label>
          <input type="checkbox" id="prioridad" name="prioridad" class="form-check" />
          <label for="prioridad">Alta</label>
          <input type="checkbox" id="prioridad" name="prioridad" class="form-check" />
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
                <th class="text-center">Nombre</th>
                <th class="text-center">Apellidos</th>
                <th class="text-center">Email</th>
                <th class="text-center">Móvil</th>
                <th class="text-center">Puesto</th>
                <th class="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="tarea in getTareas()" :key="tarea.id">
                <td class="text-center">{{ tarea.nombre }}</td>
                <td class="text-center">{{ tarea.apellidos }}</td>
                <td class="text-center">{{ tarea.email }}</td>
                <td class="text-center">{{ tarea.movil }}</td>
                <td class="text-center">{{ tarea.puesto }}</td>
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
  nombre: "",
  apellidos: "",
  email: "",
  movil: "",
  puesto: "",
});

// Array de tareas inicial
let tareas = [
  {
    id: 1,
    nombre: "Juan",
    apellidos: "Pérez García",
    email: "juanpe@example.com",
    movil: "123456789",
    puesto: "RRHH",
  },
  {
    id: 2,
    nombre: "María",
    apellidos: "García López",
    email: "mariag@example.com",
    movil: "987654321",
    puesto: "contabilidad",
  },
];

const tareasRef = ref(tareas);


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
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const reMovil = /^\d{9}$/;
  let esValido = true;

  if (!re.test(tarea.email)) {
    esValido = false;
  }
  if (!reMovil.test(tarea.movil)) {
    esValido = false;
  }
  if (!tarea.nombre.trim() || !tarea.apellidos.trim()) {
    esValido = false;
  }
  return esValido;
}

function limpiarFormulario() {
  nuevaTarea.value = {
    id: null,
    nombre: "",
    apellidos: "",
    email: "",
    movil: "",
    puesto: "",
  };
}
</script>

<style scoped></style>
