import axios from 'axios';

const API_URL = 'http://localhost:3000/empleados';

export const getEmpleados = async () => {
    const res = await axios.get(API_URL);
    return res.data;
}

export const addEmpleados = async (nuevoEmpleado) => {
    const res = await axios.post(API_URL, nuevoEmpleado);
    return res.data;
}

export const updateEmpleados = async (id, empleadoActualizado) => {
    const res = await axios.patch(`${API_URL}/${id}`, empleadoActualizado);
    return res.data;
}

export const delEmpleados = async (id) => {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
}