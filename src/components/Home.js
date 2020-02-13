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
  const [getId, setId] = useState("")
  const [modalStyle] = useState(getModalStyle);
  const [anchorEl, setAnchorEl] = useState(null);
  const [name, setName] = useState("")
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
    ;
  },[])

  const handleClick = (e) => {
    console.log(e);
    const foundStudent = students.find(student => student.user_id === e);
    const foundStudentIndex = students.findIndex(student => student.user_id === e);
    const studentsClone = [...students];

    foundStudent.isEditing = true;
    studentsClone.splice(foundStudentIndex, foundStudent);
    SetStudents(studentsClone);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
 
 const id = open ? 'simple-popover' : undefined;

  const handleId = (id)=>{
    setId(id)
    
  }
  const handlName = (event) =>{
    const { name, value } = event.target;
    setName({[name]: value });
    console.log(name);
  
  }

  const handleEditChange =  (event, userId) => {
    const editClone = {...edit};
    editClone[userId]=event.target.value;
    setEdit(editClone);
    console.log('EDIT===', edit);
    // try {

    //   const res = await axios.put(`/api/changestudent/${getId}`,{name})
    //   SetStudents(res)
    // } catch(err) {console.log(err)}
  }

  const handleCheckIcon = async(userId) => {
   
    const text = edit[userId]; 
    console.log(userId, ' CHECK ICON CLICKED FOR ===', text);

     try {
      const res = await axios.put(`/api/changestudent/${userId}`,{name: text});
      console.log('RES', res);

      const newStudent = res.data;
      const newStudentIndex = students.findIndex(student => student.user_id === newStudent.user_id);
      console.log('USER', newStudentIndex);
      const allStudentsClone = [...students];
  
      newStudent.isEditing = false;
      console.log('NEW ST', newStudent);
      allStudentsClone.splice(newStudentIndex, {user_id: 2});
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
      {/* <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      > 
      
        <Typography className={classes.typography}><TextField  name="name" onChang={handlName}></TextField><Button onClick={handleEditchange}><CheckIcon/></Button></Typography>
    
        </Popover> */}
    
              {/* <Button onClick={() =>{handleClick(handleId(student.user_id))}}>
              <Edit/>
              </Button> */}
             {/* </TableCell> */}
              <TableCell align="right">{student.answer1}</TableCell>
              <TableCell align="right">{student.answer2}</TableCell>
              
            </TableRow>

        </TableBody>
      </Table>
    </TableContainer>

     )
  })

  // const displayMotal = students.map(student =>{
  //   if(getID === student.user_id) {
  //     return <Modal
  //     aria-labelledby="simple-modal-title"
  //     aria-describedby="simple-modal-description"
  //     open={open}
  //     onClose={handleClose}
  //   >
    
      
      
  //     <div>
  //       <h2 id="simple-modal-title">{student.first_name}</h2>
  //       <p id="simple-modal-description">
  //       <h1>sknbslkbnslbnslbnslf</h1>hello
  //       </p>
  //     Helll
  //     </div>
  //     <h1>{student.first_name}</h1>
  //   </Modal>
  //   }
  // })

  return (
    <div>
      {displayStudents}
      {/* {displayMotal}
      */}

    
    </div>
  );
}
