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

            for (let studentId in data) {
                let studentData = data[studentId];

                htmlContent += `<div>
                <h2>Student ID: ${studentData.id}</h2>
                <p>First Name: ${studentData.firstname}</p>
                <p>Surname: ${studentData.surname}</p>`;

                for (let enrolmentNumber in studentData.enrolments) {
                    let enrolmentData = studentData.enrolments[enrolmentNumber];

                    htmlContent += `<div>
                    <h3>Enrolment Number: ${enrolmentNumber}</h3>
                    <p>Enrolment Date: ${enrolmentData.enrolment_date}</p>`;

                    for (let headerNumber in enrolmentData.invoice_headers) {
                        let headerData = enrolmentData.invoice_headers[headerNumber];

                        htmlContent += `<div>
                        <h4>Header Number: ${headerNumber}</h4>
                        <p>Amount: ${headerData.amount}</p>
                        <p>Balance: ${headerData.balance}</p>`;

                        if (headerData.line_items) {
                            for (let lineItemNumber in headerData.line_items) {
                                let lineItem = headerData.line_items[lineItemNumber];
                                htmlContent += `<div>
                                <p>Invoice Line Number: ${lineItemNumber}</p>
                                <p>Payment Date: ${lineItem.payment_date}</p>
                                <p>Amount: ${lineItem.amount}</p>
                            </div>`;
                            }
                        }

                        htmlContent += `</div>`;
                    }

                    htmlContent += `</div>`;
                }

                htmlContent += `</div>`;
            }

            // Update the content of the container
            document.getElementById('revenueReportContainer').innerHTML = htmlContent;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});
