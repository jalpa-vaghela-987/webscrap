// Import the puppeteer module using ES module syntax
import puppeteer from 'puppeteer';

// Define an async function to handle the login process
async function login() {
    // Launch a new browser instance
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to the login page
    await page.goto('https://app.idreamcareer.com/');

    // Fill in the login form (replace the selectors and credentials as necessary)
    await page.type('#text', '8238235236'); // Replace with actual selector and email
    await page.type('#password', '12345678@Abc');      // Replace with actual selector and password

    // Submit the form by clicking the login button (replace with the actual button selector)
    await page.click('#login-button');

    // Wait for the page to navigate after form submission
    await page.waitForNavigation();

    // Extract some data from the page after login
    const responseData = await page.evaluate(() => {
        return document.body.innerText;
    });

    // Log the response data or confirmation of successful login
    console.log('Login successful:', responseData);

    // Close the browser after the operation is complete
    await browser.close();
}

// Call the login function to execute the login process
login();
