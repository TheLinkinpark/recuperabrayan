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
                <td><input type="checkbox" class="form-check-input" :value="tarea" v-model="tareasSeleccionadas" @change="comprobarFecha(tarea)"></td>
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

    <!-- Barra flotante de pago -->
    <Transition name="slide-up">
      <div
        v-if="tareasSeleccionadas.length > 0"
        class="position-fixed bottom-0 start-50 translate-middle-x mb-3 d-flex align-items-center justify-content-between flex-wrap gap-3 px-4 py-3 rounded-4 shadow-lg bg-primary"
        style="width: calc(100% - 3rem); max-width: 800px; z-index: 1050;"
      >
        <div class="d-flex align-items-center gap-3">
          <span class="badge bg-white text-primary fs-6 fw-bold px-3 py-2 rounded-pill shadow-sm">
            {{ tareasSeleccionadas.length }}
            {{ tareasSeleccionadas.length === 1 ? 'tarea' : 'tareas' }}
          </span>
          <div class="vr bg-white opacity-50"></div>
          <div class="text-white">
            <span class="opacity-75 me-1 small">Total</span>
            <span class="fs-5 fw-bold">{{ totalFactura.toFixed(2) }} €</span>
          </div>
        </div>

        <div class="d-flex gap-2 flex-wrap">
          <button
            class="btn btn-light text-primary fw-semibold px-4"
            @click="generarFactura"
          >
            <i class="fas fa-file-invoice me-2"></i>Ver Factura
          </button>
          <button
            class="btn btn-warning fw-semibold px-4 text-dark"
            @click="iniciarPago"
          >
            <i class="fab fa-stripe-s me-2"></i>Pagar con Stripe
          </button>
        </div>
      </div>
    </Transition>

    <div v-if="mostrarFactura" class="modal d-block bg-dark bg-opacity-50" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content animate__animated animate__fadeIn">
          <div id="seccion-factura" class="modal-body p-5">
            <div class="d-flex justify-content-between mb-4">
              <div>
                <h4>FACTURA</h4>
                <p class="text-muted">Código: {{ codigoFactura }}</p>
              </div>
              <div class="text-end">
                <h5>Fecha: {{ fechaFactura }}</h5>
              </div>

              <div class="modal-footer bg-light">
                <button type="button" class="btn btn-secondary" @click="mostrarFactura = false">Cerrar</button>
                <button type="button" class="btn btn-dark" @click="imprimirFactura">Imprimir Factura</button>
                <button type="button" class="btn btn-success" @click="iniciarPago">Pagar con Stripe ({{ totalFactura }}€)</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div
        v-if="mostrarPagoExitoso"
        class="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
        style="z-index: 2000; background: rgba(15, 23, 42, 0.72); backdrop-filter: blur(6px);"
      >
        <div class="card border-0 shadow-lg rounded-5 p-4 p-md-5 text-center mx-3" style="max-width: 520px; width: 100%;">
          <div class="d-flex justify-content-center mb-3">
            <div class="rounded-circle bg-success-subtle text-success d-flex align-items-center justify-content-center" style="width: 84px; height: 84px;">
              <i class="fas fa-check fa-2x"></i>
            </div>
          </div>
          <h3 class="mb-2">Pago realizado con éxito</h3>
          <p class="text-muted mb-3">Tu pago se ha completado correctamente. Ya puedes imprimir la factura.</p>

          <div class="bg-light rounded-4 p-3 text-start mb-4">
            <div class="d-flex justify-content-between gap-3 flex-wrap">
              <span class="fw-semibold">Factura</span>
              <span>{{ facturaConfirmada?.codigoFactura || codigoFactura }}</span>
            </div>
            <div class="d-flex justify-content-between gap-3 flex-wrap">
              <span class="fw-semibold">Total</span>
              <span>{{ (facturaConfirmada?.total ?? totalFactura).toFixed(2) }} €</span>
            </div>
            <div class="d-flex justify-content-between gap-3 flex-wrap">
              <span class="fw-semibold">Estado</span>
              <span class="text-success fw-semibold">{{ facturaConfirmada?.estadoTexto || 'Pagado' }}</span>
            </div>
          </div>

          <div class="d-flex flex-column flex-sm-row gap-2 justify-content-center">
            <button type="button" class="btn btn-success px-4" @click="imprimirFacturaConfirmada">
              Imprimir factura
            </button>
            <button type="button" class="btn btn-outline-secondary px-4" @click="cerrarAvisoPago">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getTareas, addTareas, updateTareas, delTareas } from "../api/tareas.js";
import { getEmpleados } from "../api/empleados.js";
import Swal from "sweetalert2";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const route = useRoute();
const router = useRouter();


