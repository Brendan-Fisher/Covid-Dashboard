export function buildGraphData(input){
    let labels = [];
    let data = [];
    let backgroundColors = [];

    for(var i = 0; i < input.rows.length; i++){
        labels.push(input.rows[i][0]);
        data.push(input.rows[i][1]);
        backgroundColors.push(randomRGB());
    }

    let datasets = [{
        label: 'Value',
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

export function buildTable(input){
    let headers = [];
    let rows = [];

    headers.push("Row #");
    for(var i = 0; i < input.metaData.length; i++){
        headers.push(input.metaData[i].name);
    }
    // eslint-disable-next-line
    for(var i = 0; i < input.rows.length; i++){
        input.rows[i].unshift(i+1);
        rows.push(input.rows[i]);
    }

    let tableData = {
        
        headers: headers,
        rows: rows,
    }

    return (
        <div className="table-responsive">
            <table className="table table-striped table-light table-hover table-responsive">
                <thead>
                    <tr>
                        {tableData.headers.map((header) => 
                            <th>{header.toLowerCase()}</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {tableData.rows.map((row) => 
                        <tr>
                            {
                            row.map((col)=> 
                                <td>{col}</td>
                            )
                            }
                        </tr>
                    )}
                </tbody>
            </table>
        </div>  
    )
}

function randomRGB(){
    var o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + 128 + ',' + .7 + ')';
}