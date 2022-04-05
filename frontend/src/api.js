import axios from 'axios';

const uri = 'http://localhost:3001/api';

const api = axios.create({
    baseURL: uri
});

export async function login(username, pwd) {
    console.log(username);
    return new Promise((resolve, reject) => {
        console.log(pwd);
        api.post(`/login`, { username: username, pwd: pwd}).then((response) => {
            console.log(response);
            resolve(response.data);
        }).catch(err => {
            console.log(err);
            reject(err);
        });
    });
}

export async function getFavoriteStops(username) {
    return new Promise((resolve, reject) => {
        api.post(`/get_favorite_stops`, { username: username}).then(response => {
            resolve(response.data);
        })
    })
}

export async function updatePwd(username, pwd) {
    return new Promise((resolve, reject) => {
        api.put(`/update_pwd`, { username: username, pwd: pwd}).then(response => {
            resolve(response.data);
        })
    })
}

export async function deleteFavoriteStop(username, stopID) {
    return new Promise((resolve, reject) => {
        api.post(`/delete_favorite_stop`, { username: username, stopID: stopID}).then(response => {
            resolve(response);
        })
    });
}

export async function insertFavoriteStop(username, stopID) {
    return new Promise((resolve, reject) => {
        api.put(`/insert_favorite_stop`, { username: username, stopID: stopID}).then(response => {
            resolve(response);
        })
    });
}

export async function getStops(query) {
    return new Promise((resolve, reject) => {
        api.get(`/get_stops?keyword=${query}`).then(response => {
            resolve(response);
        })
    });
}

export async function advanceQuery1() {
    return new Promise((resolve, reject) => {
        api.get(`/advance_query_1`).then(response => {
            resolve(response);
        })
    });
}

export async function advanceQuery2() {
    return new Promise((resolve, reject) => {
        api.get(`/advance_query_2`).then(response => {
            resolve(response);
        })
    });
}

