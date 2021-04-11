import  React, { Component }from "react";
import { queryDatabase } from "../actions/sendQuery";
import './styles/Dashboard.css'; 
import { Accordion, Card } from 'react-bootstrap';
import { Bar, Line } from 'react-chartjs-2';
import { buildGraphData, buildTable } from './functions';
import { CSVLink } from "react-csv";
import QueryCSV from './QueryCSV';

async function sendQuery(query){
    var result = await queryDatabase(query);

    var userQuery = result.query;
    var graphData = buildGraphData(result.result);
    var table = buildTable(result.result);

    return {graphData, table, userQuery};
}


class Dashboard extends Component {
    constructor(props){
        super(props)
        this.state = {
            queryResult: [],
            buildGraph: false,
            tupleCount: 0,
            graphData: {},
            table: <div></div>,
            startDate: "",
            endDate: "",
            stateOne: "Nationwide",
            stateTwo: "Nationwide",
            query: " ",
        }
    }

    async onSendQuery(query){
        this.setState({query : query})
        let data = await sendQuery(query);
       
        this.setState({
            graphData: data.graphData,
            table: data.table,
            buildGraph: true,
            query: data.userQuery,
        })
    }

    onTupleCount = () =>{
        let sum = 0;

        queryDatabase("TupleCount")
            .then((res) => {
                let row = res.result.rows[0];
                for(var i = 0; i < row.length; i++){
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

    onChange = (e) => {
        this.setState({ [e.target.id]: e.target.value });
    }

    onSelectState = (e) => {
        this.setState({[e.target.id] : e.target[e.target.options.selectedIndex].label})
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
                                <h4>Welcome to the Covid-19 Trend Dashboard</h4>
                                <hr />
                                <h6>To begin, select a range of dates to query and two states to compare. If you don't want to compare states, simply select the same state for both options</h6>
                                <hr />
                                <label style={{ marginRight: "1rem" }} for="start">Start Date: </label>
                                <input onChange={this.onChange} type="date" id="startDate" value={this.state.startDate} name="query-start" min="2020-01-01" max="2021-03-16"></input>
                                <br />
                                <br />
                                <label style={{ marginRight: "1rem" }} for="start">End Date: </label>
                                <input onChange={this.onChange} type="date" id="endDate" value={this.state.endDate} name="query-end" min={this.state.startDate} max="2021-03-16"></input>
                                <hr />
                                <label>Compare States:</label><br/>
                                <select id="stateOne" onChange={this.onSelectState}>
                                    <option value="Nationwide">Nationwide</option>
                                    <option value="AL">Alabama</option>
                                    <option value="AK">Alaska</option>
                                    <option value="AZ">Arizona</option>
                                    <option value="AR">Arkansas</option>
                                    <option value="CA">California</option>
                                    <option value="CO">Colorado</option>
                                    <option value="CT">Connecticut</option>
                                    <option value="DE">Delaware</option>
                                    <option value="DC">District Of Columbia</option>
                                    <option value="FL">Florida</option>
                                    <option value="GA">Georgia</option>
                                    <option value="HI">Hawaii</option>
                                    <option value="ID">Idaho</option>
                                    <option value="IL">Illinois</option>
                                    <option value="IN">Indiana</option>
                                    <option value="IA">Iowa</option>
                                    <option value="KS">Kansas</option>
                                    <option value="KY">Kentucky</option>
                                    <option value="LA">Louisiana</option>
                                    <option value="ME">Maine</option>
                                    <option value="MD">Maryland</option>
                                    <option value="MA">Massachusetts</option>
                                    <option value="MI">Michigan</option>
                                    <option value="MN">Minnesota</option>
                                    <option value="MS">Mississippi</option>
                                    <option value="MO">Missouri</option>
                                    <option value="MT">Montana</option>
                                    <option value="NE">Nebraska</option>
                                    <option value="NV">Nevada</option>
                                    <option value="NH">New Hampshire</option>
                                    <option value="NJ">New Jersey</option>
                                    <option value="NM">New Mexico</option>
                                    <option value="NY">New York</option>
                                    <option value="NC">North Carolina</option>
                                    <option value="ND">North Dakota</option>
                                    <option value="OH">Ohio</option>
                                    <option value="OK">Oklahoma</option>
                                    <option value="OR">Oregon</option>
                                    <option value="PA">Pennsylvania</option>
                                    <option value="RI">Rhode Island</option>
                                    <option value="SC">South Carolina</option>
                                    <option value="SD">South Dakota</option>
                                    <option value="TN">Tennessee</option>
                                    <option value="TX">Texas</option>
                                    <option value="UT">Utah</option>
                                    <option value="VT">Vermont</option>
                                    <option value="VA">Virginia</option>
                                    <option value="WA">Washington</option>
                                    <option value="WV">West Virginia</option>
                                    <option value="WI">Wisconsin</option>
                                    <option value="WY">Wyoming</option>
                                </select>				
                                <br />
                                <label>vs.</label>
                                <br />
                                <select id="stateTwo" onChange={this.onSelectState}>
                                    <option value="Nationwide">Nationwide</option>
                                    <option value="AL">Alabama</option>
                                    <option value="AK">Alaska</option>
                                    <option value="AZ">Arizona</option>
                                    <option value="AR">Arkansas</option>
                                    <option value="CA">California</option>
                                    <option value="CO">Colorado</option>
                                    <option value="CT">Connecticut</option>
                                    <option value="DE">Delaware</option>
                                    <option value="DC">District Of Columbia</option>
                                    <option value="FL">Florida</option>
                                    <option value="GA">Georgia</option>
                                    <option value="HI">Hawaii</option>
                                    <option value="ID">Idaho</option>
                                    <option value="IL">Illinois</option>
                                    <option value="IN">Indiana</option>
                                    <option value="IA">Iowa</option>
                                    <option value="KS">Kansas</option>
                                    <option value="KY">Kentucky</option>
                                    <option value="LA">Louisiana</option>
                                    <option value="ME">Maine</option>
                                    <option value="MD">Maryland</option>
                                    <option value="MA">Massachusetts</option>
                                    <option value="MI">Michigan</option>
                                    <option value="MN">Minnesota</option>
                                    <option value="MS">Mississippi</option>
                                    <option value="MO">Missouri</option>
                                    <option value="MT">Montana</option>
                                    <option value="NE">Nebraska</option>
                                    <option value="NV">Nevada</option>
                                    <option value="NH">New Hampshire</option>
                                    <option value="NJ">New Jersey</option>
                                    <option value="NM">New Mexico</option>
                                    <option value="NY">New York</option>
                                    <option value="NC">North Carolina</option>
                                    <option value="ND">North Dakota</option>
                                    <option value="OH">Ohio</option>
                                    <option value="OK">Oklahoma</option>
                                    <option value="OR">Oregon</option>
                                    <option value="PA">Pennsylvania</option>
                                    <option value="RI">Rhode Island</option>
                                    <option value="SC">South Carolina</option>
                                    <option value="SD">South Dakota</option>
                                    <option value="TN">Tennessee</option>
                                    <option value="TX">Texas</option>
                                    <option value="UT">Utah</option>
                                    <option value="VT">Vermont</option>
                                    <option value="VA">Virginia</option>
                                    <option value="WA">Washington</option>
                                    <option value="WV">West Virginia</option>
                                    <option value="WI">Wisconsin</option>
                                    <option value="WY">Wyoming</option>
                                </select>				
                                <hr />
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
                                                <hr></hr>
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
                                <h1 className="h2">Graph View</h1>
                                <h5 className="h6">Query: {this.state.query}</h5>
                                <div className="btn-toolbar mb-2 mb-md-0">
                                    <div className="btn-group mr-2">
                                        {this.state.buildGraph &&
                                            <QueryCSV />
                                        }
                                        
                                    </div>
                                </div>
                            </div>
                            <div id="chart">
                             <Bar data={this.state.graphData} options={{maintainAspectRation: true, title:{display: false}, legend: {display:false}}} />
                            </div>
                            <div id="tableView" className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
                                <h2>Table View</h2>
                            </div>
                            {this.state.table}
                        </main>
                    </div>
                </div>
            </div>
            
        )
    }
}

export default Dashboard;