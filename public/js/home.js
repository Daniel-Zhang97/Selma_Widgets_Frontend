
    let barGraphData = [['Fees Collected', 'Collected', 'Outstanding', 'Overdue',]];
    let chart = null;
    let pieChart = null;
    let barWidth = 300;

    // Bar chart functions
    function drawChart(inputData) {
        var data = google.visualization.arrayToDataTable(
        inputData
        );

        let options = {
            animation: {"startup": true,
            duration: 500,
            easing: 'inAndOut'},
            tooltip: {isHtml: true},
            width: barWidth,
            height: 200,
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
            backgroundColor: '#f9f6fa',
            chartArea: {left: 40, height:'60%', width:'80%'}

        }
        chart.draw(data, options);
    }

    function getData(initial = false) {
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
        drawChart(barGraphData);
        if (initial == true) {
        updatePieChart(barGraphData.length - 1)
    }
});
}

    function areOptionsValid(initial = false) {
    if (!filterOptions['Collected'] && !filterOptions['Uncollected'] && !filterOptions['Overdue'] &&
    !filterOptions['Overpaid']) {
    console.log('invalid type options')
} else {
    console.log(filterOptions)
    getData(true)
}
}

    // Pie Chart Functions
    function drawPieChart(inputData){
    var data = google.visualization.arrayToDataTable(
    inputData
    );

    let options = {
    pieHole: 0.47,
    pieSliceText: 'none',
    title: inputData[0][0],
    tooltip: { isHtml: true, trigger: 'selection' },
    width: 140,
    height: 140,
    legend: { position: 'bottom', alignment: 'center' },
    backgroundColor: '#f9f6fa',
    slices: {
    0: { color: '#37a2eb' },
    1: { color: '#ff9f40' },
    2: { color: '#ff6384' },
    3: {color: '#ffcd57'},
},
    chartArea: {left: 5, height: '60%', width: '100%' }
};

    console.log('should work')
    pieChart.draw(data,options)

}

    function updatePieChart(index) {
    let pieData = [[barGraphData[index][0], 'Collection Status']]
    for (i = 1; i < 5; i++) {
    pieData.push([barGraphData[0][i], Math.abs(barGraphData[index][i])])
}
    drawPieChart(pieData)

}

    // Universal chart functions



    // Initial request to get the graph data
    document.addEventListener('DOMContentLoaded', () => {
    google.charts.setOnLoadCallback(async function () {
        pieChart = new google.visualization.PieChart(document.getElementById('pie_chart'));
        chart = new google.visualization.BarChart(document.getElementById('chart_div'));
        google.visualization.events.addListener(chart, 'select', function(e) {
            selectedRows = chart.getSelection('row');
            if (selectedRows && selectedRows.length > 0) {
                updatePieChart(selectedRows[0].row + 1)
            }
        });
        areOptionsValid(true)
    });
});

    // initializing the dates
    var currentDate = new Date();
    var oneYearLater = new Date();
    var oneYearAgo = new Date();
    oneYearAgo.setFullYear(currentDate.getFullYear() - 3);
    oneYearLater.setFullYear(currentDate.getFullYear() + 1)
    var oneYearLaterFormatted = oneYearLater.toISOString().slice(0, 10);
    var oneYearAgoFormatted = oneYearAgo.toISOString().slice(0, 10);

    let filterOptions = {
    groupBy: 'Yearly',
    Collected: true,
    Uncollected: true,
    Overdue: true,
    Overpaid: true,
    startDate: oneYearAgoFormatted,
    endDate: oneYearLaterFormatted,
    generateReport: false,
};

        // datepicker filter
    $(function() {
    $('#startDate').val(oneYearAgoFormatted);
    $('#endDate').val(oneYearLaterFormatted);

    $('.input-daterange').datepicker({
    format: 'yyyy-mm-dd',
    autoclose: true
});

    $('#datepicker input').on('change', function() {
    var startDate = $('input[name="start"]').val();
    var endDate = $('input[name="end"]').val();

    filterOptions['startDate'] = startDate;
    filterOptions['endDate'] = endDate;
});
});

    // Type handler
    $(function () {
    $('.form-check-input').on('change', function () {
        filterOptions[this.value] = this.checked
    })
})

    // Groupby Handler
    $(function () {
    $('.group-by-button').on('click', function () {
        $('.group-by-button').removeClass('selected-group');
        $(this).addClass('selected-group');
        filterOptions['groupBy'] = this.value;
    })
})

    // Submit handler
    $(function() {
    $('#submit-button').on('click', function () {
        areOptionsValid()
    })
})

    // Filter hide/show handler
    $(function () {
    $('.filter-expand-button').on('click', function () {
        if (barWidth == 300) {
            barWidth = 188
            $('#chart_div').toggleClass('mini-chart');
            $('#revenue-right, #pie_chart, #pie-report-container').toggleClass('mega-chart')
            drawChart(barGraphData)
            setTimeout(function() {
                $('#filter-options-container').toggleClass('hidden-filter');
            }, 500)
        } else  {
            $('#filter-options-container').toggleClass('hidden-filter');
            setTimeout(function() {
                barWidth = 300
                $('#revenue-right, #pie_chart, #pie-report-container').toggleClass('mega-chart')
                $('#chart_div').toggleClass('mini-chart');
                drawChart(barGraphData)
            }, 500)
        }


    });
});

    // Generate Revenue Report handler
    $(function() {
    $('#generate-report').on('click', function() {
        const filterOptionsJSON = JSON.stringify(filterOptions);

        // Send a POST request to the Symfony controller to generate the report
        fetch('http://localhost:8002/revenue_report', {
            method: 'POST',
            body: filterOptionsJSON,
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.url)
                const newTab = window.open(data.url, '_blank');
                if (newTab) {
                    newTab.focus();
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
})

