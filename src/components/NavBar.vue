<template>
  <nav class="navbar navbar-dark bg-primary sticky-top navbar-expand-lg">
    <div class="container-fluid">
      <!-- Marca o logo -->
      <router-link class="navbar-brand" to="/"
        ><img src="../assets/logo.svg" class="logo"
      /></router-link>



      <!-- Botón de hamburguesa en pantallas pequeñas -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Links de navegación -->
      <div
        class="collapse navbar-collapse justify-content-center"
        id="navbarNav"
      >
        <ul class="navbar-nav w-100 align-items-center">
          <li class="nav-item"><router-link class="nav-link" to="/">Inicio</router-link></li>
          <li class="nav-item"><router-link class="nav-link" to="/empleados">Empleados</router-link></li>
          <li class="nav-item"><router-link class="nav-link" to="/tareas">Tareas</router-link></li>
          <li class="nav-item"><router-link class="nav-link" to="/estadisticas">Estadísticas</router-link></li>
          <li class="nav-item"><router-link class="nav-link" to="/about">Quienes Somos</router-link></li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>


</script>

<style>
/*.navbar-dark .nav-link {color: rgba(255, 255, 255, 0.9);}

.navbar-dark .nav-link:hover, .navbar-dark .nav-link:focus {color: #fff;}
*/
/* Logo mantiene su tamaño relativo */
.logo {width: 40%; max-width: 120px;}

/* Desktop / medium+: usar el comportamiento por defecto de Bootstrap (fila horizontal) */
.collapse.navbar-collapse .navbar-nav {display: flex; gap: 0.5rem; justify-content: center; align-items: center;}

/* En pantallas pequeñas: grid de 2 columnas para los items del navbar (excepto logo) */
@media (max-width: 1000px) {
  .collapse.navbar-collapse .navbar-nav {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.35rem 0.5rem;
    justify-items: center;
    align-items: center;
    padding-left: 0; /* evita sangría del ul */
    margin-bottom: 0.5rem;
  }

  /* Hacer que cada link ocupe todo el ancho de su celda y esté centrado */
  .collapse.navbar-collapse .nav-link {
    width: 100%;
    text-align: center;
    padding-top: 0.45rem;
    padding-bottom: 0.45rem;
  }

  /* Ajuste del dropdown (acceso) para mantenerse a la derecha */
  .dropdown.ms-auto {margin-left: auto;}
}
</style>