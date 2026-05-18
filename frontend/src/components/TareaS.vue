<template>
  <div class="container-fluid mt-4 p-3 p-md-4 bg-light rounded-4 border shadow-sm">
    <div class="text-center mb-4">
      <h3 class="text-center my-1 bg-primary-subtle py-1 mb-3">Gestión de Tareas</h3>
    </div>

    <div class="row g-4 align-items-start">
      <!-- Columna Izquierda: Formulario -->
      <div class="col-12 col-xl-5">
        <div class="card border-0 shadow-sm rounded-4">
          <div class="card-body p-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="mb-0">{{ nuevaTarea.id ? "Editar Tarea" : "Nueva Tarea" }}</h4>
          </div>

          <form @submit.prevent="guardarTarea">

            <div class="row g-3">

              <div class="col-12 col-md-8 mb-3">
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
              <div class="col-12 col-md-4 mb-3">
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
              <div class="col-12 col-md-4">
                <label for="horas">Horas</label>
                <input type="text" id="horas" name="horas" class="form-control" v-model="nuevaTarea.horas" placeholder="4"/>
              </div>

              <div class="col-12 col-md-4">
                <label for="precio">Precio</label>
                <input type="text" id="precio" name="precio" class="form-control" v-model="nuevaTarea.precio" placeholder="15 €">
              </div>

              <div class="col-12 col-md-4">
                <label for="total">Total</label>
                <input type="text" id="total" name="total" class="form-control" :value="calcularPrecio()" disabled>
              </div>

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
                  <div class="d-flex align-items-stretch gap-2">
                    <input
                      type="number"
                      id="empleadoId"
                      name="empleadoId"
                      class="form-control"
                      placeholder="Introducir ID"
                      v-model.number="nuevaTarea.empleadoId"
                      :class="{
                        'bg-warning-subtle border border-warning': estadoEmpleadoId === 'valid',
                        'is-invalid': estadoEmpleadoId === 'invalid',
                      }"
                      @input="limpiarEstadoEmpleadoId"
                      @blur="validarEmpleadoSeleccionado"
                      required
                    />
                    <button
                      type="button"
                      class="btn btn-outline-primary d-inline-flex align-items-center justify-content-center rounded-3 px-3"
                      aria-label="Buscar empleado"
                      @click="validarEmpleadoSeleccionado"
                    >
                      <i class="fas fa-search" aria-hidden="true"></i>
                    </button>
                  </div>
                  <div
                    v-if="mensajeEmpleadoId"
                    class="form-text"
                    :class="estadoEmpleadoId === 'invalid' ? 'text-danger' : 'text-warning-emphasis'"
                  >
                    {{ mensajeEmpleadoId }}
                  </div>
                </div>
              </div>
            </div>

            <div class="d-flex flex-row mt-4 gap-4">
              
              <label class="form-label d-block mb-0">Prioridad</label>

              <div class="d-flex flex-wrap gap-2" role="group" aria-label="Seleccionar prioridad">
                
                <input type="radio" class="btn-check" id="prioridad1" name="prioridad" v-model="nuevaTarea.prioridad" value="baja" checked/>
                <label class="btn btn-outline-success rounded-pill px-3 me-2" for="prioridad1">Baja</label>

                <input type="radio" class="btn-check" id="prioridad2" name="prioridad" v-model="nuevaTarea.prioridad" value="media"/>
                <label class="btn btn-outline-warning rounded-pill px-3 me-2" for="prioridad2">Media</label>

                <input type="radio" class="btn-check" id="prioridad3" name="prioridad" v-model="nuevaTarea.prioridad" value="alta"/>
                <label class="btn btn-outline-danger rounded-pill px-3 me-2" for="prioridad3">Alta</label>
              </div>
            </div>

            <div class="d-flex flex-wrap gap-2 mt-4 justify-content-center">
              <button type="submit" class="btn btn-primary px-4">
                {{ nuevaTarea.id ? "Actualizar" : "Guardar" }}
              </button>
              <button
                v-if="nuevaTarea.id"
                type="button"
                class="btn btn-outline-secondary"
                @click="limpiarFormulario"
              >
                Cancelar
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
            class="table table-bordered table-striped table-hover table-sm align-middle mb-0"
          >
            <thead class="table-primary">
              <tr>
                <th></th>
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
              <tr v-for="tarea in obtenerTareas()" :key="tarea.id">
                <td><input type="checkbox" class="form-check-input"></td>
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
                <td class="text-center">{{ tarea.empleadoNombre || obtenerNombreEmpleado(tarea.empleadoId) }}</td>
                <td class="text-center">
                  <div class="d-flex gap-2 justify-content-center align-items-center flex-wrap">
                    <button class="btn btn-sm btn-warning" @click="selTarea(tarea.id)"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-danger" @click="borrarTarea(tarea.id)"><i class="fas fa-trash"></i></button>
                  </div>
                </td>

              </tr>
            </tbody>
          </table>
              <div class="d-flex justify-content-end mt-3">
                <button class="btn btn-secondary px-4" @click="imprimirListado">
                  Imprimir listado
                </button>
              </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getTareas, addTareas, updateTareas, delTareas } from "../api/tareas.js";
