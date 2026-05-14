<template>
  <div class="container-fluid mt-4 bg-light p-4 rounded">
    <h3 class="text-center my-1 bg-primary-subtle py-1 mb-3">Gestión de Empleados</h3>

    <div class="row g-4">
      <!-- Columna Izquierda: Formulario -->

      <div class="col-12 col-xl-5">
        <div class="card border-0 shadow-sm rounded-4">
          <div class="row g-3 card-body p-4">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h4>{{ nuevoEmpleado.id ? "Editar Empleado" : "Nuevo Empleado" }}</h4>
            </div>

        <form @submit.prevent="guardarEmpleado">
          
          
          <div class="row g-3">
            <div class="col-12 col-md-5">
              <label for="nombre" class="form-label">Nombre</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                class="form-control "
                v-model="nuevoEmpleado.nombre"
                placeholder="Ej: Pedro"
                required
              />
            </div>

            <div class="col-12 col-md-7">
              <label for="apellidos" class="form-label">Apellidos</label>
              <input
                type="text"
                id="apellidos"
                name="apellidos"
                class="form-control"
                v-model="nuevoEmpleado.apellidos"
                placeholder="Ej: Rodríguez García"
                required
              />
            </div>
          </div>


          <div class="row g-3 mt-3">
            <div class="col-12 col-md-8">
              <label for="email" class="form-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                class="form-control"
                v-model="nuevoEmpleado.email"
                placeholder="Ej: pedro.rodriguez@example.com"
                required
              />
            </div>

            <div class="col-12 col-md-4">
              <label for="movil" class="form-label">Móvil</label>
              <input
                type="tel"
                id="movil"
                name="movil"
                class="form-control"
                v-model="nuevoEmpleado.movil"
                placeholder="Ej: 612345678"
                required
              />
            </div>
          </div>


          <div class="col-12 col-md-6 mt-3">
            <label for="puesto" class="form-label">Puesto</label>
            <select
              id="puesto"
              name="puesto"
              class="form-select "
              v-model="nuevoEmpleado.puesto"
              required
            >
              <option value="" disabled selected hidden>Selecciona un puesto...</option>
              <option value="RRHH" selected>RRHH</option>
              <option value="contabilidad">Contabilidad</option>
              <option value="almacen">Almacén</option>
              <option value="ventas">Ventas</option>
            </select>
          </div>


          <div class="d-flex flex-wrap gap-2 mt-4 justify-content-center">
            <button v-if="nuevoEmpleado.id" type="button" class="btn btn-secondary" @click="imprimirTareas">
              <i class="fas fa-print"></i> Tareas asignadas
            </button>
            <button type="submit" class="btn btn-primary px-4">
              {{ nuevoEmpleado.id ? "Actualizar" : "Guardar" }}
            </button>
            <button
                  v-if="nuevoEmpleado.id"
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
              <h4 class="mb-3">Listado de empleados</h4>
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
                  <tr v-for="empleado in obtenerEmpleados()" :key="empleado.id">
                    <td class="text-center">{{ empleado.nombre }}</td>
                    <td class="text-center">{{ empleado.apellidos }}</td>
                    <td class="text-center">{{ empleado.email }}</td>
                    <td class="text-center">{{ empleado.movil }}</td>
                    <td class="text-center">{{ empleado.puesto }}</td>
                    <td class="text-center">
                      <div class="d-flex gap-2 justify-content-center align-items-center flex-wrap">
                        <button class="btn btn-sm btn-warning" @click="selEmpleado(empleado.empleadoId)"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-danger" @click="borrarEmpleado(empleado.id)"><i class="fas fa-trash"></i></button>
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
import Swal from "sweetalert2";
import { getEmpleados, addEmpleados, updateEmpleados, delEmpleados } from "../api/empleados.js";
import { getTareas } from "../api/tareas.js";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

onMounted(() => {
  obtenerEmpleados();
  obtenerTareas();

});

const nuevoEmpleado = ref({
  id: null,
  empleadoId: null,
  nombre: "",
  apellidos: "",
  email: "",
  movil: "",
  puesto: "",
});


const empleadosRef = ref([]);
const tareasRef = ref([]);


