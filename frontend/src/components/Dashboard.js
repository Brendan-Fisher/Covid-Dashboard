import  React, { Component }from "react";
import { queryDatabase } from "../actions/sendQuery";
import './styles/Dashboard.css'; 
import { Accordion, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class Landing extends Component {
    constructor(props){
        super(props)
        this.state = {
            queryResult: []
        }
    }

    onSendQuery = (query) => {
        queryDatabase("\"SELECT SEX, COUNT(SEX) FROM CDC WHERE SEX = 'Male' OR SEX = 'Female' OR SEX = 'Unknown' GROUP BY SEX\"")
            .then((res) => {
                this.setState({
                    queryResult: res,
                })
            })
            .catch((err) => {
                console.log(err)
            }) 
    }

    render() {
        return (
            <div>
                <nav className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0">
                    <a className="navbar-brand col-sm-4 col-md-3 mr-0 col-lg-2" href="/">Covid-19 Dashboard</a>
                    <text className="nav-item">Brendan Fisher, Anna Le, Samantha Martinez, Alex Kim </text>
                </nav>
                <div className="container-fluid">
                    <div className="row">
                        <nav className="col-md-3 col-lg-2 d-none d-md-block bg-light sidebar">
                            <div className="sidebar-sticky">
                                <h4>Welcome to the Covid-19 Dashboard</h4>
                                <hr></hr>
                                <h6>To begin, select a category you wish to analyze, then select a state and range of dates to narrow your analysis</h6>
                                <hr></hr>
                                <Accordion>
                                    <Card>
                                        <Accordion.Toggle as={Card.Header} eventKey="0">
                                            Testing Trends
                                        </Accordion.Toggle>
                                        <Accordion.Collapse eventKey="0">
                                            <Card.Body>
                                            Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                    <Card>
                                        <Accordion.Toggle as={Card.Header} eventKey="1">
                                            Case Trends
                                        </Accordion.Toggle>
                                        <Accordion.Collapse eventKey="1">
                                            <Card.Body>
                                            Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                </Accordion>
                                <hr></hr>
                                <a style={{color: "black" }} href="/github" className="col-sm-4 col-md-3 mr-0 col-lg-2"><i className="fab fa-github fa-3x"></i></a>
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
            
        )
    }
}

export default Landing;