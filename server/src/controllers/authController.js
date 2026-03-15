import * as AuthService from '../services/authService.js'

export async function registerUser (req, res) 
{
   try {
     const {firstName, lastName, email, password} = req.body;
     const user = await AuthService.registerUser({firstName, lastName,email, password});
     return res.status(201).json({message: "User created Succesfully",
        user    
     })
   } catch (error) {
     if (error.message === "User Already Exists") {
            return res.status(400).json({ error: error.message });
        }
        return res.status(500).json({error: error.message})
   }
    
}

export async function loginUser(req, res)
{
    try {
        const {email, password} = req.body;
        const {user, token} = await AuthService.loginUser({email, password});
        return res.json({
            message: "Login success",
            token,
            user
        })
    } catch (error) {
         if (error.message === "User Already Exists") {
            return res.status(400).json({ error: error.message });
        }
        return res.status(500).json({error: "Internal Server Error"})
    }
}