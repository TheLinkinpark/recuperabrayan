<template>
  <EmpleaDos ref="empleadosComponent" class="d-none" />
  <div class="container-fluid mt-4 p-3 p-md-4 bg-light rounded-4 border shadow-sm">
    <div class="text-center mb-4">
      <h3 class="mb-1">Gestión de Tareas</h3>
      <p class="mb-0 text-secondary">Organiza, prioriza y da seguimiento a cada actividad del equipo.</p>
    </div>

    <div class="row g-4 align-items-start">
      <!-- Columna Izquierda: Formulario -->
      <div class="col-12 col-xl-5">
        <div class="card border-0 shadow-sm rounded-4">
          <div class="card-body p-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="mb-0">{{ nuevaTarea.id ? "Editar Tarea" : "Nueva Tarea" }}</h4>
            <span class="badge rounded-pill text-bg-light border">Formulario</span>
          </div>

          <form @submit.prevent="addTarea">
            <div class="mb-3">
              <label for="fecha" class="form-label">Fecha</label>
              <input
                type="date"
                id="fecha"
                name="fecha"
                class="form-control"
                v-model="nuevaTarea.fecha"
                required
              />
            </div>

            <div class="mb-3">
              <label for="titulo" class="form-label">Título</label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                class="form-control"
                v-model="nuevaTarea.titulo"
                placeholder="Ej: Revisión semanal del backlog"
                required
              />
            </div>

            <div class="mb-3">
              <label for="descripcion" class="form-label">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                class="form-control"
                rows="3"
                v-model="nuevaTarea.descripcion"
                placeholder="Describe de forma breve qué se debe hacer"
                required
              ></textarea>
            </div>

            <div class="row g-3">
              <div class="col-12 col-md-7">
                <div>
                  <label for="estado" class="form-label">Estado</label>
                  <select
                    id="estado"
                    name="estado"
                    class="form-select"
                    v-model="nuevaTarea.estado"
                    required
                  >
                    <option value="" disabled>Selecciona un estado</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="proceso">En proceso</option>
                    <option value="finalizada">Finalizada</option>
                  </select>
                </div>
              </div>

              <div class="col-12 col-md-5">
                <div>
                  <label for="empleadoId" class="form-label">Empleado</label>
                  <button
                    type="button"
                    id="empleadoId"
                    name="empleadoId"
                    class="btn btn-outline-primary d-inline-flex align-items-center justify-content-center rounded-3 px-3 py-2"
                    aria-label="Buscar empleado"
                  >
                    <i class="fas fa-search" aria-hidden="true"></i>
                  </button>
                  <input type="number" class="form-control" placeholder="Introduce el ID" v-model.number="nuevaTarea.empleadoId" />
                </div>
              </div>
            </div>

            <div class="mt-3">
              <label class="form-label d-block">Prioridad</label>
              <div class="d-flex flex-wrap gap-2" role="group" aria-label="Seleccionar prioridad">
                <input
                  type="radio"
                  class="btn-check"
                  id="prioridad1"
                  name="prioridad"
                  v-model="nuevaTarea.prioridad"
                  value="baja"
                />
                <label class="btn btn-outline-success rounded-pill px-3" for="prioridad1">Baja</label>

                <input
                  type="radio"
                  class="btn-check"
                  id="prioridad2"
                  name="prioridad"
                  v-model="nuevaTarea.prioridad"
                  value="media"
                />
                <label class="btn btn-outline-warning rounded-pill px-3" for="prioridad2">Media</label>

                <input
                  type="radio"
                  class="btn-check"
                  id="prioridad3"
                  name="prioridad"
                  v-model="nuevaTarea.prioridad"
                  value="alta"
                />
                <label class="btn btn-outline-danger rounded-pill px-3" for="prioridad3">Alta</label>
              </div>
            </div>

            <div class="d-flex flex-wrap gap-2 mt-4">
              <button type="submit" class="btn btn-primary px-4">
                {{ nuevaTarea.id ? "Actualizar" : "Guardar" }}
              </button>
              <button
                v-if="nuevaTarea.id"
                type="button"
                class="btn btn-outline-secondary"
                @click="limpiarFormulario"
              >
                Cancelar edición
              </button>
            </div>
          </form>
          </div>
        </div>
      </div>

      <!-- Columna Derecha: Tabla -->
      <div class="col-12 col-xl-7">
        <div class="card border-0 shadow-sm rounded-4">
          <div class="card-body p-3 p-md-4">
          <div class="table-responsive">
            <h4 class="mb-3">Listado de tareas</h4>
          <table
            class="table table-bordered table-hover table-sm align-middle mb-0"
          >
            <thead class="table-primary">
              <tr>
                <th class="text-center fw-semibold">Fecha</th>
                <th class="text-center fw-semibold">Título</th>
                <th class="text-center fw-semibold">Descripción</th>
                <th class="text-center fw-semibold">Estado</th>
                <th class="text-center fw-semibold">Prioridad</th>
                <th class="text-center fw-semibold">Empleado</th>
                <th class="text-center fw-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="tarea in getTareas()" :key="tarea.id">
                <td class="text-center">{{ tarea.fecha }}</td>
                <td class="text-center">{{ tarea.titulo }}</td>
                <td class="text-center">{{ tarea.descripcion }}</td>
                <td class="text-center">
                  <span class="badge" :class="getEstadoBadgeClass(tarea.estado)">
                    {{ formatearEstado(tarea.estado) }}
                  </span>
                </td>
                <td class="text-center">
                  <span class="badge" :class="getPrioridadBadgeClass(tarea.prioridad)">
                    {{ formatearEstado(tarea.prioridad) }}
                  </span>
                </td>
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
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import EmpleaDos from "./EmpleaDos.vue";


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

const empleadosComponent = ref(null);

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

function verEmpleados() {
  const empleados = empleadosComponent.value?.getEmpleados?.() ?? [];
  return empleados;
}

function comprobarEmpleado(id) {
  const idNormalizado = Number(id);
  if (!Number.isInteger(idNormalizado) || idNormalizado <= 0) {
    return "Empleado no encontrado";
  }

  const empleados = verEmpleados();
  /*
  if (!empleados.find((e) => e.id === idNormalizado)) {
    return "Empleado no encontrado";
  }
  */
  const empleado = empleados.find((e) => e.id === idNormalizado);
  return empleado ? empleado.nombre : "Empleado no encontrado";
} 

/* COLORES ESTADO / PRIORIDAD */



function getEstadoBadgeClass(estado) {
  if (estado === "pendiente") return "text-bg-danger";
  if (estado === "proceso") return "text-bg-warning text-dark";
  if (estado === "finalizada") return "text-bg-success";
  return "text-bg-secondary";
}

function getPrioridadBadgeClass(prioridad) {
  if (prioridad === "alta") return "text-bg-danger";
  if (prioridad === "media") return "text-bg-warning text-dark";
  if (prioridad === "baja") return "text-bg-success";
  return "text-bg-secondary";
}

function formatearEstado(estado) {
  if (estado === "proceso") return "En proceso";
  return estado ? estado.charAt(0).toUpperCase() + estado.slice(1) : "";
}




function validaciones(tarea) {
  let esValido = true;

  if (
    !tarea.titulo.trim() ||
    !tarea.descripcion.trim() ||
    !tarea.fecha.trim() ||
    !tarea.estado ||
    !tarea.prioridad ||
    comprobarEmpleado(tarea.empleadoId) === "Empleado no encontrado"
  ) {
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
