
import { userModel } from "../bd/model.js";
import { sessionModel } from "../bd/session.js";
import crypto from "crypto";
import { ROLES, SESSION_EXPIRY,EXPIRY_TYPE, CARB_TYPE } from "../constants.js";
import { deserializeUser, requireUser } from "../middlewares/auth.js";
import { vehiculeModel } from "../bd/vehicule.js";
import { ExpiriesModel } from "../bd/expiries.js";
import { gplModel } from "../bd/gpl.js";
import { RechargeCarburantModel } from "../bd/rechargeCarburant.js";

export function setUpRoutes(app) {
  app.get("/parcAuto", (req, res) => {
    res.json({
      message: "ok",
    });
  }),
    app.post("/auth/login", async (req, res) => {
      try {
        const {username,password } = req.body;
        if (!password || password.length < 8) {
          return res.status(400).json({
            message: "Invalid password required && <= 8",
          });
        }

        const user = await userModel.findOne({
          username,
          
        });
        if (!user) {
          return res.status(404).json({
            message: "[ERROR ] USER NOT FOUND",
          });
        }

        const valid = await user.comparePassword(password)

        if(!valid){
            return res.status(403).json({
                message : "invalid username or password"
            })
        }

        const token = crypto.randomBytes(16).toString("base64url");
        const validUntil = new Date(Date.now() + SESSION_EXPIRY);
        const session = await sessionModel.create({
          user: user._id,
          token,
          validUntil,
        });
        res.status(200).json({
          user,
          session,
        });
      } catch (e) {
        res.status(500).json({
          message: "Server error",
        });
        console.log("[ERROR] ", e.message);
      }
    });
  app.post("/users", deserializeUser, requireUser, async (req, res) => {
    try {
      const { username, password, role, title } = req.body;

      if (!Object.values(ROLES).includes(role)) {
        return res.status(403).json({
          message: "invalide role",
        });
      }

      if (res.locals.user.role != ROLES.ADMIN) {
        return res.status(403).json({
            message : "unauthorized acces for admin only"
        })
      }

      const existe= await userModel.findOne({
        username 
      })
      if (existe ){
        return res.status(403).json({ message : `username ${username} already exist`})
      }


      const user = await userModel.create({
        username,
        password,
        role,
        title,
        createdBy:res.locals.user._id
      });
      res.status(200).json({
        user,
      });
    } catch (e) {
      res.status(500).json({
        message: "Server error",
      });
      console.log("[ERROR] ", e.message);
    }
  });

  app.get("/users",deserializeUser,requireUser,async(req,res,next)=>{
        //  .limit(10).skip()
    const users= await userModel.find().populate("createdBy")
     res.json({users,message:"all users renderd"})
  });
app.put("/users/:id", deserializeUser, requireUser, async(req,res)=>{
  if(res.locals.user.role != ROLES.ADMIN){
    return (res.status(403).json({
      message :"unauthorized"
    }))
  }
  const {username, password, role,title} = req.body
  const user = await userModel.findById(req.params.id)
  user.username= username
  if(password){user.password = password}
  user.role= role
  user.title= title
  await user.save()

  res.status(200).json({
    message: "user modified", user
  })

})
 app.get("/users/:id",deserializeUser,requireUser,async (req,res)=>{
    const user = await userModel.findById(req.params.id)
    res.status(200).json({
      user,
      message :"user fetched succesfully "
    })
 })




app.delete("/users/:id", deserializeUser, requireUser, async (req, res) => {
  try {
    // Check endo admin role
    if (res.locals.user.role !== ROLES.ADMIN) {
      return res.status(403).json({
        message: "Unauthorized access. Admin role required.",
      });
    }

    // Find and delete the user 
    const user = await userModel.findOneAndDelete({ _id: req.params.id });

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    res.status(200).json({
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      message: "Server error.",
    });
  }
});


app.get("/vehicule", deserializeUser,requireUser,async (req,res) => {
  try {
    const vehicules= await vehiculeModel.find()
    res.status(200).json(vehicules);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({ message: "Server error." });
  }
});

app.get("/vehicule/:id", deserializeUser,requireUser,async (req,res) => {
  try {
    const vehicules= await vehiculeModel.findById(req.params.id)
    if(!vehicules){
      return 
      res.status(404)
    }
    res.status(200).json(vehicules);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({ message: "Server error." });
  }
});
 
app.post("/expiries",deserializeUser,requireUser,async (req,res) => {
try{
  const {type,vehicule,entryDate,km,expiryDate,expiryKm,montant,ref}=req.body
  const dbVehicule=await vehiculeModel.findById(vehicule)
  if(!vehicule){
    return res.status(404).json({ message: "veh not found." });
  }
  if(!entryDate){
    return res.status(400).json({ message: "required date missing." });
  }
  if(!km){
    return res.status(400).json({ message: "required km missing." });
  }
  if(!type){
    return res.status(400).json({ message: "type  misssing." });
  }
  if(!Object.values(EXPIRY_TYPE).includes(type)){
    return res.status(400).json({ message: "invalid type ." });

  }
  if(!montant){
    return res.status(400).json({ message: " montant value  misssing." });
  }
  if(!ref){
    return res.status(400).json({ message: " montant value  misssing." });
  }
if(type==EXPIRY_TYPE.CHAINE_DISTRIBUTION && (!expiryKm)){

return res.status(400).json({ message: "expirykm missing" });
}
if(type!==EXPIRY_TYPE.CHAINE_DISTRIBUTION && (!expiryDate)){

  return res.status(400).json({ message: "expiryDate missing" });
  }
  const expiries= await ExpiriesModel.create({
    type,
    vehicule,
    entryDate,
    km,
    expiryDate,
    expiryKm,
    montant,
    ref
  })
  res.status(200).json({ expiries, message: "expiry collection created successfuly" });

}

catch(e){
  console.error("Error fetching vehicles:",e);
  res.status(500).json({ message: "Server error." });
}


});

app.get("/expiries/:id", deserializeUser, requireUser, async (req, res) => {
  try {
    // Find the expiry entry in the database by its ID
    const expiry = await ExpiriesModel.findById( req.params.id);
   // Check ida expiry kyna  
    if (!expiry) {
      return res.status(404).json({ message: "Expiry not found." });
    }
    res.status(200).json({ expiry, message: "Expiry fetched successfully." });
  } catch (e) {
    console.log(e, "Error fetching expiry:");
    res.status(500).json({ message: "Server error." });
  }
});

app.post("/rechargeCarburant", deserializeUser, requireUser, async (req, res) => {
  try {
    const { chauffeur, vehicule, type, dateRecharge, km, montant } = req.body;
    const dbVehicule = await vehiculeModel.findById(vehicule);

    if (!chauffeur) {
      return res.status(404).json({ message: "chauffeur not found." });
    }
    if (!vehicule) {
      return res.status(404).json({ message: "vehicule not found." });
    }
    if (!Object.values(CARB_TYPE).includes(type)) {
      return res.status(400).json({ message: "invalid type." });
    }
    if (!dateRecharge) {
      return res.status(404).json({ message: "dateRecharge not found." });
    }
    if (!km) {
      return res.status(404).json({ message: "km not found." });
    }
    if (!montant) {
      return res.status(404).json({ message: "montant not found." });
    }
    const updatedVehicle = await vehiculeModel.findOneAndUpdate(
      { _id: vehicule },
      { $set: { km: km } },
      { new: true }
    );

    const recharge = await RechargeCarburantModel.create({
      chauffeur,
      vehicule,
      type,
      dateRecharge,
      km,
      montant
    });
    // dbVehicule.km = km 
    res.status(200).json({ recharge, message: "rechargeCarb collection created successfuly" });
    } catch (e) {
    console.log(e,'Error fetching recharge:');
    res.status(500).json({ message: 'Failed create recharge ' });
  }
});


app.post("/reparationGarage", deserializeUser, requireUser, async (req, res) => {
    try {
      const {vehicule,piece,entryDate,exitDate,panneDeclaree,panneReparee,montant,repairDate,} = req.body;

      // Check if the vehicule exists
      const dbVehicule = await vehiculeModel.findById(vehicule);
      if (!dbVehicule) {
        return res.status(404).json({ message: "Vehicule not found." });
      }
      if (!piece) {
        return res.status(404).json({ message: "piece not found." });
      }
      if (!entryDate) {
        return res.status(404).json({ message: "entryDate not found." });
      }
      if (!exitDate) {
        return res.status(404).json({ message: "exitDate not found." });
      }
      if (!panneDeclaree) {
        return res.status(404).json({ message: "panneDeclaree not found." });
      }
      if (!panneReparee) {
        return res.status(404).json({ message: "panneReparee not found." });
      }
      if (!montant) {
        return res.status(404).json({ message: "montant not found." });
      }
      if (!repairDate) {
        return res.status(404).json({ message: "repairDate not found." });
      }

      // Create new reparation garage entry
      const reparation = await ReparationGarageModel.create({
        vehicule,
        piece,
        entryDate,
        exitDate,
        panneDeclaree,
        panneReparee,
        montant,
        repairDate,
      });

      res.status(201).json({ reparation, message: "Reparation collection created successfully." });
    } catch (e) {
      console.e(e,"Error creating reparation collection:");
      res.status(500).json({ message: "Server error." });
    }
  });




// // Create a new vehicle
// app.post("/vehicule",  deserializeUser,requireUser,async (req,res) => {
//   try {
//     const {service, marque, model, matricule, fuel,carburant,km, etat, quota } = req.body;
//     const newVehicule = await vehiculeModel.create({service, marque, model, matricule, fuel,carburant,km, etat, quota});
//     res.status(201).json(newVehicule);
//   } catch (e) {
//     console(e,"failed to add new vehicle:");
//     res.status(500).json({ message: "Server error." });
//   }
// });

// // Update an existing vehicle
// app.put("/vehicule/:id",  deserializeUser,requireUser,async (req,res) => {
//   try {
//     const {service, marque, model, matricule, fuel,carburant,km, etat, quota } = req.body;
//     const updatedVehicule = await vehiculeModel.findByIdAndUpdate(req.params.id, {service, marque, model, matricule, fuel,carburant,km, etat, quota}, { new: true });
//     if (!updatedVehicule) {
//       return res.status(404).json({ message: "Vehicule not found." });
//     }
//     res.status(200).json(updatedVehicule);
//   } catch (error) {
//     console.error("failed to  update vehicle:", error);
//     res.status(500).json({ message: "Server error." });
//   }
// });

// Delete an existing vehicle
// app.delete("/vehicule/:id",  deserializeUser,requireUser,async (req,res) => {
//   try {
//     const deletedVehicule = await vehiculeModel.findByIdAndDelete(req.params.id);
//     if (!deletedVehicule) {
//       return res.status(404).json({ message: "Vehicle not found." });
//     }
//     res.status(200).json({ message: "Vehicle deleted successfully." });
//   } catch (error) {
//     console.error("failed to delete vehicle:", error);
//     res.status(500).json({ message: "Server error." });
//   }
// });

// app.post("/gpl", deserializeUser,requireUser,async (req, res) => {
//   try {
//     // Extract data from request body
//     const { dateRenouvellement, kilometrage, etatBouteille, observations } = req.body;

//     // Validate data (example validation, modify as needed)
//     if (!dateRenouvellement || !kilometrage || !etatBouteille) {
//       return res.status(400).json({ message: "Missing required fields." });
//     }

//     // Create new GPL form submission
//     const newGPLSubmission = await gplModel.create({
//       dateRenouvellement,
//       kilometrage,
//       etatBouteille,
//       observations
//     });

//     res.status(201).json({ gplSubmission: newGPLSubmission, message: "GPL form submitted successfully." });
//   } catch (error) {
//     console.error("Error submitting GPL form:", error);
//     res.status(500).json({ message: "Server error." });
//   }
// });




}
