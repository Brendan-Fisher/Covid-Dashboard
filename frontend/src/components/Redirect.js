import React, { Component } from 'react';

class Redirect extends Component {
    constructor(props){
        super();
        this.state = {...props};
    }

    componentDidMount(){
        window.location = "https://github.com/Brendan-Fisher/Covid-Dashboard";
    }

    render() {
        return (<section>Redirecting...</section>);
    }
}

export default Redirect;