const guardarEmpleado = async () => {
  if (!validaciones(nuevoEmpleado.value)) {
       Swal.fire({
      icon: "warning",
      title: "Datos incompletos o inválidos",
      text: "Por favor, completa todos los campos correctamente antes de guardar.",
    });
    return;
  }
  
  if (nuevoEmpleado.value.empleadoId) {
    // Actualizar empleado existente
    const empleadoOriginal = empleadosRef.value.findIndex((e) => e.empleadoId === nuevoEmpleado.value.empleadoId);
    if (empleadoOriginal !== -1) {
      await updateEmpleados(nuevoEmpleado.value.empleadoId, nuevoEmpleado.value);
      Swal.fire({ icon: "success", title: "Empleado actualizado", text: "El empleado ha sido actualizado correctamente." });
    }
  } else {
    // Crear nuevo empleado
    nuevoEmpleado.value.empleadoId = generarId();
    empleadosRef.value = await addEmpleados(nuevoEmpleado.value);
    Swal.fire({ icon: "success", title: "Empleado agregado", text: "El empleado ha sido agregado correctamente." });
  }
  
  limpiarFormulario();
};

function generarId() {
  // Obtener el ID máximo actual y sumar 1
  const maxId = empleadosRef.value.length;
  return maxId + 1;
}

function selEmpleado(id) {
  const empleado = empleadosRef.value.find((e) => e.empleadoId === id);
  if (empleado) {
    nuevoEmpleado.value = { ...empleado };
  }
}

const borrarEmpleado = async (id) => {
  empleadosRef.value = await delEmpleados(id);
  Swal.fire({ icon: "success", title: "Empleado eliminado", text: "El empleado ha sido eliminado correctamente." });
}

const obtenerEmpleados = () => {
  getEmpleados().then((data) => {
    empleadosRef.value = data;
  });
  return empleadosRef.value;
}

const obtenerTareas = () => {
  getTareas().then((data) => {
    tareasRef.value = data;
  });
  return tareasRef.value;
}


function validaciones(empleado) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const reMovil = /^\d{9}$/;
  let esValido = true;

  if (!re.test(empleado.email)) {
    esValido = false;
  }
  if (!reMovil.test(empleado.movil)) {
    esValido = false;
  }
  if (!empleado.nombre.trim() || !empleado.apellidos.trim()) {
    esValido = false;
  }
  return esValido;
}

function limpiarFormulario() {
  nuevoEmpleado.value = {
    id: null,
    empleadoId: null,
    nombre: "",
    apellidos: "",
    email: "",
    movil: "",
    puesto: "",
  };
}

const imprimirListado = () => {
  const doc = new jsPDF();

  // Verificar si autoTable está disponible
  if (typeof doc.autoTable !== "function") {
    console.error("autoTable NO está disponible en esta instancia de jsPDF");
    return;
  }

  // Título del PDF
  doc.setFontSize(18);
  doc.text("Listado de Empleados", 14, 20);

  // Espacio para los datos de la tabla
  let y = 30;
  doc.setFontSize(12);

  // Definir los encabezados de la tabla
  const headers = ["ID","Nombre", "Apellidos", "Email", "Móvil", "Puesto"];

  // Generar tabla con los datos de empleados
  doc.autoTable({
    startY: y,
    head: [headers],
    body: empleadosRef.value.map(empleado => [
      empleado.empleadoId,
      empleado.nombre,
      empleado.apellidos,
      empleado.email,
      empleado.movil,
      empleado.puesto
    ]),
    theme: "striped",
    styles: { fontSize: 10, cellPadding: 3 }
  });

  // Guardar el PDF
  doc.save("listado_empleados.pdf");
}

const ORDEN_PRIORIDAD = { alta: 1, media: 2, baja: 3 };
const imprimirTareas = () => {

  const tareasEmpleado = tareasRef.value.filter(tarea => tarea.empleadoId === nuevoEmpleado.value.empleadoId);
  const tareasOrdenadas = [...tareasEmpleado].sort((a, b) => ORDEN_PRIORIDAD[a.prioridad.toLowerCase()] - ORDEN_PRIORIDAD[b.prioridad.toLowerCase()]);

  const doc = new jsPDF();

  // Verificar si autoTable está disponible
  if (typeof doc.autoTable !== "function") {
    console.error("autoTable NO está disponible en esta instancia de jsPDF");
    return;
  }

  // Título del PDF
  doc.setFontSize(18);
  doc.text(`Tareas asignadas a ${nuevoEmpleado.value.nombre} ${nuevoEmpleado.value.apellidos}`, 14, 20);

  // Espacio para los datos de la tabla
  let y = 30;
  doc.setFontSize(12);

    // Definir los encabezados de la tabla
  const headers = ["ID", "Título", "Prioridad", "Estado"];

  // Generar tabla con los datos de tareas
  doc.autoTable({
    startY: y,
    head: [headers],
    body: tareasOrdenadas.map(tarea => [
      tarea.id,
      tarea.titulo,
      tarea.prioridad,
      tarea.estado
    ]),
    theme: "striped",
    styles: { fontSize: 10, cellPadding: 3 }
  });

  // Guardar el PDF
  doc.save("tareas_empleado.pdf");


}
</script>

<style scoped></style>
