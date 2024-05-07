import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import { Navigate } from "react-router-dom";
import { Box, Typography, Paper } from "@mui/material";

export function Home(){
   const authContext = useContext(AuthContext)
   const [userData, setUserData] = useState({});
   const [transactionData, setTransactionData] = useState({});

   // to modufy later
   useEffect(() => {
     fetch('/users')
       .then(response => response.json())
       .then(data => setUserData(data));

     fetch('/transactions')
       .then(response => response.json())
       .then(data => setTransactionData(data));
   }, []);

   if(!authContext.user || Date.now() > new Date( authContext.session?.validUntil).getTime()){
         authContext.setAuth(null,null)
         return <Navigate to="/">

         </Navigate>
   }
     return(
      <Box
         sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "flex-start", 
            minHeight: "100vh",
         }}
      >
         <Paper
            sx={{
               display: "flex",
               flexDirection: "column",
               alignItems: "center",
               padding: "49px",
               margin: "50px",
               backgroundColor: "blue", 
            }}
         >
            <Typography variant="h6" color="white">Current Users</Typography>
            <Typography variant="h3" color="white">{userData.totalUsers}</Typography>
         </Paper>
         
         <Paper
            sx={{
               display: "flex",
               flexDirection: "column",
               alignItems: "center",
               padding: "20px",
               margin: "50px",
               backgroundColor: "#4caf50", 
            }}
         >
            <Typography variant="h6" color="white">Total Money Spent</Typography>
            <Typography variant="h3" color="white">${transactionData.totalSpent}</Typography>
         </Paper>
         
      </Box>
     )
}
