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
      for(let i=1; i<=51; i++) {
        combineData = [];
        const apiUrl = `https://content-api.idreamcareer.com/career/en/${i}/12`;
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
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'token': token },
          body: JSON.stringify(requestData)
        });
      
        const data = await response.json();
        combineData = data.data;

        //
        console.log("length", combineData.length);
        for(let j=0; j < combineData.length; j++) {
          console.log(j);
          console.log(combineData[j]);
          let careerDetailResponse = await getDetail(combineData[j].slug, token);
          // console.log('detail_response', careerDetailResponse);

          const careerData = [
            combineData[j].slug,
            JSON.stringify(combineData[j].detail),
            combineData[j].detail[0].name,
            careerDetailResponse.tagline,
            careerDetailResponse.career_type,
            careerDetailResponse.introduction,
            careerDetailResponse.intro_role,
            combineData[j].icon,
            JSON.stringify([careerDetailResponse]),
            JSON.stringify(careerDetailResponse.videos),
            JSON.stringify([careerDetailResponse.future_growth]),
            JSON.stringify([careerDetailResponse.salary_range]),
            JSON.stringify(careerDetailResponse.career_milestones),
            JSON.stringify(careerDetailResponse.do_you_know),
            JSON.stringify(careerDetailResponse.certifications),
            JSON.stringify([careerDetailResponse.skills_and_aptitude_required]),
            JSON.stringify(careerDetailResponse.placement_companies),
            JSON.stringify(careerDetailResponse.blogs),
            JSON.stringify(careerDetailResponse.real_life_professionals),
            JSON.stringify(careerDetailResponse.job_designations),
            JSON.stringify(careerDetailResponse.hot_technology),
            JSON.stringify(careerDetailResponse.popular_tools_at_work),
            JSON.stringify([careerDetailResponse.school_book_chapters]),
            JSON.stringify(careerDetailResponse.cbse_skill_subjects),
            JSON.stringify(careerDetailResponse.basic_coursework),
            JSON.stringify(careerDetailResponse.offbeats),
            JSON.stringify(careerDetailResponse.special_needs),
            JSON.stringify(careerDetailResponse.college_books),
            JSON.stringify(careerDetailResponse.career_memes),
            JSON.stringify(careerDetailResponse.career_gallery),
            JSON.stringify(careerDetailResponse.alternates),
          ];
  
          connection.connect(err => {
            if (err) {
              console.error('Error connecting to MySQL:', err);
              return;
            }
            console.log('Connected to MySQL');
            const createCareersTableQuery = `
              CREATE TABLE IF NOT EXISTS careers (
                id BIGINT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                slug VARCHAR(255) DEFAULT NULL,
                detail LONGTEXT DEFAULT NULL,
                career_name VARCHAR(255) DEFAULT NULL,
                education_type VARCHAR(255) DEFAULT NULL,
                career_type VARCHAR(255) DEFAULT NULL,
                introduction TEXT DEFAULT NULL,
                intro_role TEXT DEFAULT NULL,
                icon VARCHAR(255) DEFAULT NULL,
                career_details LONGTEXT DEFAULT NULL,
                videos LONGTEXT DEFAULT NULL,
                future_growth LONGTEXT DEFAULT NULL,
                salary_range LONGTEXT DEFAULT NULL,
                career_milestones LONGTEXT DEFAULT NULL,
                do_you_know LONGTEXT DEFAULT NULL,
                certifications LONGTEXT DEFAULT NULL,
                skills_and_aptitude_required LONGTEXT DEFAULT NULL,
                placement_companies LONGTEXT DEFAULT NULL,
                blogs LONGTEXT DEFAULT NULL,
                real_life_professionals LONGTEXT DEFAULT NULL,
                job_designations LONGTEXT DEFAULT NULL,
                hot_technology LONGTEXT DEFAULT NULL,
                popular_tools_at_work LONGTEXT DEFAULT NULL,
                school_book_chapters LONGTEXT DEFAULT NULL,
                cbse_skill_subjects LONGTEXT DEFAULT NULL,
                basic_coursework  LONGTEXT DEFAULT NULL,
                offbeats LONGTEXT DEFAULT NULL,
                special_needs LONGTEXT DEFAULT NULL,
                college_books LONGTEXT DEFAULT NULL,
                career_memes LONGTEXT DEFAULT NULL,
                career_gallery LONGTEXT DEFAULT NULL,
                alternates LONGTEXT DEFAULT NULL,
                created_at TIMESTAMP NULL DEFAULT NULL,
                updated_at TIMESTAMP NULL DEFAULT NULL
              );
            `;
            connection.query(createCareersTableQuery, (err, results) => {
              if (err) {
                console.error('Error creating roadmap_categories table:', err);
                return;
              }
              console.log('careers table created successfully');
              const insertCareerQuery = `
                    INSERT INTO careers (slug, detail, career_name, education_type, career_type, introduction, intro_role, icon, career_details, videos, future_growth, salary_range, career_milestones, do_you_know, certifications,skills_and_aptitude_required, placement_companies, blogs, real_life_professionals,job_designations, hot_technology,popular_tools_at_work, school_book_chapters, cbse_skill_subjects, basic_coursework, offbeats, special_needs, college_books, career_memes, career_gallery, alternates, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
                  `;
                
                connection.query(insertCareerQuery, careerData, (err, results) => {
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
    const detailApi = `https://content-api.idreamcareer.com/v2/career/en/${slug}`;
    const response = await fetch(detailApi, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'token': token }
    });
  
    const data = await response.json();
    return data.data;
  }
  // Call the function
  fetchDataWithCookie();