onMounted(() => {
  obtenerTareas();
  verEmpleados();
  revisarPagoStripe();
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

const tareasSeleccionadas = ref([]);
const mostrarPagoExitoso = ref(false);
const facturaConfirmada = ref(null);


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


/* PAGO TAREAS */

const comprobarFecha = (tarea) => {
  const existe = tareasSeleccionadas.value.some(t => t.id === tarea.id);
  if(!existe) return;

  if(tareasSeleccionadas.value.length === 1) return;

  const fechaReferencia = tareasSeleccionadas.value[0].fecha;

  if(tarea.fecha !== fechaReferencia) {
    Swal.fire({icon: 'error', title: 'Fecha no válida', text: `Todas las tareas deben de tener la misma fecha (${fechaReferencia})`})
    tareasSeleccionadas.value = tareasSeleccionadas.value.filter(t => t.id !== tarea.id);
  }
}


const calcularPrecio = () => {
  const total = nuevaTarea.value.horas * nuevaTarea.value.precio;
  nuevaTarea.value.total = total;
  return total;
}

const mostrarFactura = ref(false);

const codigoFactura = computed(() => {
  return `FAC-${String(Date.now()).slice(-6)}`;
});

const fechaFactura = computed(() => {
  return tareasSeleccionadas.value.length > 0 ? tareasSeleccionadas.value[0].fecha : '';
});

const totalFactura = computed(() => {
  return tareasSeleccionadas.value.reduce((acumulador, tarea) => {
    return acumulador + (Number(tarea.total) || 0);
  }, 0);
});

const generarFactura = () => {
  if (tareasSeleccionadas.value.length === 0) return;
  mostrarFactura.value = true;
};


const iniciarPago = async () => {
  if (!tareasSeleccionadas.value.length) {
    Swal.fire({ icon: 'warning', title: 'Aviso', text: 'No hay tareas seleccionadas para pagar.' });
    return;
  }

  try {
    // Crear la sesión de pago en el backend
    const response = await fetch('http://localhost:5000/crear-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        frontendOrigin: window.location.origin,
        items: tareasSeleccionadas.value.map(t => ({
          id:          t.id,
          titulo:      t.titulo,
          horas:       t.horas,
          precio:      t.precio,
          total:       Number(t.total) || 0,
          empleadoId:  t.empleadoId,
        })),
        amount: totalFactura.value,         // total en €
        codigoFactura: codigoFactura.value, // FAC-xxxxxx para referencia en Stripe
      }),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }

    const session = await response.json();

    if (!session.url) {
      console.error('No se recibió URL de Stripe.');
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo iniciar el pago.' });
      return;
    }

    sessionStorage.setItem(
      'stripePendingItems',
      JSON.stringify(tareasSeleccionadas.value.map(t => ({
        id: t.id,
        titulo: t.titulo,
        horas: t.horas,
        precio: t.precio,
        total: Number(t.total) || 0,
        empleadoId: t.empleadoId,
      })))
    );

    // Redirigir directamente al checkout de Stripe
    window.location.href = session.url;

  } catch (error) {
    console.error('Error en iniciarPago:', error);
    Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo conectar con el servidor de pagos.' });
  }
}

const revisarPagoStripe = async () => {
  const paymentStatus = route.query.payment;
  const sessionId = route.query.session_id;

  if (paymentStatus !== 'success' || !sessionId) {
    return;
  }

  try {
    const respuesta = await fetch(`http://localhost:5000/verificar-pago?session_id=${encodeURIComponent(sessionId)}`);
    if (!respuesta.ok) {
      throw new Error(`Error HTTP ${respuesta.status}`);
    }

    const datos = await respuesta.json();
    facturaConfirmada.value = {
      codigoFactura: datos.codigoFactura,
      total: Number(datos.total) || 0,
      estadoTexto: datos.estado === 'paid' ? 'Pagado' : 'Pendiente',
    };
    mostrarPagoExitoso.value = true;
    router.replace({ path: '/tareas' });
  } catch (error) {
    console.error('Error verificando pago:', error);
    Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo verificar el pago.' });
  }
};

const cerrarAvisoPago = () => {
  mostrarPagoExitoso.value = false;
  router.replace({ path: '/tareas' });
};

const obtenerItemsFactura = () => {
  if (tareasSeleccionadas.value.length > 0) {
    return tareasSeleccionadas.value;
  }

  try {
    return JSON.parse(sessionStorage.getItem('stripePendingItems') || '[]');
  } catch {
    return [];
  }
};

const imprimirFacturaConfirmada = () => {
  const factura = facturaConfirmada.value;
  const items = obtenerItemsFactura();
  const codigo = factura?.codigoFactura || codigoFactura.value;
  const total = factura?.total ?? totalFactura.value;
  const fechaFacturaImpresion = new Date().toLocaleDateString('es-ES');
  const doc = new jsPDF();


  doc.setFontSize(20);
  doc.text('Factura', 14, 18);

  doc.setFontSize(11);
  doc.text(`Código factura: ${codigo}`, 14, 28);
  doc.text(`Fecha de la factura: ${fechaFacturaImpresion}`, 14, 35);


  const startY = 50;
  doc.setFontSize(12);

  const headers = ['Nombre de tarea', 'Fecha de la factura', 'Horas', 'Precio/hora', 'Total'];

  doc.autoTable({
    startY: startY,
    head: [headers],
    body: items.map((tarea) => [
      tarea.titulo || '',
      fechaFacturaImpresion,
      String(tarea.horas ?? ''),
      `${Number(tarea.precio || 0).toFixed(2)} €`,
      `${Number(tarea.total || 0).toFixed(2)} €`,
    ]),
    theme: 'striped',
    styles: {
      fontSize: 10,
      cellPadding: 3
    }
  });

  // Colocar el total con un pequeño margen debajo de la tabla
  const tablaFinalY = (doc.lastAutoTable && doc.lastAutoTable.finalY) ? doc.lastAutoTable.finalY : startY;
  const margen = 8; // ajuste en puntos (px en PDF)
  const posTotalY = tablaFinalY + margen;
  doc.setFontSize(12);
  try {
    doc.setFont('helvetica', 'bold');
  } catch (e) {
    // ignore if font style not available
  }
  doc.text(`Total: ${Number(total).toFixed(2)} €`, 14, posTotalY);
  try {
    doc.setFont('helvetica', 'normal');
  } catch (e) {}

  doc.save("factura.pdf");
};


</script>