import { getEmpleados } from "../api/empleados.js";
import Swal from "sweetalert2";
import { jsPDF } from "jspdf";
import "jspdf-autotable";


onMounted(() => {
  obtenerTareas();
  verEmpleados();
});

const nuevaTarea = ref({
  id: null,
  fecha: "",
  titulo: "",
  descripcion: "",
  estado: "",
  prioridad: "baja",
  empleadoId: null,
  horas: null,
  precio: null,
  total: null
});

const estadoEmpleadoId = ref("");
const mensajeEmpleadoId = ref("");

const empleadosRef = ref([]);



const tareasRef = ref([]);


/* FUNCIONES CRUD */

const guardarTarea = async () => {
  if (!validaciones(nuevaTarea.value)) {
    Swal.fire({
      icon: "warning",
      title: "Datos incompletos o inválidos",
      text: "Por favor, completa todos los campos correctamente antes de guardar.",
    });
    return;
  }

  const empleado = buscarEmpleadoPorId(nuevaTarea.value.empleadoId);
  if (empleado) {
    nuevaTarea.value.empleadoNombre = obtenerNombreCompletoEmpleado(empleado);
  }

  const { empleadoNombre, ...tareaParaGuardar } = nuevaTarea.value;
  
  if (nuevaTarea.value.id) {
    // Actualizar tarea existente
    const tareaOriginal = tareasRef.value.findIndex((e) => e.id === nuevaTarea.value.id);
    if (tareaOriginal !== -1) {
      await updateTareas(nuevaTarea.value.id, tareaParaGuardar);
      Swal.fire({ icon: "success", title: "Tarea actualizada", text:"La tarea ha sido actualizada correctamente." });
    }
  } else {
    // Crear nueva tarea
    await addTareas(tareaParaGuardar);
    obtenerTareas();
    Swal.fire({ icon: "success", title: "Tarea agregada", text: "La tarea ha sido agregada correctamente." });
  }
  
  limpiarFormulario();
};

function selTarea(id) {
  const tarea = tareasRef.value.find((e) => e.id === id);
  if (tarea) {
    nuevaTarea.value = {
      ...tarea,
      empleadoNombre: tarea.empleadoNombre || obtenerNombreEmpleado(tarea.empleadoId),
    };
    const empleado = buscarEmpleadoPorId(tarea.empleadoId);
    if (empleado) {
      estadoEmpleadoId.value = "valid";
      mensajeEmpleadoId.value = `Empleado encontrado: ${obtenerNombreCompletoEmpleado(empleado)}`;
    } else if (tarea.empleadoId) {
      estadoEmpleadoId.value = "invalid";
      mensajeEmpleadoId.value = "Empleado no encontrado";
    } else {
      limpiarEstadoEmpleadoId();
    }
  }
}

const borrarTarea = async (id) => {
  tareasRef.value = await delTareas(id);
  Swal.fire({ icon: "success", title: "Tarea eliminada", text: "La tarea ha sido eliminada correctamente." });
}

const obtenerTareas = () => {
  getTareas().then((data) => {
    tareasRef.value = data;
  });
  return tareasRef.value;
}

const verEmpleados = () => {
  getEmpleados().then((data) => {
    empleadosRef.value = data;
  });
  return empleadosRef.value;
}

