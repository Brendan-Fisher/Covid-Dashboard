import  React, { Component }from "react";
import { queryDatabase } from "../actions/sendQuery";
import './styles/Dashboard.css'; 
import { Accordion, Card } from 'react-bootstrap';
import { Bar, Line, Radar } from 'react-chartjs-2';
import { buildBarData, buildLineData, buildSingleState, buildDoubleAxis, buildTable } from './functions';
import QueryCSV from './QueryCSV';

async function sendQuery(query){
    var result = await queryDatabase(query);
    console.log(result.result);

    var userQuery = result.query;
    var graphData = {};

    if(query.type === "singleState"){
        graphData = buildSingleState(result);
    }
    else if(query.type === "doubleAxis"){
        graphData = buildDoubleAxis(result);
    }
    else if(query.type === "line"){
        graphData = buildLineData(result);
    }
    else {
        console.log("building bar data")
        graphData = buildBarData(result.result);
    }

    console.log(graphData);
    
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
            graph: <Bar data={[]} options={{maintainAspectRatio: true, title:{display: false}, legend: {display:false}}} />,
            table: <div></div>,
            startDate: "2020-01-01",
            endDate: "2021-02-13",
            stateOne: "Alabama",
            stateTwo: "Alabama",
            singleState: "Alabama",
            query: " ",
            type: "bar"
        }
    }

    async onSendQuery(query){
        this.setState({query : "Loading Query Result"})
        let request = {
            query: query,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            stateOne: this.state.stateOne,
            stateTwo: this.state.stateTwo,
            singleState: this.state.singleState,
            type: '',
        }



        if(request.query === "TestResultRatio" || request.query === "HospitalizedICURatio"){
            console.log("setting single state")
            this.setState({type:"singleState"});
            request.type = "singleState";
        }
        else if(request.query === "PositiveUniqueRatio"){
            console.log("setting doubleaxis")
            this.setState({type: "doubleAxis"})
            request.type = "doubleAxis";
        }
        else if(request.startDate !== "" || request.endDate !== "2021-02-13"){
            if(request.startDate.substring(0,6) === request.endDate.substring(0,6)){
                console.log("setting bar graph")
                request.query += "OnDay";
                this.setState({
                    type: "bar",
                })
                request.type = "bar"
            }
            else {
                console.log("setting line graph")
                request.query += "OverTime";
                this.setState({
                    type: "line",
                })
                request.type = "line"
            }            
        }

        let data = await sendQuery(request);
       
        this.setState({ 
            graphData: data.graphData,
            table: data.table,
            buildGraph: true,
            query: data.userQuery,
        })

        if(this.state.type === "line" || this.state.type === "singleState"){
            console.log("setting line graph")
            this.setState({
                graph: <Line data={this.state.graphData} options={{maintainAspectRatio: true, title:{display: false}, legend: {display:true}}} />
            })
        }
        else if(this.state.type === "doubleAxis"){
            this.setState({
                graph: <Line data={this.state.graphData} options={{scales: {yAxes: [{type: 'linear', display: true, position: 'left', id: 'y1'}, {type: 'linear', display: true, position: 'right', id: 'y2'}]}, maintainAspectRatio: true, title:{display: false}, legend: {display:true}}} />
            })
        }
        else {
            this.setState({
                graph: <Bar data={this.state.graphData} options={{maintainAspectRatio: true, title:{display: false}, legend: {display:false}}} />,
            })
        }
    }

    onTupleCount = () =>{
        let sum = 0;

        let query = {query: "TupleCount"};
        queryDatabase(query)
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
                <nav className="navbar navbar-dark sticky-top bg-primary flex-md-nowrap p-0">
                    <a className="navbar-brand col-sm-4 col-md-3 mr-0 col-lg-2" href="/">Covid-19 Dashboard</a>
                    <text className="nav-item">Brendan Fisher, Anna Le, Samantha Martinez, Alex Kim </text>
                </nav>
                <div className="container-fluid">
                    <div className="row">
                        <nav className="col-md-3 col-lg-2 d-none d-md-block bg-light sidebar">
                            <div className="sidebar-sticky">
                                <h4>Welcome to the Covid-19 Trend Dashboard</h4>
                                <hr />
                                <h6>To begin, select a range of dates to query and choose whether you'd like to see national trends or state trends</h6>
                                <hr />
                                <label style={{ marginRight: "1rem" }} for="start">Start Date: </label>
                                <input onChange={this.onChange} type="date" id="startDate" value={this.state.startDate} name="query-start" min="2020-01-01" max="2021-02-13"></input>
                                <br />
                                <br />
                                <label style={{ marginRight: "1rem" }} for="start">End Date: </label>
                                <input onChange={this.onChange} type="date" id="endDate" value={this.state.endDate} name="query-end" min={this.state.startDate} max="2021-02-13"></input>			
                                <h6>To analyze data for a specific date, select the same date for start and end. If no graph appears, it is likely there is no data on that date and you should pick a nearby date.</h6>
                                <hr />
                                <Accordion>
                                    <Card>
                                        <Accordion.Toggle as={Card.Header} eventKey="0">
                                            National Trends
                                        </Accordion.Toggle>
                                        <Accordion.Collapse eventKey="0">
                                            <Card.Body>
                                                These trend queries represent Covid-19 trends nationally using data from the CDC.
                                                <hr />
                                                <button onClick={() => this.onSendQuery("CasesBySex")} type="button" class="btn btn-outline-info">Cases By Sex</button>
                                                <button onClick={() => this.onSendQuery("CasesByEthnicity")} type="button" class="btn btn-outline-info">Cases By Ethnicity</button>
                                                <button onClick={() => this.onSendQuery("CasesByAge")} type="button" class="btn btn-outline-info">Cases By Age Group</button>
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                    <Card>
                                        <Accordion.Toggle as={Card.Header} eventKey="1">
                                            Compare States
                                        </Accordion.Toggle>
                                        <Accordion.Collapse eventKey="1">
                                            <Card.Body>
                                                These trend queries represent Covid-19 trends by state. To compare two states, select two different states, to only view trends from a single state, select the same state for both choices. 
                                                <hr />
                                                <select id="stateOne" onChange={this.onSelectState}>
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
                                                <button onClick={() => this.onSendQuery("PopPositiveRatio")} type="button" class="btn btn-outline-info">% of Population Positive</button>
                                                <button onClick={() => this.onSendQuery("PopDeathRatio")} type="button" class="btn btn-outline-info">% of Population Dead</button>
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                    <Card>
                                        <Accordion.Toggle as={Card.Header} eventKey="2">
                                            Individual States
                                        </Accordion.Toggle>
                                        <Accordion.Collapse eventKey="2">
                                            <Card.Body>
                                                These trend queries represent Covid-19 trends by state. Specifically, these queries intra-state comparisons about Covid-19 cases, tests, and outcomes 
                                                <hr />
                                                <select id="singleState" onChange={this.onSelectState}>
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
                                                <button onClick={() => this.onSendQuery("TestResultRatio")} type="button" class="btn btn-outline-info">Test Result Ratio</button>
                                                <button onClick={() => this.onSendQuery("HospitalizedICURatio")} type="button" class="btn btn-outline-info">Ratio of Hospitalized In ICU</button>
                                                <button onClick={() => this.onSendQuery("PositiveUniqueRatio")} type="button" class="btn btn-outline-info">Ratio of Positive Tests which are Unique</button>
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                </Accordion>
                                <hr></hr>
                                <Accordion>
                                    <Card>
                                        <Accordion.Toggle as={Card.Header} eventKey="3">
                                            <button onClick={this.onTupleCount} type="button" class="btn btn-outline-info">Get Number of Stored Tuples</button>
                                        </Accordion.Toggle>
                                        <Accordion.Collapse eventKey="3">
                                            <Card.Body>
                                                Total stored tuples: {this.state.tupleCount}
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                </Accordion>
                                <hr></hr>
                                <a style={{color: "bg-info" }} href="/github" className="col-sm-4 col-md-3 mr-0 col-lg-2"><i className="fab fa-github fa-3x"></i></a>
                            </div>
                        </nav>
                        <main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4 bg-light">
                            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
                                <h1 className="h2">Graph View</h1>
                                <h5 className="h6" style={{maxWidth: "800px"}}>Query: <code>{this.state.query}</code></h5>
                                <div className="btn-toolbar mb-2 mb-md-0">
                                    <div className="btn-group mr-2">
                                        {this.state.buildGraph &&
                                            <QueryCSV />
                                        }
                                        
                                    </div>
                                </div>
                            </div>
                            <div id="chart">
                                {this.state.graph}
                            </div>
                            <div id="tableView" className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
                                <h2>Table View</h2>
                            </div>
                            <div id="table">
                                {this.state.table}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
            
        )
    }
}

export default Dashboard;