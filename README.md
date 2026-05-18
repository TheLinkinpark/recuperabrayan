# Vue 3 + Vite

* Nombre del proyecto: Brayan Macedo Barbosa
* Tecnologías Aplicadas: Vue 3 + Vite + vue-router, json-server, axios, bootstrap, jspdf
* Versión de node: v24.14.0

## Instrucciones de instalación:
1. Clonar repositorio
    - git clone https://github.com/TheLinkinpark/recuperabrayan.git
    - cd mi-proyecto

2. Instalar dependencias
    - npm install

3. Arrancar App
    - npm start

4. Ver en navegador
    - http://localhost:5173

## Backend de Stripe

El servidor Express de Stripe escucha en `http://localhost:5000` y se arranca junto con Vite y `json-server` mediante `npm start`.
Recuerda definir `STRIPE_SECRET_KEY` en un archivo `.env` en la raíz del proyecto para que el checkout funcione.