function buscarEmpleadoPorId(id) {
  const idNormalizado = Number(id);
  if (!Number.isInteger(idNormalizado) || idNormalizado <= 0) {
    return null;
  }

  return empleadosRef.value.find((e) => String(e.empleadoId) === String(idNormalizado)) ?? null;
}

function obtenerNombreCompletoEmpleado(empleado) {
  return `${empleado.nombre} ${empleado.apellidos}`.trim();
}

function obtenerNombreEmpleado(id) {
  const empleado = buscarEmpleadoPorId(id);
  return empleado ? obtenerNombreCompletoEmpleado(empleado) : "Empleado no encontrado";
}

function limpiarEstadoEmpleadoId() {
  if (!nuevaTarea.value.empleadoId) {
    estadoEmpleadoId.value = "";
    mensajeEmpleadoId.value = "";
    nuevaTarea.value.empleadoNombre = "";
    return;
  }

  estadoEmpleadoId.value = "";
  mensajeEmpleadoId.value = "";
}

function validarEmpleadoSeleccionado() {
  if (!nuevaTarea.value.empleadoId) {
    limpiarEstadoEmpleadoId();
    return false;
  }

  const empleado = buscarEmpleadoPorId(nuevaTarea.value.empleadoId);
  if (empleado) {
    estadoEmpleadoId.value = "valid";
    mensajeEmpleadoId.value = `Empleado encontrado: ${obtenerNombreCompletoEmpleado(empleado)}`;
    nuevaTarea.value.empleadoNombre = obtenerNombreCompletoEmpleado(empleado);
    nuevaTarea.value.empleadoId = empleado.empleadoId;
    return true;
  }

  estadoEmpleadoId.value = "invalid";
  mensajeEmpleadoId.value = "Empleado no encontrado";
  Swal.fire({
    icon: "warning",
    title: "Empleado no encontrado",
    text: "El ID introducido no existe.",
  });
  nuevaTarea.value.empleadoId = null;
  nuevaTarea.value.empleadoNombre = "";
  return false;
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
  const empleado = buscarEmpleadoPorId(tarea.empleadoId);

  if (
    !tarea.titulo.trim() ||
    !tarea.descripcion.trim() ||
    !tarea.fecha.trim() ||
    !tarea.estado ||
    !tarea.prioridad ||
    !empleado
  ) {
    esValido = false;
  }

  if (!empleado && tarea.empleadoId) {
    validarEmpleadoSeleccionado();
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
    prioridad: "baja",
    empleadoId: null,
    empleadoNombre: "",
  };
  limpiarEstadoEmpleadoId();
}

const ORDEN_PRIORIDAD = { alta: 1, media: 2, baja: 3 };
const imprimirListado = () => {

  const tareasOrdenadas = [...tareasRef.value].sort((a, b) => ORDEN_PRIORIDAD[a.prioridad.toLowerCase()] - ORDEN_PRIORIDAD[b.prioridad.toLowerCase()]);


  const doc = new jsPDF();

  // Verificar si autoTable está disponible
  if (typeof doc.autoTable !== "function") {
    console.error("autoTable NO está disponible en esta instancia de jsPDF");
    return;
  }

  // Título del PDF
  doc.setFontSize(18);
  doc.text("Listado de Tareas", 14, 20);

  // Espacio para los datos de la tabla
  let y = 30;
  doc.setFontSize(12);

  // Definir los encabezados de la tabla
  const headers = ["ID", "Título", "Prioridad", "Estado", "Empleado ID"];

  // Generar tabla con los datos de tareas
  doc.autoTable({
    startY: y,
    head: [headers],
    body: tareasOrdenadas.map(tarea => [
      tarea.id,
      tarea.titulo,
      tarea.prioridad,
      tarea.estado,
      tarea.empleadoId
    ]),
    theme: "striped",
    styles: { fontSize: 10, cellPadding: 3 }
  });

  // Guardar el PDF
  doc.save("listado_tareas.pdf");
}


const calcularPrecio = () => {
  const total = nuevaTarea.value.horas * nuevaTarea.value.precio;
  nuevaTarea.value.total = total;
  return total;
}

const iniciarPago = () => {

}
</script>
