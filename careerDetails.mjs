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
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3' // Mimics a browser
    },
      body: JSON.stringify(requestData)
    });

    console.log("dsds", response);
    return;
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
      
        const apiUrl = `https://content-api.idreamcareer.com/v2/career/en/company-secretary`;
        const requestData = {
            query:{},
            // sort:{
            //     "academic_year_priority" : "-1",
            //     "detail.0.last_date" : "1",
            //     "id" : "-1",
            //     "notification_status" : "1"
            // }
        };
    
        // Send the POST request
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'token': token },
        //   body: JSON.stringify(requestData)
        });
      
        const data = await response.json();
        console.log(data);
        // combineData = data.data;
        combineData.push(data.data);
    //   }
    //   const apiUrl = 'https://content-api.idreamcareer.com/career/en/1/12';
    //   const requestData = {
    //     query:{},
    //     // sort:{
    //     //     "academic_year_priority" : "-1",
    //     //     "detail.0.last_date" : "1",
    //     //     "id" : "-1",
    //     //     "notification_status" : "1"
    //     // }
    // };

    // // Send the POST request
    // const response = await fetch(apiUrl, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json', 'token': token },
    //   body: JSON.stringify(requestData)
    // });
  
    // //   const data = await response.json();
      const jsonData = combineData;
    //   // Create a new workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(jsonData);

      // Append the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      // Write the workbook to a file
      XLSX.writeFile(workbook, 'career_details.xlsx');

      console.log(jsonData); // Data fetched from the protected page
    } catch (error) {
      console.error('Error fetching data with cookie:', error);
    }
  };
  
  // Call the function
  fetchDataWithCookie();
  