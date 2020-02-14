import React, {useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Edit from "@material-ui/icons/Edit"
import axios from "axios"
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import TextField from "@material-ui/core/TextField"
import CheckIcon from '@material-ui/icons/Check';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles( theme=>({
  table: {
    minWidth: 650,
  },
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}




export default function Home() {
  const classes = useStyles();

  const [students, SetStudents] = useState([])
  const [edit, setEdit] = useState({})



  useEffect(()=>{
     axios.get("/api/students").then(response =>{

       const studentLists = response.data.map(student => {
        
         student.isEditing = false;
         return student;
       });

       SetStudents(studentLists);
       console.log('response.data: ',students);
       
     }).catch(err=>console.log(err))
    
     console.log(students.length);
  },[edit])

  const handleClick = (e) => {
    console.log(e);
    const foundStudent = students.find(student => student.user_id === e);
    const foundStudentIndex = students.findIndex(student => student.user_id === e);
    const studentsClone = [...students];

    foundStudent.isEditing = true;
    studentsClone.splice(foundStudentIndex, foundStudent);
    SetStudents(studentsClone);
  };

  

  
  
  const handleEditChange =  (event, userId) => {
    const editClone = {...edit};
    editClone[userId]=event.target.value;
    setEdit(editClone);
    console.log('EDIT===', edit);
   
  }

  const handleCheckIcon = async(userId) => {
   
    const text = edit[userId]; 
   
     try {
      const res = await axios.put(`/api/changestudent/${userId}`,{name: text});
      console.log('RES', res.data[0]);

      const newStudent = res.data[0];
      // newStudent.isEditing = false;
      const newStudentIndex = students.findIndex(student => student.user_id === newStudent.user_id);
      console.log('USER', newStudentIndex);
      const allStudentsClone = [...students];
      console.log('NEW ST befour fales', newStudent);
      newStudent.isEditing = false;
      console.log('NEW ST', newStudent);
      allStudentsClone.splice(newStudentIndex, newStudent);
      console.log('===== Clone', allStudentsClone);
      SetStudents(allStudentsClone);
      console.log('NEW STUDENTS', students);
     // SetStudents(res)
    } catch(err) {console.log(err)}
    
  }
  

  const displayStudents = students.map(student =>{
   
     return(

      <TableContainer key={student.user_id} component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>name</TableCell>
            <TableCell align="right">Answer1</TableCell>
            <TableCell align="right">Answer2</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
         <TableRow >
      {student.isEditing ? <> <TextField onChange={(e) => handleEditChange(e, student.user_id)} ></TextField>
        <Button><CheckIcon onClick={() => handleCheckIcon(student.user_id)} /></Button> </> :<TableCell component="th" scope="row">
          {student.first_name}
        <Button onClick={()=>{handleClick(student.user_id)}}>
          <Edit />
        </Button> </TableCell>}
          
              <TableCell align="right">{student.answer1}</TableCell>
              <TableCell align="right">{student.answer2}</TableCell>
              
            </TableRow>

        </TableBody>
      </Table>
    </TableContainer>

     )
  })

  

  return (
    <div>
      {displayStudents}
    </div>
  );
}
