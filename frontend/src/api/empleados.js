import axios from 'axios';

const API_URL = 'http://localhost:3000/empleados';

export const getEmpleados = () => {
    return axios.get(API_URL).then((res) => res.data);
}

export const addEmpleados = (nuevoEmpleado) => {
    return axios.post(API_URL, nuevoEmpleado).then((res) => res.data);
}

export const updateEmpleados = (id, empleadoActualizado) => {
    return axios.patch(`${API_URL}/${id}`, empleadoActualizado).then((res) => res.data)
}

export const delEmpleados = (id) => {
    return axios.delete(`${API_URL}/${id}`).then((res) => res.data)
}