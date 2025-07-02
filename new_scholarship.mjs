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
      console.log(token);
      let combineData = [];
      for(let i=148; i<=148; i++) {
        combineData = [];
        const apiUrl = `https://content-api.idreamcareer.com/scholarship/${i}/12`;
        const requestData = {
            query:{},
            sort:{
                academic_year_priority : -1,
                'detail.0.last_date' : 1,
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
        combineData = data.data;

        //
        // console.log("length", combineData);
        
        for(let j=0; j < combineData.length; j++) {
          // console.log(j);
          // console.log(combineData[j]);
          let scholarshipDetailResponse = await getDetail(combineData[j].slug, token);
          // console.log('detail_response', scholarshipDetailResponse.applications_open);

          // console.log(scholarshipData);
          let careerData = [];
          // if(scholarshipDetailResponse.version == 1) {
          //   careerData = [
          //     scholarshipDetailResponse.version,
          //     combineData[j].slug,
          //     combineData[j].name,
          //     JSON.stringify(combineData[j].scholarship_types),
          //     combineData[j].last_date,
          //     combineData[j].funding, //funding_type
          //     combineData[j].region_name,
          //     JSON.stringify(combineData[j].careers),
          //     scholarshipDetailResponse.detail[0].general_information,
          //     scholarshipDetailResponse.detail[0].awards,
          //     scholarshipDetailResponse.detail[0].eligibility,
          //     scholarshipDetailResponse.detail[0].application_fees,
          //     scholarshipDetailResponse.detail[0].application_procedure,
          //     scholarshipDetailResponse.detail[0].selection_process,
          //     scholarshipDetailResponse.detail[0].other_information,
          //     JSON.stringify(scholarshipDetailResponse.detail[0].dates), //Important Dates
          //   ];
          // } else {
            if(scholarshipDetailResponse.version == 2) {
              let scholarshipData = [
                {
                    name : 'Applications Open',
                    value : scholarshipDetailResponse.applications_open,
                    key : 'applications_open',
                    icon : 'https://d1911mni2drzgj.cloudfront.net/V2/exams/application_1_trpj1l.png'
                },
                {
                  name : 'Mode of Application',
                  value : scholarshipDetailResponse['mode_of _application'],
                  key : 'mode_of_application',
                  icon : 'https://d1911mni2drzgj.cloudfront.net/V2/exams/image_2_s0j8kh.png'
                },
                {
                  name : 'Mode of Exam',
                  value : scholarshipDetailResponse['mode_of exam'],
                  key : 'mode_of exam',
                  icon : 'https://d1911mni2drzgj.cloudfront.net/V2/exams/image_2_1_d5wmcn.png'
                },
                {
                  name : 'Exam Level',
                  value : scholarshipDetailResponse.exam_level,
                  key : 'exam_level',
                  icon : 'https://d1911mni2drzgj.cloudfront.net/V2/exams/image_2_2_ouxs6o.png'
                },
                {
                  name : 'Eligible Genders',
                  value : scholarshipDetailResponse.eligibility_gender,
                  key : 'eligibility_gender',
                  icon : 'https://d1911mni2drzgj.cloudfront.net/V2/exams/image_2_s0j8kh.png'
                },
                {
                  name : 'Frequency of Exam',
                  value : scholarshipDetailResponse.frequency_of_exam,
                  key : 'frequency_of_exam',
                  icon : 'https://d1911mni2drzgj.cloudfront.net/V2/exams/image_2_4_u2ovro.png'
                }
              ];
              
              let GenericInfo = [
                  {
                      name : 'Applications Open',
                      value : scholarshipDetailResponse.applications_open,
                      key : 'applications_open',
                      icon : 'https://d1911mni2drzgj.cloudfront.net/V2/exams/application_1_trpj1l.png'
                  },
                  {
                    name : 'Always Open',
                    value : scholarshipDetailResponse.application_status,
                    key : 'application_status',
                    icon : 'https://d1911mni2drzgj.cloudfront.net/V2/exams/application_1_xc04di.png'
                  },
                  {
                    name : 'Exam Level',
                    value : scholarshipDetailResponse.exam_level,
                    key : 'exam_level',
                    icon : 'https://d1911mni2drzgj.cloudfront.net/V2/exams/image_2_2_ouxs6o.png'
                  },
                  {
                    name : 'Mode of Application',
                    value : scholarshipDetailResponse['mode_of _application'],
                    key : 'mode_of_application',
                    icon : 'https://d1911mni2drzgj.cloudfront.net/V2/exams/image_2_s0j8kh.png'
                  },
                  {
                    name : 'Mode of Exam',
                    value : scholarshipDetailResponse['mode_of exam'],
                    key : 'mode_of exam',
                    icon : 'https://d1911mni2drzgj.cloudfront.net/V2/exams/image_2_1_d5wmcn.png'
                  },
                  {
                    name : 'Eligible Genders',
                    value : scholarshipDetailResponse.eligibility_gender,
                    key : 'eligibility_gender',
                    icon : 'https://d1911mni2drzgj.cloudfront.net/V2/exams/image_2_s0j8kh.png'
                  },
                  {
                    name : 'Domicile Required',
                    value : scholarshipDetailResponse.domicile_required,
                    key : 'domicile_required',
                    icon : 'https://d1911mni2drzgj.cloudfront.net/V2/exams/image_2_s0j8kh.png'
                  },
                  {
                    name : 'Dates Pending',
                    value : scholarshipDetailResponse.dates_pending,
                    key : 'dates_pending',
                    icon : 'https://d1911mni2drzgj.cloudfront.net/V2/exams/calendar_zmuwxa.png'
                  },
                  {
                    name : 'Frequency of Exam',
                    value : scholarshipDetailResponse.frequency_of_exam,
                    key : 'frequency_of_exam',
                    icon : 'https://d1911mni2drzgj.cloudfront.net/V2/exams/image_2_4_u2ovro.png'
                  },
                  {
                    name : 'Conducting Body',
                    value : scholarshipDetailResponse['conducting _body'],
                    key : 'conducting _body',
                    icon : 'https://d1911mni2drzgj.cloudfront.net/V2/exams/univeristy_1_ruuamz.png'
                  },
                  {
                    name : 'Application Procedure',
                    value : scholarshipDetailResponse.application_procedure_steps,
                    key : 'application_procedure_steps',
                    icon : 'https://d1911mni2drzgj.cloudfront.net/V2/exams/image_2_httbvw.png'
                  },
                  {
                    name : 'Syllabus',
                    value : scholarshipDetailResponse.Syllabus,
                    key : 'Syllabus',
                    icon : 'https://d1911mni2drzgj.cloudfront.net/V2/exams/image_2_1_jgvgbq.png'
                  }
              ];
  
               careerData = [
                scholarshipDetailResponse.version,
                combineData[j].slug,
                combineData[j].name,
                scholarshipDetailResponse.short_name,
                JSON.stringify(combineData[j].scholarship_types),
                combineData[j].last_date,
                combineData[j].funding, //funding_type
                combineData[j].region_name,
                JSON.stringify(combineData[j].careers),
                JSON.stringify(scholarshipData),
                scholarshipDetailResponse.introduction,
                JSON.stringify(GenericInfo), //Generic Info
                JSON.stringify(scholarshipDetailResponse.exam_date), //Important Dates
                JSON.stringify(scholarshipDetailResponse.admission_course),
                JSON.stringify(scholarshipDetailResponse.application_fee),
                JSON.stringify(scholarshipDetailResponse.preRequisite), //Prerequisite
                JSON.stringify(scholarshipDetailResponse.percentage_required),
                JSON.stringify(scholarshipDetailResponse.reservation),
                JSON.stringify(scholarshipDetailResponse.special_needs),
                JSON.stringify(scholarshipDetailResponse.age),
                JSON.stringify(scholarshipDetailResponse.previous_Year_questions),
                JSON.stringify(scholarshipDetailResponse.exam_language),
                JSON.stringify(scholarshipDetailResponse.career_pathways),
                JSON.stringify(scholarshipDetailResponse.exam_pattern),
                JSON.stringify(scholarshipDetailResponse.exam_lavel),
                JSON.stringify(scholarshipDetailResponse.seats), //Available Seats
                JSON.stringify(scholarshipDetailResponse.remuneration), //Rewards and Prizes
                JSON.stringify(scholarshipDetailResponse.documents_required),
                JSON.stringify(scholarshipDetailResponse.domicile_state),
                JSON.stringify(scholarshipDetailResponse.exam_center),
                JSON.stringify(scholarshipDetailResponse.media_link), //Important Sources
                JSON.stringify(scholarshipDetailResponse.condtions)
              ];

              const insertCareerQuery = `
                INSERT INTO scholarships (version, slug, name, short_name, scholarship_types, last_date, funding_type, region_name, careers, scholarship_details, introduction, generic_info, exam_date, admission_course,application_fee, prerequisite, percentage_required, reservation,special_needs, age,previous_year_questions, exam_language, career_pathways, exam_pattern, exam_lavel, available_seats, rewards_and_prizes, documents_required,domicile_state, exam_center, important_sources, conditions, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,  NOW(), NOW())
              `;

              connection.connect(err => {
                if (err) {
                  console.error('Error connecting to MySQL:', err);
                  return;
                }
                console.log('Connected to MySQL',);
                const createCareersTableQuery = `
                  CREATE TABLE IF NOT EXISTS scholarships (
                    id BIGINT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                    version VARCHAR(255) DEFAULT NULL,
                    slug VARCHAR(255) DEFAULT NULL,
                    name VARCHAR(255) DEFAULT NULL,
                    short_name VARCHAR(255) DEFAULT NULL,
                    scholarship_types LONGTEXT DEFAULT NULL,
                    last_date VARCHAR(255) DEFAULT NULL,
                    funding_type VARCHAR(255) DEFAULT NULL,
                    region_name VARCHAR(255) DEFAULT NULL,
                    careers LONGTEXT DEFAULT NULL,
                    scholarship_details LONGTEXT DEFAULT NULL,
                    introduction TEXT DEFAULT NULL,
                    generic_info LONGTEXT DEFAULT NULL,
                    exam_date LONGTEXT DEFAULT NULL,
                    admission_course LONGTEXT DEFAULT NULL,
                    application_fee LONGTEXT DEFAULT NULL,
                    prerequisite LONGTEXT DEFAULT NULL,
                    percentage_required LONGTEXT DEFAULT NULL,
                    reservation LONGTEXT DEFAULT NULL,
                    special_needs LONGTEXT DEFAULT NULL,
                    age LONGTEXT DEFAULT NULL,
                    previous_year_questions LONGTEXT DEFAULT NULL,
                    exam_language LONGTEXT DEFAULT NULL,
                    career_pathways LONGTEXT DEFAULT NULL,
                    exam_pattern LONGTEXT DEFAULT NULL,
                    exam_lavel LONGTEXT DEFAULT NULL,
                    available_seats  LONGTEXT DEFAULT NULL,
                    rewards_and_prizes LONGTEXT DEFAULT NULL,
                    documents_required LONGTEXT DEFAULT NULL,
                    domicile_state LONGTEXT DEFAULT NULL,
                    exam_center LONGTEXT DEFAULT NULL,
                    important_sources LONGTEXT DEFAULT NULL,
                    conditions LONGTEXT DEFAULT NULL,
                    general_information LONGTEXT DEFAULT NULL,
                    awards LONGTEXT DEFAULT NULL,
                    eligibility LONGTEXT DEFAULT NULL,
                    application_fees LONGTEXT DEFAULT NULL,
                    application_procedure LONGTEXT DEFAULT NULL,
                    selection_process LONGTEXT DEFAULT NULL,
                    other_information LONGTEXT DEFAULT NULL,
                    important_dates LONGTEXT DEFAULT NULL,
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
            
          // }
          
          // console.log(careerData);

          
            // if(scholarshipDetailResponse.version == 1) { 
            //   insertCareerQuery = `
            //   INSERT INTO scholarships (version, slug, name, scholarship_types, last_date, funding_type, region_name, careers, general_information, awards, eligibility, application_fees, application_procedure, selection_process, other_information, important_dates, created_at, updated_at)
            //   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
            // } else {
            //   insertCareerQuery = `
            //     INSERT INTO scholarships (version, slug, name, short_name, scholarship_types, last_date, funding_type, region_name, careers, scholarship_details, introduction, generic_info, exam_date, admission_course,application_fee, prerequisite, percentage_required, reservation,special_needs, age,previous_year_questions, exam_language, career_pathways, exam_pattern, exam_lavel, available_seats, rewards_and_prizes, documents_required,domicile_state, exam_center, important_sources, conditions, created_at, updated_at)
            //     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,  NOW(), NOW())
            //   `;
            // }
          // return;
         
  
            
          
        }
        
      }
      // const jsonData = combineData;

      // console.log(combineData.length); // Data fetched from the protected page
    } catch (error) {
      console.error('Error fetching data with cookie:', error);
    }
  };
  

  async function getDetail(slug, token) {
    const detailApi = `https://content-api.idreamcareer.com/v2/scholarship/${slug}`;
    const response = await fetch(detailApi, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'token': token }
    });
  
    const data = await response.json();
    return data.data;
  }
  // Call the function
  fetchDataWithCookie();