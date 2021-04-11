import axios from "axios";
const API_URL = "http://localhost:5000/api"

export async function queryDatabase(query){
    return axios   
        .post(API_URL + "/query", query)
        .then((result) => {
            return result.data.rows;
        })
}

