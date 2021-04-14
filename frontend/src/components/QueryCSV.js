import React, { Component } from 'react';
import { CSVLink } from "react-csv-2";
import { getDownload } from '../actions/sendQuery';

async function getDownloadCSV(){
    var data = await getDownload();
    return data;
}

class QueryCSV extends Component {
    constructor(props){
        super(props)
        this.state = {
            data: [],
        }
        this.fetchData = this.fetchData.bind(this);
        this.csvLink = React.createRef();
    }
   
    async fetchData() {
        let data = await getDownloadCSV()

        console.log(data)
        this.setState({ data: data.data }, () => {
            this.csvLink.current.link.click();
        })
        console.log(this.state);
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