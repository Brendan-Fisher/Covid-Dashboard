import axios from 'axios';
import React, { Component } from 'react';
import { CSVLink } from "react-csv";

const API_URL = "http://localhost:5000/api"

class QueryCSV extends Component {
    csvLink = React.createRef();
    state = {data: []}

    fetchData = async () => {
        await axios.get(API_URL + '/query/download')
            .then(data => {
                console.log(data);
                this.setState({ data: data.data }, () => {
                    this.csvLink.current.link.click()
                })
            })
    }

    render() {
        return (
            <div>
                <button onClick={this.fetchData} className="btn btn-sm btn-outline-success">Download Result</button>
                <CSVLink
                    data={this.state.data}
                    filename="query_result.csv"
                    className="hidden"
                    ref={this.csvLink}
                    target="_blank"
                />
                
            </div>
        )
    }
}

export default QueryCSV;