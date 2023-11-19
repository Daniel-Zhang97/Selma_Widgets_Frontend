// Generating the names report
document.addEventListener('DOMContentLoaded', () => {
    filterOptions['generateReport'] = true;
    const filterOptionsJSON = JSON.stringify(filterOptions);


    // Fetch data using asynchronous request
    fetch('http://localhost:8001/request', {
        method: 'POST',
        body: filterOptionsJSON,
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);

            let htmlContent = '';
            htmlContent += ' <div id="revenue-report-name-id-bar">' +
                              '<div>Student ID</div> <div> Name</div> <div class="w-10">show/hide <i class="fa-solid fa-angles-down"></i></div>' +
                               '</div>';

            for (let studentId in data) {
                let studentData = data[studentId];

                htmlContent += `<div
                <div class="generic-row student-row">   
                    <div> # ${studentData.id} </div> 
                    <div> ${studentData.firstname} ${studentData.surname} </div>
                    <div class="w-10">show/hide <i class="fa-solid fa-angles-down"></i></div>
                </div>
                <div class="show">`;

                for (let enrolmentNumber in studentData.enrolments) {
                    let enrolmentData = studentData.enrolments[enrolmentNumber];

                    htmlContent += `<div>
                        <div class="generic-bar" >
                            <div>Enrolment Number - </div> 
                            <div>Enrolment Time - </div>
                            <div class="w-10"></div>
                        </div>
                        <div class="generic-row"> 
                            <div># ${enrolmentNumber}</div> 
                            <div>${enrolmentData.enrolment_date}</div>
                            <div class="w-10">show/hide <i class="fa-solid fa-angles-down"></i></div>
                        </div>`;

                    for (let headerNumber in enrolmentData.invoice_headers) {
                        let headerData = enrolmentData.invoice_headers[headerNumber];

                        if(headerData.balance < 0) {
                            htmlContent += `<div class="show">
                        <div class="generic-bar-2" >
                            <div>Header Number - </div> 
                            <div>Total Due: </div>
                            <div>Remaining Balance: </div>
                            <div class="w-10"></div>
                        </div>
                        <div class="generic-row-2">
                            <div># ${headerNumber}</div>
                            <div> $${headerData.amount}</div>
                            <div>-$${Math.abs(headerData.balance)} (Overpaid)</div>
                            <div class="w-10"> show/hide <i class="fa-solid fa-angles-down"></i></div>
                        </div>
                        <div class="show">
                        <div class="generic-bar-2"> 
                            <div>Invoice Line Number:</div>
                            <div>Payment Date:</div>
                            <div>Amount:</div>
                            <div class="w-10"></div>
                        </div>`;

                        } else {
                            htmlContent += `<div class="show">
                        <div class="generic-bar-2" >
                            <div>Header Number - </div> 
                            <div>Total Due: </div>
                            <div>Remaining Balance: </div>
                            <div class="w-10"></div>
                        </div>
                        <div class="generic-row-2">
                            <div># ${headerNumber}</div>
                            <div> $${headerData.amount}</div>
                            <div>$${headerData.balance}</div>
                            <div class="w-10">show/hide <i class="fa-solid fa-angles-down"></i></div>
                        </div>
                        <div class="show">
                            <div class="generic-bar-2"> 
                                <div>Invoice Line Number:</div>
                                <div>Payment Date:</div>
                                <div>Amount:</div>
                                <div class="w-10"></div>
                            </div>`;}


                        if (headerData.line_items) {
                            for (let lineItemNumber in headerData.line_items) {
                                let lineItem = headerData.line_items[lineItemNumber];
                                htmlContent += `<div>
            
                                <div class="generic-row-2">
                                    <div> # ${lineItemNumber}</div>
                                    <div> ${lineItem.payment_date}</div>
                                    <div> $ ${lineItem.amount}</div>
                                    <a class="w-10"></a>
                                </div>
                            </div>`;
                            }
                        }

                        htmlContent += `</div>`;
                    }

                    htmlContent += `</div></div>`;
                }

                htmlContent += `</div></div>
                `;
            }

            htmlContent += '<div class="border-bottom-solid"></div>';

            // Update the content of the container
            document.getElementById('revenueReportContainer').innerHTML = htmlContent;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        })
        .then( () => {
            filterOptions['generateReport'] = false;
            const showHideButtons = document.querySelectorAll('.generic-row .w-10, .generic-row-2 .w-10');
            showHideButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const sectionToToggle = button.parentElement.nextElementSibling;
                    if (sectionToToggle) {
                        sectionToToggle.classList.toggle('hide');
                        console.log('working');
                    }
                });
            });
        });
});


