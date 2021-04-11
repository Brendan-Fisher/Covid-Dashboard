import  React, { Component }from "react";
import { queryDatabase } from "../actions/sendQuery";
import './styles/Landing.css'; 

class Landing extends Component {
    constructor(props){
        super(props)
        this.state = {
            queryResult: []
        }
    }

    onSendQuery = (query) => {
        queryDatabase("SELECT COUNT(*) FROM CDC")
            .then((res) => {
                this.setState({
                    queryResult: res,
                })
            });  
    }

    render() {
        return (
            <div id="container" className="container">
                <div id="content" className="row">
                    <button onClick={this.onSendQuery}>Get Tuple Count</button>
                    <h1>{this.state.queryResult}</h1>
                </div>
            </div>
        )
    }
}

export default Landing;