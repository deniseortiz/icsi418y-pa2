require("dotenv").config();
const { MongoClient, ObjectId} = require("mongodb");

const express = require("express");
const client = new MongoClient(process.env.MONGO_URI);
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

//connect to MongoDB
async function connectDatabase()
{
    try{
        await client.connect();
        console.log("Connect to MongoDB");
    } catch(error){
        console.error("Could not connect to MongoDB");
        console.error(error);    
    }
}

connectDatabase();
//check server is working right
app.get("/", (req, res) => {
    res.json({
        message: "Server is running"
    });
});

//get signup data from React (frontend)
app.post("/signup", async(req,res) => {
    const {f_name, l_name, username, password} = req.body;
    if(!f_name || !l_name || !username || !password) //checking if empty/missing info
    {
        return res.status(400).json({
            message: "Required information missing"
        });
    }
    try{

    
        const db = client.db("pa2");
        const users = db.collection("users");

        //check if username is being used already
        const existingUser = await users.findOne({ username: username }); 
        if(existingUser)
        {
            return res.status(409).json({
                message: "Username already exists"
            });
        }

        //add a new user to MongoDB
        await users.insertOne({
            f_name: f_name,
            l_name: l_name,
            username: username,
            password: password
        });

        //tell frontend that the signup did work
        return res.status(201).json({
            message: "User created successfully"
        });
    }    
    catch(error)
    {
        console.error(error);
        return res.status(500).json({
            message: "Server error"
        });
    }

});

//login
app.post("/login", async(req,res) => {
    const{username, password} = req.body;

    //stop if username or password info is missing
    if(!username || !password)
    {
        return res.status(400).json({
            message: "Required information not complete"
        });
    }

    try
    {
        const db = client.db("pa2");
        const users = db.collection("users");
        //find username
        const existingUser = await users.findOne({username: username});

        if(!existingUser)
        {
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }
        //check if the password is correct/matches
        if(existingUser.password !== password)
        {
           return res.status(401).json({
                message: "Invalid username or password"
           });
        }
        return res.status(200).json({
            message: "Login successful"
        });
    }
    catch(error)
    {
        console.error(error);
        return res.status(500).json({
            message: "Server error"
        });
    }
});
//create a project
app.post("/projects", async(req,res)=>{
    const{name,description,status,project_lead_id} = req.body;
    //checks all project info was given
    if(!name ||!description ||!status ||!project_lead_id)
    {
        return res.status(400).json({
            message: "Required information incomplete"
        });
    }
    try
    {
        const db = client.db("pa2");
    
        const users = db.collection("users");
        //project lead needs to be a user
        const existingLeader = await users.findOne({

            _id: new ObjectId(project_lead_id)
        });
        
        if(!existingLeader)
        {

            return res.status(404).json({
                message: "Project lead doesn't exist"
            });
        }
        const projects = db.collection("projects");

        //create the project
        const projectResult = await projects.insertOne({ 
            name: name,
            description: description,
            status: status,
            project_lead_id: new ObjectId(project_lead_id)
        });
        const memberships = db.collection("ProjectMemberships");
        await memberships.insertOne({ //project lead must be a member
            project_id:projectResult.insertedId,

            user_id: new ObjectId(project_lead_id)
        });

        return res.status(201).json({
            message: "Project creation successful"
        });
    }
    catch(error)
    {
        console.error(error);
        return res.status(500).json({
            message: "Server error"
        });
    }
});

//get all added users for the dropdown
app.get("/users", async(req,res)=>{
    try
    {
        const db = client.db("pa2");
        const users = db.collection("users");
        const userList = await users.find().toArray();
        return res.status(200).json(userList);
    }
    catch(error)
    {
        console.error(error);
        return res.status(500).json({
            message: "Server error"
        });
    }
});
//view all projects
app.get("/projects", async(req,res)=>{
    try
    {
        const db = client.db("pa2");
        const projects = db.collection("projects");
        const users = db.collection("users");
        const projectList = await projects.find().toArray();
        for(let project of projectList)
        {
            const leader = await users.findOne({
                _id: project.project_lead_id
            });
            if(leader)
            {
                project.project_lead_name = leader.username;
            }
        }
        
        
        return res.status(200).json(projectList);
    }
    catch(error)
    {
        console.error(error);
        return res.status(500).json({
            message: "Server error"
        });
    }
});

//view all members
app.get("/members/:project_id", async(req,res)=>{
    try
    {
        const db = client.db("pa2");
        const memberships = db.collection("ProjectMemberships");
        const users = db.collection("users");

        const memberList = await memberships.find({
            project_id: new ObjectId(req.params.project_id)
        }).toArray();
        
            //look for username for each membership
            for(let member of memberList) 
            {
                const user = await users.findOne({
                    _id: member.user_id
                });
                if(user)
                {
                    member.username = user.username;
                }
            }
        return res.status(200).json(memberList);
    }
    catch(error)
    {
        console.error(error);
        return res.status(500).json({
            message: "Server error"
        });
    }
});
//add a member
app.post("/members", async(req,res)=>{
    const{project_id, user_id} = req.body;
    if(!project_id || !user_id) //project and user must be picked
    {
        return res.status(400).json({
            message: "Required information incomplete"
        });
    }
    try
    {
        const db = client.db("pa2");
        const memberships = db.collection("ProjectMemberships");

        const existingMember = await memberships.findOne({
            project_id: new ObjectId(project_id),
            user_id: new ObjectId(user_id)
        });
        
        if(existingMember)
        {
            return res.status(409).json({
                message: "User is already in this project"
            });
        }
        //if they aren't there, add them
        await memberships.insertOne({
            project_id: new ObjectId(project_id),
            user_id: new ObjectId(user_id)
        });

        return res.status(201).json({
            message:"Member added"
        });
    }
    catch(error)
    {
        console.error(error);
        return res.status(500).json({
            message: "Server error"
        });
    }
});

//delete a member
app.delete("/members", async(req,res)=>{
    const{project_id, user_id} = req.body;
    if(!project_id || !user_id)
    {
        return res.status(400).json({
            message: "Required information incomplete"
        });
    }
    try
    {
        const db = client.db("pa2");
        const projects = db.collection("projects");
        const memberships = db.collection("ProjectMemberships");

        //find the project to check the project lead member
        const project = await projects.findOne({
            _id: new ObjectId(project_id),
            
        });
        
        //will not allow project leader to be removed 
        if(project.project_lead_id.toString() == user_id)
        {
            return res.status(409).json({
                message: "Project lead can't be removed"
            });
        }

        //if they aren't the project leader, remove the project membership
        await memberships.deleteOne({
            project_id: new ObjectId(project_id),
            user_id: new ObjectId(user_id)
        });

        return res.status(200).json({
            message:"Member removed"
        });
    }
    catch(error)
    {
        console.error(error);
        return res.status(500).json({
            message: "Server error"
        });
    }
});
//start server
app.listen(9000, () => {
    console.log("Server running on port 9000");
});









