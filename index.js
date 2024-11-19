// 2024 Made by Muhamed Porić. You can modify the code but must include the credit with a link to this repository.
function validateDecimalInput(input) {
    input.value = input.value.replace(/[^0-9.]/g, ''); // Remove all non-numeric and non-period characters
    const parts = input.value.split('.');
    if (parts.length > 2) {
        // If more than one period is entered, keep only the first one
        input.value = parts[0] + '.' + parts.slice(1).join('');
    }
}

async function generateTaxForm() {
    // Get input values
    const bankAmount = parseFloat(document.getElementById('bankAmount').value); // Ensure decimal parsing
    if (isNaN(bankAmount) || bankAmount <= 0) {
        alert('Unesite važeći iznos s decimalnom točkom (.)!');
        return;
    }
    const jmbg = document.getElementById('jmbg').value;
    const receivedDate = document.getElementById('receivedDate').value;
    const taxPeriodMonth = document.getElementById('taxPeriodMonth').value;
    const taxPeriodYear = document.getElementById('taxPeriodYear').value;
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const title = document.getElementById('title').value;
    const senderAddress = document.getElementById('senderAddress').value;
    const country = document.getElementById('country').value;

    // Perform calculations
    const Y = bankAmount * 0.8; // Remove 20%
    const Z = Y * 0.04; // Health insurance is 4% of Y
    const V = Y - Z; // Taxable amount (Y - Z)
    const W = V * 0.1; // Tax amount (10% of V)

    // Display the results
    document.getElementById('earnedAmount').innerText = `Iznos dohotka (-20%): ${Y.toFixed(2)} KM`;
    document.getElementById('healthInsurance').innerText = `Zdravstveno osiguranje (x0,04): ${Z.toFixed(2)} KM`;
    document.getElementById('taxableAmount').innerText = `Osnovica za porez: ${V.toFixed(2)} KM`;
    document.getElementById('taxAmount').innerText = `Iznos poreza: ${W.toFixed(2)} KM`;

    // Load the PDF template and fill fields (unchanged from original code)
    const existingPdfBytes = await fetch('b839c-obrazac-ams_bos_web.pdf').then(res => res.arrayBuffer());
    const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();

    // Set values in the form fields
    form.getTextField('1 Ime i prezime').setText(name);
    form.getTextField('2 JMBG').setText(jmbg);
    form.getTextField('3 dresa').setText(address);
    form.getTextField('undefined').setText(receivedDate.split("-")[2]); // Day
    form.getTextField('undefined_2').setText(receivedDate.split("-")[1]); // Month
    form.getTextField('undefined_3').setText(receivedDate.split("-")[0].slice(-2)); // Last 2 digits of the year
    form.getTextField('5 Period mjesecgodina').setText(taxPeriodMonth);
    form.getTextField('20').setText(taxPeriodYear);
    form.getTextField('6 Naziv').setText(title);
    form.getTextField('7 dresa').setText(senderAddress);
    form.getTextField('8 Država').setText(country);
    form.getTextField('9 Iznos dohotkaRow1').setText(Y.toFixed(2));
    form.getTextField('10 Zdravstveno osiguranje na teret osiguranika kolona 9 X 004Row1').setText(Z.toFixed(2));
    form.getTextField('11 Osnovica za porez kolona 9  10Row1').setText(V.toFixed(2));
    form.getTextField('12 Iznos poreza kolona 11 X 01Row1').setText(W.toFixed(2));
    form.getTextField('fill_7').setText('0.00');
    form.getTextField('14 Razlika poreza za uplatuRow1').setText(W.toFixed(2));

    // Save the filled PDF and open it in a new tab
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
}
