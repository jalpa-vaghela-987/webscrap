import mysql from 'mysql2';



// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Admin!123',
  database: 'careersahi_node'
});



async function loginAndGetToken() {
  const loginUrl = 'https://auth-api.idreamcareer.com/api/v1/auth/login-with-password';
  const credentials = {
    mobile: '8238235236',
    password: '12345678@Abc'
  };

  try {
    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (response.ok) {
      // Assuming the token is in the `token` field in the response JSON
      const token = data.data.token;      
      // Store token in local storage or a variable
      // localStorage.setItem('authToken', token); // Save it for future requests
      return token;
    } else {
      console.error('Login failed:', data.message);
    }
  } catch (error) {
    console.error('Error during login:', error);
  }
}


const fetchDataWithCookie = async () => {
    try {
      const token = await loginAndGetToken();
      let combineData = [];
      for(let i=2; i<=6; i++) {
        combineData = [];
        const apiUrl = `https://content-api.idreamcareer.com/v2/exam/list?limit=25&page=${i}`;
        const requestData = {
            filters:{},
            sort:"appClosingSoon"
        };
    
        // Send the POST request
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'token': token },
          body: JSON.stringify(requestData)
        });
      
        const data = await response.json();
        combineData = data.data.examsList;

        console.log("length", combineData.length);
        for(let j=0; j < combineData.length; j++) {
          console.log(j);
          console.log(combineData[j]);
          let examDetailResponse = await getDetail(combineData[j]._id, token);

          let overView = [
            {
                'admission_courses' : examDetailResponse.prerequisite[0].admission_courses,
                'open_dates' : examDetailResponse.prerequisite[0].open_dates,
                'last_application_dates' : examDetailResponse.prerequisite[0].last_submission_dates,
                'language' : [...new Set(examDetailResponse.language.map(item => item.languages))] ,
                'exam_date' : examDetailResponse.prerequisite[0].date_of_exam,
                'mode_of_application' : examDetailResponse['mode_of _application'],
                'mode_of_exam' : examDetailResponse['mode_of exam']
            }
          ];
          const examData = [
            combineData[j]._id, //slug
            combineData[j].shortName,
            combineData[j].fullName,
            combineData[j].examLevel,
            JSON.stringify(combineData[j].applicationDates), //last_appliation_date
            JSON.stringify(combineData[j].examDateRange),
            combineData[j].isApplicationOpen,
            combineData[j].isResultDeclared,
            combineData[j].applicationProcedureSteps,
            JSON.stringify(combineData[j].courses),
            combineData[j].minLastSubmissionDate,
            JSON.stringify(combineData[j].totalExams),
            JSON.stringify(examDetailResponse.alias),
            examDetailResponse.introduction,
            JSON.stringify(overView),
            JSON.stringify(examDetailResponse.prerequisite[0].exam_dates),
            JSON.stringify(examDetailResponse.prerequisite[0].application_fee),
            JSON.stringify(examDetailResponse.courses), //detail_courses
            examDetailResponse.prerequisite[0].award, // minimum_qualification
            JSON.stringify(examDetailResponse.prerequisite[0].compulsory_subjects),
            JSON.stringify(examDetailResponse.prerequisite[0].exam_pattern),
            JSON.stringify(examDetailResponse.documents_required),
            JSON.stringify(examDetailResponse.media_link),
            JSON.stringify(examDetailResponse.language),
            JSON.stringify(examDetailResponse.exam_center)
          ];

  
        //   console.log(examData);
        //   return;
          connection.connect(err => {
            if (err) {
              console.error('Error connecting to MySQL:', err);
              return;
            }
            console.log('Connected to MySQL');
            const createExamsTableQuery = `
              CREATE TABLE IF NOT EXISTS exams (
                id BIGINT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                slug VARCHAR(255) DEFAULT NULL,
                sort_name VARCHAR(255) DEFAULT NULL,
                full_name VARCHAR(255) DEFAULT NULL,
                exam_level VARCHAR(255) DEFAULT NULL,
                last_appliation_date LONGTEXT DEFAULT NULL,
                exam_date_range LONGTEXT DEFAULT NULL,
                is_application_open VARCHAR(255) DEFAULT NULL,
                is_result_declared VARCHAR(255) DEFAULT NULL,
                application_procedure_steps VARCHAR(255) DEFAULT NULL,
                courses LONGTEXT DEFAULT NULL,
                min_last_submission_date VARCHAR(255) DEFAULT NULL,
                total_exams LONGTEXT DEFAULT NULL,
                alias LONGTEXT DEFAULT NULL,
                introduction LONGTEXT DEFAULT NULL,
                overview LONGTEXT DEFAULT NULL,
                exam_dates LONGTEXT DEFAULT NULL,
                application_fee LONGTEXT DEFAULT NULL,
                detail_courses LONGTEXT DEFAULT NULL,
                minimum_qualification VARCHAR(255) DEFAULT NULL,
                compulsory_subjects LONGTEXT DEFAULT NULL,
                exam_pattern LONGTEXT DEFAULT NULL,
                documents_required LONGTEXT DEFAULT NULL,
                media_link LONGTEXT DEFAULT NULL,
                language LONGTEXT DEFAULT NULL,
                exam_center LONGTEXT DEFAULT NULL,
                created_at TIMESTAMP NULL DEFAULT NULL,
                updated_at TIMESTAMP NULL DEFAULT NULL
              );
            `;
            connection.query(createExamsTableQuery, (err, results) => {
              if (err) {
                console.error('Error creating roadmap_categories table:', err);
                return;
              }
              console.log('careers table created successfully');
              const insertExamQuery = `
                    INSERT INTO exams (slug, sort_name, full_name, exam_level, last_appliation_date, exam_date_range, is_application_open, is_result_declared, application_procedure_steps, courses, min_last_submission_date, total_exams, alias, introduction,overview, exam_dates, application_fee, detail_courses,minimum_qualification, compulsory_subjects,exam_pattern, documents_required, media_link, language, exam_center, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
                  `;
                
                connection.query(insertExamQuery, examData, (err, results) => {
                  if (err) {
                    console.error('Error inserting into roadmap_categories:', err);
                    return;
                  }
                  console.log('Inserted into roadmap_categories:', results.insertId);
                });
            });
          })
        }
        
      }
      // const jsonData = combineData;

      // console.log(combineData.length); // Data fetched from the protected page
    } catch (error) {
      console.error('Error fetching data with cookie:', error);
    }
  };
  

  async function getDetail(slug, token) {
    const detailApi = `https://content-api.idreamcareer.com/v2/exam/${slug}`;
    const response = await fetch(detailApi, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'token': token }
    });
  
    const data = await response.json();
    return data.data;
  }
  // Call the function
  fetchDataWithCookie();