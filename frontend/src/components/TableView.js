import React, { Component } from 'react'

class TableView extends Component {
    constructor(props){
        super(props)
        this.state = {
            data: this.props.data
        }
    }

    render() {
        return (
            <div className="table-responsive">
                <table className="table table-striped table-sm">
                    <thead>
                        <tr>
                            <th>Row #</th>
                            <th>Col 1</th>
                            <th>Col 2</th>
                        </tr>
                    </thead>
                </table>
            </div>
            
        )
    }
}

export default TableView;