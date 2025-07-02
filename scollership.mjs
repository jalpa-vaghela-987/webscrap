import axios from 'axios';
import fetch from 'node-fetch';
import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';


// Login to the site and store the session cookie
const loginAndGetCookie = async () => {
  try {
    const apiUrl = 'https://auth-api.idreamcareer.com/api/v1/auth/login-with-password';
    const requestData = {
        mobile: '8238235236',
        password: '12345678@Abc'
    };

    // Send the POST request
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData)
    });

    // Convert the response to JSON
    const data = await response.json();

    // Log the response data
    console.log('Response data:', data.data.token);
    return data.data.token;

    // Replace with the actual login URL and credentials
    // const loginResponse = await axios.post('https://auth-api.idreamcareer.com/api/v1/auth/login-with-password', {
    //   mobile: '8238235236',
    //   password: '12345678@Abc'
    // });
    
    // console.log(loginResponse);
    // Extract the cookie from the response headers
    // const cookie = loginResponse.headers['set-cookie'];
    
    // return cookie;
  } catch (error) {
    console.error('Error logging in:', error);
  }
};



// Fetch data using the session cookie
const fetchDataWithCookie = async () => {
    try {
      const token = await loginAndGetCookie();
  console.log("0000",token);
      // Pass the cookie in the headers to access authenticated pages
      // const response = await axios.get('https://example.com/protected-data', {
      //   headers: {
      //     Cookie: cookie
      //   }
      // });
      let combineData = [];
      for(let i=1; i<=149; i++) {
      const apiUrl = `https://content-api.idreamcareer.com/scholarship/${i}/12`;
      const requestData = {
          query:{},
          sort:{
              academic_year_priority : -1,
              "detail.0.last_date" : 1,
              id : -1,
              notification_status : 1
          }
      };

      // Send the POST request
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'token': token },
        body: JSON.stringify(requestData)
      });
    
        const data = await response.json();
        console.log(data); // Data fetched from the protected page
        combineData.push(...data.data);
      }
      const jsonData = combineData;
    //   const tableName = 'scholarships';  // Replace with your actual table name
    // let sqlStatements = generateInsertStatements(jsonData, tableName);

    // // Step 3: Write the SQL statements to an .sql file
    // fs.writeFile('scholarships.sql', sqlStatements, (err) => {
    //   if (err) {
    //     console.error('Error writing to SQL file:', err);
    //   } else {
    //     console.log('SQL file created successfully: output.sql');
    //   }
    // });
      // fs.writeFile('scholarships.json', JSON.stringify(jsonData, null, 2), (err) => {
      //   if (err) {
      //     console.error('Error writing to file', err);
      //   } else {
      //     console.log('JSON data saved to output.json');
      //   }
      // });
      // Create a new workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(jsonData);

      // Append the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      // Write the workbook to a file
      XLSX.writeFile(workbook, 'scholarships.xlsx');

      console.log(combineData.length); // Data fetched from the protected page
    } catch (error) {
      console.error('Error fetching data with cookie:', error);
    }
  };
  
  // Call the function
  fetchDataWithCookie();
  
  // Function to generate SQL INSERT statements from JSON
function generateInsertStatements(data, tableName) {
  let sql = `-- SQL Insert Statements for table: ${tableName}\n\n`;
  
  data.forEach((row) => {
    let columns = Object.keys(row).map((col) => `\`${col}\``).join(', ');
    let values = Object.values(row)
      .map((value) => (typeof value === 'string' ? `'${value}'` : value))
      .join(', ');

    sql += `INSERT INTO \`${tableName}\` (${columns}) VALUES (${values});\n`;
  });

  return sql;
}