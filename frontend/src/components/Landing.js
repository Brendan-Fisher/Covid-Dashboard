import  React, { Component }from "react";
import { queryDatabase } from "../actions/sendQuery";
import './styles/Landing.css'; 
import { Link } from 'react-router-dom';

class Landing extends Component {
    constructor(props){
        super(props)
        this.state = {
            queryResult: []
        }
    }

    onSendQuery = (query) => {
        queryDatabase("SELECT SEX FROM CDC WHERE SEX = 'Male' OR SEX = 'Female' OR SEX = 'Unknown'")
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
                        
                    </div>
                </div>
            </div>
        )
    }
}

export default Landing;