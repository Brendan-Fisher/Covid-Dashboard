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
                    <div id="box" className="col">
                        Hello
                    </div>
                </div>
            </div>
        )
    }
}

export default Landing;