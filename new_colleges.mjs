import mysql from 'mysql2';
import { promises as fs } from 'fs';


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
      let combineData = [];
      for(let i=11; i<=11; i++) {
        const token = await loginAndGetToken();
        console.log("sending........................", i);
        combineData = [];
        console.log("iiiiiiiiiiiiiii value....", i);
        fs.appendFile('logs.txt', `iiiiiiiiiiiiiii value....${i}\n`);
        const apiUrl = `https://content-api.idreamcareer.com/v2/college/${i}/25`;
        
        const requestData = {
            query:{
                name: ""
            },
            sort:{
                nirfOrder: 1
            }
        };
    
        // Send the POST request
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'token': token },
          body: JSON.stringify(requestData)
        });
      
        const data = await response.json();
        // console.log(data);
        combineData = data.data.collegeList;

        //
        console.log("length", combineData.length, combineData[0].id);
        fs.appendFile('logs.txt', `length${combineData.length}\n`);
      //  return;
       
    //    console.log(programOfferedData[programOfferedData.length - 1]);
        // console.log("program data",programOfferedData.length);
        for(let j=0; j < combineData.length; j++) {
          console.log(j);
          console.log(combineData[j],combineData[j].id);
          fs.appendFile('logs.txt', `combine data${combineData[j].id}\n`);
          let collageDetailResponse = await getDetail(combineData[j].id, token);
          fs.appendFile('logs.txt', `detail response${JSON.stringify(collageDetailResponse)}\n`);
          console.log(collageDetailResponse);

          // return;
          if(collageDetailResponse != 404) {
            let programOfferedData = [];
            let collageDetailProgramOfferedResponse = [];
            let p = 1;
            while(p != 0) {
                collageDetailProgramOfferedResponse = await getProgramOffered(combineData[j].id, token, p);
                fs.appendFile('logs.txt', `offered response${JSON.stringify(collageDetailProgramOfferedResponse)}\n`);
                if (collageDetailProgramOfferedResponse.length > 0) {
                    for (let m = 0; m < collageDetailProgramOfferedResponse.length; m++) {
                       let getProgramOfferedDetailsResponse =  await getProgramOfferedDetails(combineData[j].id, token, collageDetailProgramOfferedResponse[m].id);
                       console.log(getProgramOfferedDetailsResponse[0].awarded_in);
                       let customOfferedData = {
                          "city_name": getProgramOfferedDetailsResponse[0].city_name,
                          "state_name": getProgramOfferedDetailsResponse[0].state_name,
                          "country_name": getProgramOfferedDetailsResponse[0].country_name,
                          'name' : getProgramOfferedDetailsResponse[0].awarded_in,
                          'degrees' : getProgramOfferedDetailsResponse[0].award,
                          'duration_years' : getProgramOfferedDetailsResponse[0].duration_years,
                          'duration_days' : getProgramOfferedDetailsResponse[0].duration_days,
                          'duration_months' : getProgramOfferedDetailsResponse[0].duration_months,
                          'duration_months' : getProgramOfferedDetailsResponse[0].duration_months,
                          'type' : getProgramOfferedDetailsResponse[0].type,
                          'mode_id' : getProgramOfferedDetailsResponse[0].mode_id,
                          'general' : {
                            'faculty' : getProgramOfferedDetailsResponse[0].faculty,
                            'specialization' : getProgramOfferedDetailsResponse[0].specialization,
                            'super_specialization' : getProgramOfferedDetailsResponse[0].super_specialization,
                            'approved_by' : getProgramOfferedDetailsResponse[0].approved_by,
                          },
                          'elegibility' : [],
                          'exams' : [],
                          'cost' : [],
                          'intake' : [],
                          'admissions' : [],
                          'scholarships' : []
                       };
    
                       if(getProgramOfferedDetailsResponse[0].elegibility.length > 0) {
                          customOfferedData.elegibility = {
                            'score' : getProgramOfferedDetailsResponse[0].elegibility[0].score,
                            'class' : getProgramOfferedDetailsResponse[0].elegibility[0].standard_name,
                            'subjects' : getProgramOfferedDetailsResponse[0].elegibility[0].subjects.map(subject => subject.subject_name),
                          }
                       }
    
                       if(getProgramOfferedDetailsResponse[0].exams.length > 0) {
                          customOfferedData.exams = getProgramOfferedDetailsResponse[0].exams.map(exam => ({
                                entrance_exam_name: exam.entrance_exam_name,
                                sections: exam.sections.map(section => ({
                                    name: section.name
                                }))
                          }))
                       }
                       
                       if(getProgramOfferedDetailsResponse[0].cost.length > 0) {
                          customOfferedData.cost = getProgramOfferedDetailsResponse[0].cost.map(item => {
                            const parsedMetadata = JSON.parse(item.metadata);
                            return parsedMetadata.tuition; // Return only the "tuition" object
                          })
                       }
    
    
                       if(getProgramOfferedDetailsResponse[0].intake.length > 0) { 
                          customOfferedData.intake = {
                            'commencement_month' : getProgramOfferedDetailsResponse[0].intake[0].month_id,
                            'quota' : getProgramOfferedDetailsResponse[0].intake[0].quota.map(item => ({
                              "category_id": item.category_id,
                              "category_name": (item.category_id == 29) ? 'ST' : (item.category_id == 7) ? 'General Quota' : (item.category_id == 26) ? 'SC' : (item.category_id == 17) ? 'OBC' : '',
                              "value" : item.value
                            })),
                        }
                       }
    
                       let admissionsObj = {
                        'admission_name' : '',
                        'applications_open':'',
                        'commencement' : ''
                       }
                       if(getProgramOfferedDetailsResponse[0].criteria.length > 0) {
                          admissionsObj.admission_name = getProgramOfferedDetailsResponse[0].criteria[0].name;
                       }
    
                       if(getProgramOfferedDetailsResponse[0].important_dates.length > 0) {
                        admissionsObj.applications_open = getProgramOfferedDetailsResponse[0].important_dates[0].admission_open_month_id;
                        admissionsObj.commencement = getProgramOfferedDetailsResponse[0].important_dates[0].commencement_month_id;
                       }
    
                       customOfferedData.admissions = admissionsObj;
    
                       if(getProgramOfferedDetailsResponse[0].scholarships.length > 0) {
                        customOfferedData.scholarships = getProgramOfferedDetailsResponse[0].scholarships.flatMap(scholarship => 
                          scholarship.scholarship_details.map(detail => ({
                            name: detail.name,
                            slug: detail.slug
                          }))
                        )
                       }
                      //  collageDetailProgramOfferedResponse[m]= getProgramOfferedDetailsResponse[0];
                      console.log("custom data.....");
                      console.log(customOfferedData);
                      // console.log(customOfferedData.scholarships);
                      // console.log(customOfferedData.exams[0].sections);
                       collageDetailProgramOfferedResponse[m]= customOfferedData;
                    }
                    programOfferedData.push(...collageDetailProgramOfferedResponse);
                }
                
                if (collageDetailProgramOfferedResponse.length === 0) {
                    break;
                }
    
                p++;
    
            }
    
            // console.log(programOfferedData);
            // return;
    
              const collageData = [
                combineData[j].name,
                combineData[j].type,
                combineData[j].country,
                combineData[j].state,
                combineData[j].city,
                JSON.stringify(combineData[j].approvedBy),
                combineData[j].qsRank,
                combineData[j].qsValue,
                combineData[j].nirfOrder,
                combineData[j].qsRankGivenBy,
                JSON.stringify(combineData[j].courses),
                JSON.stringify(combineData[j].accreditation),
                JSON.stringify(combineData[j].affiliatedBy),
                JSON.stringify(collageDetailResponse.ranking),
                JSON.stringify(collageDetailResponse.levels),
                JSON.stringify(collageDetailResponse.faculties),
                JSON.stringify(collageDetailResponse.specializations),
                JSON.stringify(collageDetailResponse.super_specializations),
                JSON.stringify(collageDetailResponse.types),
                JSON.stringify(collageDetailResponse.programs),
                JSON.stringify(collageDetailResponse.award_in),
                JSON.stringify(programOfferedData)
              ];
      
              connection.connect(err => {
                if (err) {
                  console.error('Error connecting to MySQL:', err);
                  return;
                }
                console.log('Connected to MySQL');
                const createCollagesTableQuery = `
                  CREATE TABLE IF NOT EXISTS colleges (
                    id BIGINT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) DEFAULT NULL,
                    type VARCHAR(255) DEFAULT NULL,
                    country VARCHAR(255) DEFAULT NULL,
                    state VARCHAR(255) DEFAULT NULL,
                    city VARCHAR(255) DEFAULT NULL,
                    approved_by LONGTEXT DEFAULT NULL,
                    qs_rank VARCHAR(255) DEFAULT NULL,
                    qs_value VARCHAR(255) DEFAULT NULL,
                    nirf_order VARCHAR(255) DEFAULT NULL,
                    qs_rank_given_by VARCHAR(255) DEFAULT NULL,
                    courses LONGTEXT DEFAULT NULL,
                    accreditation LONGTEXT DEFAULT NULL,
                    affiliated_by LONGTEXT DEFAULT NULL,
                    ranking LONGTEXT DEFAULT NULL,
                    levels LONGTEXT DEFAULT NULL,
                    faculties LONGTEXT DEFAULT NULL,
                    specializations LONGTEXT DEFAULT NULL,
                    super_specializations LONGTEXT DEFAULT NULL,
                    types LONGTEXT DEFAULT NULL,
                    programs LONGTEXT DEFAULT NULL,
                    award_in LONGTEXT DEFAULT NULL,
                    program_offered_details LONGTEXT DEFAULT NULL,
                    created_at TIMESTAMP NULL DEFAULT NULL,
                    updated_at TIMESTAMP NULL DEFAULT NULL
                  );
                `;
                connection.query(createCollagesTableQuery, (err, results) => {
                  if (err) {
                    console.error('Error creating roadmap_categories table:', err);
                    return;
                  }
                  console.log('collages table created successfully');
                  const insertCollageQuery = `
                        INSERT INTO colleges (name, type, country, state, city, approved_by, qs_rank, qs_value, nirf_order, qs_rank_given_by, courses, accreditation, affiliated_by, ranking, levels,faculties, specializations, super_specializations, types,programs, award_in,program_offered_details, created_at, updated_at)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
                      `;
                    
                    connection.query(insertCollageQuery, collageData, (err, results) => {
                      if (err) {
                        console.error('Error inserting into roadmap_categories:', err);
                        return;
                      }
                      console.log('Inserted into roadmap_categories:', results.insertId);
                      fs.appendFile('logs.txt', `Inserted into roadmap_categories:${results.insertId}\n`);
                    });
                });
              })
          }
       
        }
        
      }
      // const jsonData = combineData;

      // console.log(combineData.length); // Data fetched from the protected page
    } catch (error) {
      console.error('Error fetching data with cookie:', error);
    }
  };
  

  async function getDetail(id, token) {
    const detailApi = `https://content-api.idreamcareer.com/college/${id}`;
    const response = await fetch(detailApi, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'token': token }
    });
  
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return response.status;
    }
  }


  async function getProgramOffered(id, token, i) {
    const apiUrl = `https://content-api.idreamcareer.com/college/${id}/programs/${i}/10?search=`;
    console.log(apiUrl);
    const requestData = {};
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'token': token },
        body: JSON.stringify(requestData)
    });

    const data = await response.json();
    return data;
  }

  async function getProgramOfferedDetails(id, token, detailId) {
    const apiUrl = `https://content-api.idreamcareer.com/college/${id}/programs/${detailId}`;
    console.log(apiUrl);
    const response = await fetch(apiUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'token': token },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return response.status;
    }
   
  }

  
  // Call the function
  fetchDataWithCookie();