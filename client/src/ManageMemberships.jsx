import{ useState, useEffect} from "react";
function ManageMemberships()
{
    const[projectList, setProjectList] = useState([]);
    const[userList, setUserList] = useState([]);
    const[memberList, setMemberList] = useState([]);
    const[selectedProject, setSelectedProject] = useState("");
    const[selectedUser, setSelectedUser] = useState("");
    const[message, setMessage] = useState("");
    useEffect(()=>{ //loads projects and users
        async function loadData()
        {
            try
            {
                const projectResponse = await fetch("http://localhost:9000/projects");
                const projectData = await projectResponse.json();
                setProjectList(projectData);

                const userResponse = await fetch("http://localhost:9000/users");
                const userData = await userResponse.json();
                setUserList(userData);
            }
            catch(error)
            {
                console.log("Couldn't load data");
            }

        }
        loadData();
    }, []);

    //gets members for selected project
    async function loadMembers(project_id)
    {
        try
        {
            const response = await fetch("http://localhost:9000/members/" + project_id);
            const data = await response.json();
            setMemberList(data);
        }
        catch(error)
        {
            console.log("Couldn't load members");
        }
    }

    //adds selected user to slected project
    async function addMember()
    {
        try{
            const response = await fetch("http://localhost:9000/members/",{
                method: "POST",
                headers: {
                    "Content-Type" : "application/json"

                },
                body: JSON.stringify({
                    project_id: selectedProject,
                    user_id: selectedUser
                })
            });
            const data = await response.json();
            setMessage(data.message);
            loadMembers(selectedProject);
        }
        catch(error)
        {
            setMessage("Couldn't add member");
        } 
    }
    //removes selected member
    async function removeAMember(user_id)
    {


        try{
            const response = await fetch("http://localhost:9000/members",{
                method: "DELETE",
                headers:{


                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    project_id: selectedProject,
                    user_id: user_id
                })
            });
            const data = await response.json();
            setMessage(data.message);

            loadMembers(selectedProject);
        }
        catch(error)
        {
            setMessage("Couldn't remove a member");
        }
    }

    return(
        <div>

            <h2>Manage all Memberships</h2>

            <select

                value={selectedProject}

                onChange={(event) => {
                    setSelectedProject(event.target.value);
                    loadMembers(event.target.value);
                
                }}
            >
                <option value="">Select a Project</option>

                {projectList.map((project) => (

                    <option key={project._id} value={project._id}>
                        {project.name}
                    </option>
                ))}
            </select>
            <h2>Current Members</h2>


            {memberList.map((member) => (
                <div key={member._id}>
                    <p>{member.username}</p>

                    <button onClick={() => removeAMember(member.user_id)}>Remove This Member</button>
                </div>
            ))}


            <select
                value={selectedUser}
                onChange={(event) => setSelectedUser(event.target.value)}
            >
                <option value="">Select User</option>
                {userList.map((user) => (
                    <option key={user._id} value={user._id}>
                        {user.username}
                    </option>
                ))}



            </select>

            <button onClick={addMember}>Add a Member</button>

            <p>{message}</p>

        </div>
    )
};

export default ManageMemberships;

