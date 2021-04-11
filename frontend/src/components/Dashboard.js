import  React, { Component }from "react";
import { queryDatabase } from "../actions/sendQuery";
import './styles/Dashboard.css'; 
import { Accordion, Card } from 'react-bootstrap';
import TableView from './TableView';
import { Bar, Line } from 'react-chartjs-2';


function randomRGB(){
    var o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + 128 + ',' + .7 + ')';
}

async function sendQuery(query){
    var result = await queryDatabase(query);

    let labels = [];
    let data = [];
    let backgroundColors = [];

    for(var i = 0; i < result.rows.length; i++){
        labels.push(result.rows[i][0]);
        data.push(result.rows[i][1]);
        backgroundColors.push(randomRGB());
    }

    let datasets = [{
        label: query,
        fill: true,
        lineTension: .5,
        borderColor: 'rgba(0,0,0,1)',
        hoverBorderColor: 'rgba(255,99,132,1)',
        data: data,
        borderWidth: 2,
        backgroundColor: backgroundColors,
    }]
    
    let displayedData =  {
        labels: labels,
        datasets: datasets,
    }

    return displayedData;
}


class Dashboard extends Component {
    constructor(props){
        super(props)
        this.state = {
            queryResult: [],
            buildGraph: false,
            tupleCount: 0,
            graphData: {},
        }
    }

    async onSendQuery(query){
        let data = await sendQuery(query);
        this.setState({
            graphData: data,
            buildGraph: true
        })
    }

    onTupleCount = () =>{
        let sum = 0;

        queryDatabase("TupleCount")
            .then((res) => {
                let row = res.rows[0];
                for(var i = 0; i < res.rows.length; i++){
                    sum += row[i];
                }
                this.setState({
                    tupleCount: sum,
                })
            })
            .catch((err) => {
                console.log(err);
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
                                                <button onClick={() => this.onSendQuery("CasesBySex")} type="button" class="btn btn-outline-dark">Cases By Sex</button>
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                </Accordion>
                                <hr></hr>
                                <Accordion>
                                    <Card>
                                        <Accordion.Toggle as={Card.Header} eventKey="2">
                                            <button onClick={this.onTupleCount} type="button" class="btn btn-outline-dark">Get Number of Stored Tuples</button>
                                        </Accordion.Toggle>
                                        <Accordion.Collapse eventKey="2">
                                            <Card.Body>
                                                Total stored tuples: {this.state.tupleCount}
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                </Accordion>
                                <hr></hr>
                                <a style={{color: "black" }} href="/github" className="col-sm-4 col-md-3 mr-0 col-lg-2"><i className="fab fa-github fa-3x"></i></a>
                            </div>
                        </nav>
                        <main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4 bg-light">
                            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
                                <h1 className="h2">Query Result</h1>
                                <div className="btn-toolbar mb-2 mb-md-0">
                                    <div className="btn-group mr-2">
                                        <button className="btn btn-sm btn-outline-success">Download Result</button>
                                    </div>
                                </div>
                            </div>
                            <div id="chart">
                             <Bar data={this.state.graphData} options={{title:{display: false}, legend: {display:false}}} />
                            </div>
                            <div id="tableView" className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
                                <h2>Table View</h2>
                            </div>
                            <TableView data={this.state.queryResult} />
                        </main>
                    </div>
                </div>
            </div>
            
        )
    }
}

export default Dashboard;