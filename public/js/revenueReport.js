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

                htmlContent += `</div></div>`;
            }

            // Update the content of the container
            document.getElementById('revenueReportContainer').innerHTML = htmlContent;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        })
        .then( () => {
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
