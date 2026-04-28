import axios from 'axios';

const API_URL = 'http://localhost:3000/tareas';

export const getTareas = async () => {
    const res = await axios.get(API_URL);
    return res.data;
}

export const addTareas = async (nuevaTarea) => {
    const res = await axios.post(API_URL, nuevaTarea);
    return res.data;
}

export const updateTareas = async (id, tareaActualizada) => {
    const res = await axios.patch(`${API_URL}/${id}`, tareaActualizada);
    return res.data;
}

export const delTareas = async (id) => {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
}