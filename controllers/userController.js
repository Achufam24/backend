const User = require('../models/userModel')
const Experience = require('../models/experienceModel')
const jwt = require('jsonwebtoken');
const experienceModel = require('../models/experienceModel');


//create jwt token 
const createToken = (_id) => {
   return jwt.sign({_id}, "owillo", {expiresIn: '3d'})
}

//login user
const Login_user = async(req,res) => {
    const {email} = req.body;
    try {
        const user = await User.login(email,req.body.password)
        const userObject = user.toObject();
        delete userObject.password;
        delete userObject.__v
        //create token
        const token = createToken(user._id)
        
        res.status(200).json({
            status: 201,
            message: "Successful!",
            data: {
                user:userObject,
                token 
            }
        })
    } catch (error) {
        res.status(400).json({
            status: 400,
            error:error.message
        })
    }
}

//signup user
const Signup_user = async(req,res) => {
    //grab email & password from req body
    const {email,password, phoneNumber, firstName, lastName, referrralCode} = req.body

   

    try {
        if (!email) {
            throw Error("email is required")
        }
        if (!password) {
            throw new Error("password is required")
        }
        if(!phoneNumber){
            throw new Error("phoneNumber is required")
        }
    
        if (!firstName) {
            throw new Error("firstName is required")
        }
    
        if (!lastName) {
            throw new Error("lastName is required")
        }
        const user = await User.signup(req.body);

        const userObject = user.toObject();
        delete userObject.password;
        delete userObject.__v;

        //create token
        const token = createToken(user._id)
        
        res.status(201).json({
            status: 201,
            message: "Successful!",
            data: {
                user: userObject,
                token
            }
            
        })
    } catch (error) {
        res.status(400).json({
            status: 400,
            error:error.message
        })
    }
}

const editValidationRules = {
    phoneNumber: { required: false, message: "phoneNumber is optional", type: "string"  },
    userName: { required: true, message: "userName is required", type: "string" }, 
    firstName: { required: false, message: "firstName is optional", type: "string" },
    lastName: { required: false, message: "lastName is required", type: "string" },
    linkedIn: { required: true, message: "linkedIn is required", type: "string" }, 
    yearsOfExperience: { required: true, message: "yearsOfExperience is required", type: "string" }, 
    currentSalary: { required: false, message: "currentSalary is optional", type: "number" }, 
    desiredSalary: { required: false, message: "desiredSalary is optional", type: "number" }, 
    location: { required: true, message: "location is required", type: "string" }
};

const experienceValidationRules = {
    companyName: { required: true, message: "companyName is required", type: "string" },
    jobTitle: { required: true, message: "jobTitle is required", type: "string" },
    roleDescription: { required: false, message: "roleDescription is optional", type: "string" },
    startDate: { required: true, message: "startDate is required", type: "date" },
    endDate: { required: false, message: "endDate is optional", type: "date" },
    present: { required: false, message: "present is optional", type: "boolean" }
};

const validateExperienceData = (data) => {
    const errors = [];

    for (const [field, { required, message, type }] of Object.entries(experienceValidationRules)) {
        if (required && !data[field]) {
            errors.push(message);
        } else if (data[field] !== undefined) {
            if (type === "date") {
                const dateValue = new Date(data[field]);
                if (isNaN(dateValue.getTime())) {
                    errors.push(`${field} must be a valid date`);
                }
            } else if (typeof data[field] !== type) {
                errors.push(`${field} must be of type ${type}`);
            }
        }
    }

    return errors;
};


const complete_profile = async(req,res) => {
    //grab email & password from req body
    const {
        phoneNumber,
        userName,
        firstName,
        lastName, 
        linkedIn,
        yearsOfExperience,
        currentSalary,
        desiredSalary,
        location
    } = req.body;
    try {

        const validationErrors = validateUserData(req.body, editValidationRules);
        if (validationErrors?.length > 0) {
            return res.status(400).json({
                status: 400,
                error: validationErrors[0] 
            });
        }
        if (userName) {
            const check = await User.findOne({
                username: userName
            });

            if (check) {
                throw Error('Username already in use')
            }
        }

        const [city, country] = location?.split(','); 
        const updateData = {
            phoneNumber,
            userName,
            firstName,
            lastName,
            linkedIn,
            yearsOfExperience,
            currentSalary,
            desiredSalary,
            country: country || null,
            city: city || null
        };

        // Remove undefined fields
        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

        console.log(req.user);
        

        const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, { new: true });

        res.status(200).json({
            status: 200,
            message: "Profile updated successfully!"
        });

        
    } catch (error) {
        console.log(error);
        
        res.status(400).json({
            status: 400,
            error:error.message
        })
    }
}


const validateUserData = (data, rules) => {
    const errors = [];

    for (const [field, { required, message, type }] of Object.entries(rules)) {
        if (required && !data[field]) {
            errors.push(message);
        } else if (data[field] !== undefined && typeof data[field] !== type) {
            errors.push(`${field} must be of type ${type}`);
        }
    }

    return errors;
}


//login user
const fetch_user = async(req,res) => {
    try {
        const user = req.user;
        console.log('user',user);
        const id = user._id;
        console.log(id);
        
        
        
        const data = await User.findOne({
            email: user.email
        });

        console.log(data);
        
        const userObject = data.toObject();
        delete userObject.password;
        delete userObject.__v
        
        res.status(200).json({
            status: 201,
            message: "Successful!",
            data: userObject
        })
    } catch (error) {
        res.status(400).json({
            status: 400,
            error:error.message
        })
    }
}

const saveExperience = async (req, res) => {
    const experienceData = req.body;
    const validationErrors = validateExperienceData(experienceData);

    if (validationErrors?.length > 0) {
        return res.status(400).json({ errors: validationErrors[0] });
    }

    try {
        let experience;
        if (experienceData._id) {
            // Edit existing experience
            experience = await Experience.findByIdAndUpdate(experienceData._id, experienceData, { new: true });
        } else {
            experienceData.userId = req.user._id;
            // Add new experience
            experience = new Experience(experienceData);
            await experience.save();
        }
        return res.status(201).json({
            status: 201,
            message: "Successful!",
        });
    } catch (error) {
        return res.status(500).json({ error: "An error occurred while saving experience." });
    }
};


const fetchExperiences = async (req, res) => {
    try {
       const experiences = await experienceModel.find({
         userId: req.user._id
       })
        return res.status(200).json({
            status: 200,
            message: "Fetched Successfully!",
            data: experiences
        });
    } catch (error) {
        return res.status(500).json({ error: "An error occurred while saving experience." });
    }
};


const deleteExperience = async (req, res) => {
    const { id } = req.params;
    try {
       const experiences = await experienceModel.findById(id);
       if (!experiences) {
           throw Error("experience invalid id")
       }
       await experienceModel.findByIdAndDelete(experiences.id);
        return res.status(200).json({
            status: 200,
            message: "Deleted Successfully!"
        });
    } catch (error) {
        return res.status(500).json({ error: "An error occurred while saving experience." });
    }
};



module.exports = {
    Login_user,Signup_user,
    complete_profile,
    fetch_user,
    saveExperience,
    fetchExperiences,
    deleteExperience
}