const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('c:\\Users\\HUAWEI\\Desktop\\internet\\türk borçlar kanunu.pdf');

pdf(dataBuffer).then(function(data) {
    // console.log(data.text);
    // Write text to a file so we can view it
    fs.writeFileSync('c:\\Users\\HUAWEI\\Desktop\\internet\\türk borçlar kanunu_text.txt', data.text);
    console.log("PDF parsed successfully, text written to türk borçlar kanunu_text.txt");
}).catch(function(error) {
    console.error("Error parsing PDF:", error);
});
