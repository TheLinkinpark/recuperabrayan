<template>
  <div class="container-fluid mt-4 bg-light p-4 rounded">
    <h3 class="text-center my-1 bg-primary-subtle py-1 mb-3">Gestión de Empleados</h3>

    <div class="row g-4">
      <!-- Columna Izquierda: Formulario -->

      <div class="col-12 col-xl-5">
        <div class="card border-0 shadow-sm rounded-4">
          <div class="card-body p-4">
            <div class="dflex justify-content-between align-items-center mb-3">
              <h4>{{ nuevoEmpleado.id ? "Editar Empleado" : "Nuevo Empleado" }}</h4>
            </div>

        <form @submit.prevent="guardarEmpleado">
          <label for="nombre" class="form-label">Nombre: </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            class="form-control"
            v-model="nuevoEmpleado.nombre"
            required
          />

          <label for="apellidos" class="form-label">Apellidos</label>
          <input
            type="text"
            id="apellidos"
            name="apellidos"
            class="form-control"
            v-model="nuevoEmpleado.apellidos"
            required
          />

          <label for="email" class="form-label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            class="form-control"
            v-model="nuevoEmpleado.email"
            required
          />

          <label for="movil" class="form-label">Móvil</label>
          <input
            type="tel"
            id="movil"
            name="movil"
            class="form-control"
            v-model="nuevoEmpleado.movil"
            required
          />

          <label for="puesto" class="form-label">Puesto</label>
          <select
            id="puesto"
            name="puesto"
            class="form-select"
            v-model="nuevoEmpleado.puesto"
            required
          >
            <option value="RRHH">RRHH</option>
            <option value="contabilidad">Contabilidad</option>
            <option value="almacen">Almacén</option>
            <option value="ventas">Ventas</option>
          </select>

          <div class="d-flex flex-wrap gap-2 mt-4 justify-content-center">
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

onMounted(() => {
  obtenerEmpleados();
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
</script>

<style scoped></style>
