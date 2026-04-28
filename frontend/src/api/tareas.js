import axios from 'axios';

const API_URL = 'http://localhost:3000/tareas';

export const getTareas = () => {
    return axios.get(API_URL).then((res) => res.data);
}

export const addTareas = (nuevaTarea) => {
    return axios.post(API_URL, nuevaTarea).then((res) => res.data);
}

export const updateTareas = (id, tareaActualizada) => {
    return axios.patch(`${API_URL}/${id}`, tareaActualizada).then((res) => res.data)
}

export const delTareas = (id) => {
    return axios.delete(`${API_URL}/${id}`).then((res) => res.data)
}