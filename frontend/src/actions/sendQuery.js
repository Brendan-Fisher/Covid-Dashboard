import axios from "axios";
const API_URL = "http://localhost:5000/api"

export async function queryDatabase(query){
    //console.log(query);
    let request = {
        query: query,
    }
    return axios   
        .post(API_URL + "/query", request)
        .then((result) => {
            //console.log(result.data)
            return result.data;
        })
}

export async function getDownload(){
    return axios.get(API_URL + '/query/download')
            .then(data => {
                return data;
            })
}