// Generating the initial charts and graphs
let reportBarChart = null;
let barGraphData = [];
document.addEventListener('DOMContentLoaded', () => {
    filterOptions['generateReport'] = false;
    const filterOptionsJSON = JSON.stringify(filterOptions);

    fetch('http://localhost:8001/request', {
        method: 'POST',
        body: filterOptionsJSON,
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log(filterOptionsJSON)
            barGraphData = [['Fees Collected', 'Collected', 'Outstanding', 'Overdue', 'Overpaid']]
            return response.json();
        })
        .then(data => {
            for (year in data) {
                barGraphData.push(
                    [
                        year,
                        data[year]['Collected'],
                        data[year]['Uncollected'],
                        data[year]['Overdue'],
                        data[year]['Overpaid']
                    ]
                );
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('responseContainer').textContent = 'Error: ' + error.message;
        })
        .then(() => {
            google.charts.setOnLoadCallback(async function () {
                reportBarChart = new google.visualization.BarChart(document.getElementById('report-bar-chart'));
                drawBarChart(barGraphData);
            });
        })
        .then(() => {
            let htmlContent ='';

            if (filterOptions['Collected']) {
                htmlContent += '<div id="collectedLineChart" class="chart-outline w-47 my-2"></div>'
            }
            if ( filterOptions['Uncollected']) {
                htmlContent += '<div id="uncollectedLineChart" class="chart-outline w-47 my-2"></div>'
            }
            if ( filterOptions['Overdue']) {
                htmlContent += '<div id="overdueLineChart" class="chart-outline w-47 my-2"></div>'
            }
            if ( filterOptions['Overpaid']) {
                htmlContent += '<div id="overpaidLineChart" class="chart-outline w-47 my-2"></div>'
            }

            htmlContent += '<div id="averagePieChart" class="chart-outline w-47 my-2"></div>'


            console.log(barGraphData)

            document.getElementById('trends-div').innerHTML = htmlContent;
        })
        .then(() => {
            google.charts.setOnLoadCallback(async function () {
                // let collectedPieChart = new google.visualization.PieChart(document.getElementById('collectedPieChart'));
                // drawPieChart(barGraphData, collectedPieChart)

                if (filterOptions['Collected']) {
                    setLineChartDiv(barGraphData, 'collectedLineChart', 'Collected', 1)
                }
                if ( filterOptions['Uncollected']) {
                    setLineChartDiv(barGraphData, 'uncollectedLineChart', 'Uncollected', 2)
                }
                if ( filterOptions['Overdue']) {
                    setLineChartDiv(barGraphData, 'overdueLineChart', 'Overdue', 3)
                }
                if ( filterOptions['Overpaid']) {
                    setLineChartDiv(barGraphData, 'overpaidLineChart', 'Overpaid', 4)
                }
            })
        })
})



// Bar chart drawer
function drawBarChart(inputData) {
    var data = google.visualization.arrayToDataTable(
        inputData
    );
    let barChartDiv = document.getElementById('bar-chart-div')

    let options = {
        animation: {"startup": true,
            duration: 500,
            easing: 'inAndOut'},
        tooltip: {isHtml: true},
        width: barChartDiv.offsetWidth * 0.97,
        height: 250,
        legend: {position: 'none'},
        bar: {groupWidth: '75%'},
        isStacked: true,
        vAxis: {gridlines: {count: 4}, format: 'currency' },
        series: {
            0: {color: '#37a2eb'},
            1: {color: '#ff9f40'},
            2: {color: '#ff6384'},
            3: {color: '#ffcd57'},
        },
        orientation: 'horizontal',
        backgroundColor: '#fafdff',
        chartArea: { left: 80, bottom: 50, height:'70%', width:'100%'}

    }
    reportBarChart.draw(data, options);
}

// Pie chart drawer
function drawPieChart(inputData, targetDiv){
    var data = google.visualization.arrayToDataTable(
        inputData
    );

    let pieChartDiv = document.getElementById('trends-div')

    let options = {
        pieHole: 0.47,
        pieSliceText: 'none',
        title: inputData[0][0],
        tooltip: { isHtml: true, trigger: 'selection' },
        width: pieChartDiv.offsetWidth * 0.395,
        height: 200,
        legend: { position: 'bottom', alignment: 'center' },
        backgroundColor: '#fafdff',
        slices: {
            0: { color: '#37a2eb' },
            1: { color: '#ff9f40' },
            2: { color: '#ff6384' },
            3: {color: '#ffcd57'},
        },
        chartArea: {left: 5, height: '60%', width: '100%' }
    };

    console.log('should work')
    targetDiv.draw(data,options)

}


//Line Chart Drawer
function drawLineChart(inputData, targetDiv, color = null) {
    var data = google.visualization.arrayToDataTable(
        inputData
    );
    let lineChartDiv = document.getElementById('collectedLineChart')

    let options = {
        animation: {"startup": true,
            duration: 500,
            easing: 'inAndOut'},
        tooltip: {isHtml: true},
        width: lineChartDiv.offsetWidth * 0.95,
        height: 200,
        legend: {position: 'none'},
        vAxis: {gridlines: {count: 4}, format: 'percent' },
        series: {
            0: {color: '#37a2eb'},
            1: {color: '#ff9f40'},
            2: {color: '#ff6384'},
            3: {color: '#ffcd57'},
        },
        orientation: 'horizontal',
        backgroundColor: '#fafdff',
        chartArea: { left: 50, bottom: 50, height:'60%', width:'90%'}

    }


    switch (color) {
        case 1:
            options.series["0"].color = '#37a2eb';
            break;
        case 2:
            options.series["0"].color = '#ff9f40';
            break;
        case 3:
            options.series["0"].color = '#ff6384';
            break;
        case 4:
            options.series["0"].color = '#ffcd57';
            break;
        default:
            break;
    }


    targetDiv.draw(data, options);
}

function calculateLineData (data, type) {
    let newData = [];
    let index = null;
    if(type == 'Collected') {
        index = 1
    } else if ( type == 'Uncollected') {
        index = 2
    }
    else if ( type == 'Overdue') {
        index = 3
    }
    else if ( type == 'Overpaid') {
        index = 4
    }

    let previousValue = null;

    for (let line of data) {
        let currentValue = line[index];

        if(previousValue !== null) {
            newData.push([line[0], currentValue/previousValue ])
        } else {
            newData.push([line[0], line[index]])
        }

        previousValue = currentValue
    }

    return newData
}

function setLineChartDiv (data, targetDiv, type, color) {
    let target = new google.visualization.LineChart(document.getElementById(targetDiv));
    drawLineChart(calculateLineData(data, type), target, color)
}
