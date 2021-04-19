export function buildBarData(input){
    let labels = [];
    let data = [];
    let backgroundColors = [];

    console.log(input)

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

export function buildDoubleAxis(input){
    console.log(input)
    let labels = [];
    let borderColors = [];
    let sets = [input.result.metaData[1].name, input.result.metaData[2].name];

    for(var i = 0; i < 2; i++){
        borderColors.push(randomRGB());
    }

    for(var i = 0; i < input.result.rows.length; i++){
        if(labels.indexOf(input.result.rows[i][0]) === -1) {
            labels.push(input.result.rows[i][0]);
        }
    }

    var sorted = labels.sort();

    console.log(sorted)

    let datasets = [];

    for(var k = 0; k < sets.length; k++){
        let data = [];
        for(var i = 0; i < sorted.length; i++){
            for(var j = 0; j < input.result.rows.length; j++){
                if(input.result.rows[j][0] === sorted[i]){
                    data.push(input.result.rows[j][k+1]);
                }
            }
        }
        
        datasets.push({
            label: sets[k],
            data: data,
            fill: true,
            borderColor: borderColors[k],
            backgroundColor: borderColors[k],
            yAxisID:`y${k+1}`,
        })
    }

    let displayedData = {
        labels: sorted,
        datasets: datasets,
    }


    return displayedData;

}

export function buildLineData(input){
    console.log(input)
    let labels = [];
    let sets = [];
    let borderColors = [];

    for(var i = 0; i < input.sets; i++){
        borderColors.push(randomRGB());
    }

    for(var i = 0; i < input.result.rows.length; i++){
        if(sets.indexOf(input.result.rows[i][1]) === -1) {
            sets.push(input.result.rows[i][1]);
        }
    }

    console.log("Sets: " + sets)

    for(var i = 0; i < input.result.rows.length; i++){
        if(labels.indexOf(input.result.rows[i][0]) === -1) {
            labels.push(input.result.rows[i][0]);
        }
    }


    function formatDate(date) {
        let parts = date.split("-");
        /*
        if(parts[0].length === 4){
            return `${parts[0]}-${parts[1]}`
        }
        else
        */ 
        return `${parts[1]}-${parts[0]}`;
    }

    var sorted = labels.map(formatDate).sort().map(formatDate);

    let datasets = [];

    for(var k = 0; k < sets.length; k++){
        let data = [];
        for(var i = 0; i < sorted.length; i++){
            for(var j = 0; j < input.result.rows.length; j++){
                if(input.result.rows[j][1] === sets[k] && input.result.rows[j][0] === sorted[i]){
                    data.push(input.result.rows[j][2]);
                }
            }
        }
        
        datasets.push({
            label: sets[k],
            data: data,
            fill: true,
            borderColor: borderColors[k],
            backgroundColor: borderColors[k],
        })
    }

    let displayedData = {
        labels: sorted,
        datasets: datasets,
    }


    return displayedData;
}

export function buildSingleState(input){
    console.log(input);

    let labels = [];
    let sets = [input.result.metaData[1].name, input.result.metaData[2].name];
    let borderColors = [];

    for(var i = 0; i < sets.length; i++){
        borderColors.push(randomRGB());
    }

    for(var i = 0; i < input.result.rows.length; i++){
        if(labels.indexOf(input.result.rows[i][0]) === -1) {
            labels.push(input.result.rows[i][0]);
        }
    }

    function formatDate(date) {
        let parts = date.split("-");
        /*
        if(parts[0].length === 4){
            return `${parts[0]}-${parts[1]}`
        }
        else 
        */
        return `${parts[1]}-${parts[0]}`;
    }

    var sorted = labels.map(formatDate).sort().map(formatDate);

    let datasets = [];

    for(var k = 0; k < sets.length; k++){
        let data = [];
        for(var i = 0; i < sorted.length; i++){
            for(var j = 0; j < input.result.rows.length; j++){
                if(input.result.rows[j][0] === sorted[i]){
                    data.push(input.result.rows[j][k+1]);
                }
            }
        }
        
        datasets.push({
            label: sets[k],
            data: data,
            fill: true,
            borderColor: borderColors[k],
            backgroundColor: borderColors[k],
        })
    }

    let displayedData = {
        labels: sorted,
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