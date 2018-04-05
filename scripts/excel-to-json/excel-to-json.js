const excelToJson = require('convert-excel-to-json');
const fs = require('fs');
const result = excelToJson({
    sourceFile: './files/Candidate & Job List for pre-alpha testing.xlsx',
    columnToKey: {
        A: 'title',
        B: 'name',
        C: 'compensation',
        D: 'city',
        E: 'description'
    }
});

fs.writeFile('myjsonfile.json', JSON.stringify(result.Jobs), 'utf8', (a, b) => {
    console.log("a, b", a, b);
});