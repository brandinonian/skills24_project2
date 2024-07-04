var fs = require('fs');

export async function GET() {
  const csvData = readCSV();
  return Response.json({ csvData });
}

function readCSV() {
  try {
    let lines = fs.readFileSync('payroll.csv', 'utf8');
    return lines.trim().split('\n').map(line => line.split(','));
  }
  catch (err) {
    console.log(err);
  }
}