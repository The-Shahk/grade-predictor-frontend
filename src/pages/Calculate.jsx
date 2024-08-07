import React, {useState, useEffect} from 'react';
import './calculate.css';
import Select from 'react-select';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function Calculate () {
  const token = sessionStorage.getItem("token");

  const [grades, setGrades] = useState(new Array(100).fill(0)); //initialises array of all user entered grades
  const [subjects, setSubjects] = useState(new Array(100).fill('')); //initialises array of all user entered subjects
  const [gcses, setGcses] = useState([1, 2, 3, 4, 5, 6]); //array of number of rows of gcses
  const [aLevels, setALevels] = useState([1, 2, 3]); //array of number of rows of a levels
  const [aLevelSubs, setALevelSubs] = useState(new Array(100).fill('')); //initialises array of all user entered subjects
  const [results, setResults] = useState([]);

  const navigate = useNavigate();

  //this reacts to all instances where an update is made to the page
  useEffect(() => {
    const handleLoad = () => {
      //ensures that request can only be made if the user is authenticated
      if (token) {
        axios.get('https://grade-predictor-4a15a7937c4a.herokuapp.com/getSavedGrades',{
          'method':'get',
          headers : {
          'Content-Type':'application/json',
          //provides the authentication required for the request and indicates which user is creating the request through the token
          Authorization : "Bearer " + sessionStorage.getItem("token")
        }})
          //using the data returned from this request, the variables used for each input element are set to the values returned
          .then((response) => {
            console.log(response.data);
            //converts the string returned to a 2d object which is easier to handle through a regular expression
            let output = JSON.parse(response.data.replace(/(?<=\[)([^\[\]]+)(?=\])/g, "\"$1\""));
            
            //converts the 2d object shown above to a 2d array by mapping each item in the object to a data item in the array
            let final = output.map(item => {
              return item[0].split(',').map(str => str.trim().replace(/'/g, ''));
            });
            //needed to debug and ensure that the correct output was produced
            console.log(final)
            setResults(final);
          })
          .catch(function(error) {
            if (error.response.status===401) {
              navigate("/login");
              window.location.reload();
            }
          })
    }}
    window.addEventListener('load', handleLoad);
    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  // function to handle a change in any row of the 'Enter Grade' element of GCSEs
  const gradeChange = (event, item) => {
    console.log(event); //debugging to ensure that correct event has been recieved
    let copy = [...grades]; //object destructuring to create a copy of the subjects array
    copy[item - 1] = event.value; //sets the grade in the position of the related row to the user's input
    console.log(item) //debugging to ensure that correct row has been recieved
    setGrades(copy) //sets the grades array to the new value with the updated grade
  };

//similar function for handling the subject array and changes to subjects in a row
  const subjectChange = (event, item) => {
    console.log(event);
    let copy = [...subjects];
    copy[item - 1] = event.value;
    console.log(item)
    setSubjects(copy)    
  };

  //handling when the user removes a row in the GCSEs section
  function removeItem() {
    //object destructuring to create copies of the subjects and grades arrays
    let subCopy = [...subjects];
    let gradeCopy = [...grades];
    //removes the last existing item from these arrays using splicing
    subCopy.splice(gcses.length-1, 1)
    gradeCopy.splice(gcses.length-1, 1)
    //sets the subject and grade tables to this new item and adds a new blank item to the end
    setSubjects([...subCopy, '']);
    setGrades([...gradeCopy, 0]);
    console.log(gcses.length) //debugging to ensure that correct item was removed
    setGcses([...gcses.splice(0, gcses.length-1)]) //changes the length of the gcses table
  }

//function to handle changes of the a level subjects (works the same way as the above functions for gcse changes)
  const aLevelChange = (event, item) => {
    console.log(event);
    let copy = [...aLevelSubs];
    copy[item - 1] = event.value;
    console.log(item)

    setALevelSubs(copy)    
  };
  
// handling when the user removes a row in the A Levels section
  function removeALevels() {
    let copy = [...aLevelSubs];
    copy.splice(aLevels.length-1, 1)
    setALevelSubs([...copy, '']);
    console.log(aLevels.length+100)
    setALevels([...aLevels.splice(0, aLevels.length-1)])
  }

  function handleSubmit(event)  {
    // stops the page from reloading
    event.preventDefault()
    // defines the post request location (as defined in calculate.py)
    if (!token) {
      return axios.post(`https://grade-predictor-4a15a7937c4a.herokuapp.com/calculate`,{
        'method':'post',
        headers : {
        'Content-Type':'application/json',
        },
          grades: grades,
          subjects: subjects,
          aLevelSubs: aLevelSubs}
      ).then(response => {
        // if there is an empty column or not enough data, the error is returned
        if (!response.data[0]){
          alert('The data you have entered is not valid')
        } else {
          // otherwise the predicted grades are returned and set as the variable 'results'
            setResults(response.data)
            console.log(response.data)
        }
      })} else {
        return axios.post(`https://grade-predictor-4a15a7937c4a.herokuapp.com/saveGrades`,
        {
            grades: grades,
            subjects: subjects,
            aLevelSubs: aLevelSubs},{
            headers : {
              'Content-Type':'application/json',
              Authorization : "Bearer " + sessionStorage.getItem("token")
              },}
        ).then(response => {
          // if there is an empty column or not enough data, the error is returned
          if (!response.data[0]){
            alert('The data you have entered is not valid')
          } else {
            // otherwise the predicted grades are returned and set as the variable 'results'
              setResults(response.data)
              console.log(response.data)
          }
        })}
  }
  
 

  const gradeOptions = [ //list of all gcse grade options
    { value: 0, label: 'Enter Grade' },
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5' },
    { value: '6', label: '6' },
    { value: '7', label: '7' },
    { value: '8', label: '8' },
    { value: '9', label: '9' },
  ]

  const subjectOptions = [ //list of all subject options
    { value: '', label: 'Enter Subject' },
    { value: 'LIT', label: 'English Literature' },
    { value: 'LAN', label: 'English Language' },
    { value: 'MAT', label: 'Maths' },
    { value: 'PHY', label: 'Physics' },
    { value: 'BIO', label: 'Biology' },
    { value: 'CHE', label: 'Chemistry' },
    { value: 'FRE', label: 'French' },
    { value: 'SPA', label: 'Spanish' },
    { value: 'GER', label: 'German' },
    { value: 'MAN', label: 'Mandarin' },
    { value: 'JAP', label: 'Japanese' },
    { value: 'HIS', label: 'History' },
    { value: 'GEG', label: 'Geography' },
    { value: 'REL', label: 'Religious Education' },
    { value: 'ECO', label: 'Economics' },
    { value: 'GEL', label: 'Geology' },
    { value: 'SOC', label: 'Sociology' },
    { value: 'MUS', label: 'Music' },
    { value: 'DRA', label: 'Drama' },
    { value: 'DAN', label: 'Dance' },
    { value: 'AAD', label: 'Art and Design' },
    { value: 'MED', label: 'Media Studies' },
    { value: 'FIL', label: 'Film Studies' },
    { value: 'DAT', label: 'Design and Technology' },
    { value: 'FOO', label: 'Food Technology' },
    { value: 'COM', label: 'Computer Science' },
    { value: 'PHE', label: 'Physical Education' },
    { value: 'PSY', label: 'Psychology' },
    { value: 'AST', label: 'Astronomy' },
    { value: 'BUS', label: 'Business' },
    { value: 'ELE', label: 'Electronics' },
    { value: 'ENG', label: 'Engineering' },
    { value: 'STA', label: 'Statistics' },
    { value: 'FUR', label: 'Further Maths' },

  ]

  return (
    <div className="Calculate">
      <div className="mbody scroll" >
        <div className="title"> Enter your grades below <br /> Any duplicate grades will be removed</div>

        <div className='formBox'>
        <div className="title"> Enter GCSE grades and corresponding subjects </div>
        {gcses.map((item) => {return <div className="horizontalBox"> {/*renders the number of rows found in the list gcses*/}
          <div className='gradeElement'> Subject {item} </div> {/*adds the subject number which can be seen in the screenshots*/}
          <Select options={gradeOptions} defaultValue={gradeOptions[0]} className='gradeElement' onChange={(event) => gradeChange(event, item)}/>
          <Select options={subjectOptions} defaultValue={subjectOptions[0]} className='subjectElement' onChange={(event) => subjectChange(event, item)}/>
          {/*when the grade or subject is changed, run the funcions seen above*/}
        </div>})}
        </div>

        <div className="horizontalBox">
        <input type='button' className='calculateButton' value='+' onClick={(item) => setGcses([...gcses, gcses.length+1])}/>
        {/*when plus button is made, add a new value to the gcses array which makes a new row as shown above*/}
        <input type='button' className='calculateButton' value='-' onClick={removeItem}/>
        {/*when minus button is made, run the removeItem function*/}
        </div>
        <br />

        {/*same as above but for the a level subject section, so does not contain a grade column*/}
        <div className='formBox'>
        <div className="title"> Enter subjects you are taking or wish to take at A-Levels </div>
        {aLevels.map((item) => {return <div className="horizontalBox">
          <div className='gradeElement'> Subject {item} </div>
          <Select options={subjectOptions} defaultValue={subjectOptions[0]} className='subjectElement' onChange={(event) => aLevelChange(event, item)}/>
        </div>})}
        </div>

        <div className="horizontalBox">
        <input type='button' className='calculateButton' value='+' onClick={(item) => setALevels([...aLevels, aLevels.length+1])}/>
        <input type='button' className='calculateButton' value='-' onClick={removeALevels}/>
        </div>

        <input type='button' className='calculateButton' value='Calculate' onMouseDown={handleSubmit}/>

        {/*section to display predicted grades once generated*/}
        <div className='formBox'>
        <div className="title" style={{marginTop: 20, fontSize: 20}}> View Your Results below </div>
        {results.map((item) => {return <div className="horizontalBox"> {/*renders the number of rows found in the list gcses*/}
          <div className='gradeElement'> {item[0]} </div> {/*adds the subject number which can be seen in the screenshots*/}
          <div className='gradeElement'> {item[1]} </div> {/*adds the subject name which can be seen in the screenshots*/}
          
          {/*when the grade or subject is changed, run the funcions seen above*/}
        </div>})}
        </div>

      </div>
    </div>
  );
}

