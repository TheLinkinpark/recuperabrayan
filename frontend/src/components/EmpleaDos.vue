<template>
  <div class="container mt-4 bg-light p-4 rounded">
    <h1>Gestión de Empleados</h1>

    <div>
      <form @submit.prevent="addEmpleado">
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

        <button type="submit" class="btn btn-primary mt-3">Añadir</button>
      </form>
    </div>

    <div class="table-responsive mt-4">
      <h4>Listado de empleados</h4>
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
          </tr>
        </thead>
        <tbody>
          <tr v-for="empleado in getEmpleados()" :key="empleado.id">
            <td class="text-center">{{ empleado.nombre }}</td>
            <td class="text-center">{{ empleado.apellidos }}</td>
            <td class="text-center">{{ empleado.email }}</td>
            <td class="text-center">{{ empleado.movil }}</td>
            <td class="text-center">{{ empleado.puesto }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

onMounted(() => {
  getEmpleados();
});

const nuevoEmpleado = ref({
  id: null,
  nombre: "",
  apellidos: "",
  email: "",
  movil: "",
  puesto: "",
});

let empleados = [
  {
    id: 1,
    nombre: "Juan",
    apellidos: "Pérez",
    email: "juanpe@example.com",
    movil: "123456789",
    puesto: "RRHH",
  },
  {
    id: 2,
    nombre: "María",
    apellidos: "García",
    email: "mariag@example.com",
    movil: "987654321",
    puesto: "contabilidad",
  },
];

const empleadosRef = ref(empleados);


const addEmpleado = () => {
  if (!validaciones(nuevoEmpleado.value)) {
    alert("Por favor, corrija los errores en el formulario.");
    return;
  }
  // Generar ID automático
  nuevoEmpleado.value.id = generarId();
  empleadosRef.value.push(nuevoEmpleado.value);
  //console.log(empleados);
  limpiarFormulario();
};

function generarId() {
  // Obtener el ID máximo actual y sumar 1
  const maxId = empleadosRef.value.length > 0 ? Math.max(...empleadosRef.value.map((e) => e.id)) : 0;
  return maxId + 1;
}

function selEmpleado() {}

function delEmpleado() {}

function getEmpleados() {
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
    nombre: "",
    apellidos: "",
    email: "",
    movil: "",
    puesto: "",
  };
}
</script>

<style scoped></style>
