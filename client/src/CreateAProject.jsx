import{useState, useEffect} from "react";
function CreateAProject()
{
    //store info the user types in or picks
    const[name, setName] = useState("");
    const[description, setDescription] = useState("");
    const[status, setStatus] = useState("");
    const[assignedLeader, setAssignedLeader] = useState("");
    const[message, setMessage] = useState("");
    const[users, setUsers] = useState([]); //storing users in project dropdown 

    useEffect(()=>{ //load users
        async function getUsers()
        {
            try
            {
                const response = await fetch("http://localhost:9000/users");
                const data = await response.json();
                setUsers(data);
            }
            catch(error)
            {
                setMessage("Couldn't load users");
            }
        }
    getUsers();

    }, []);

    async function handleSubmission(event)
    {
        event.preventDefault();

        try
        {
            const response = await fetch("http://localhost:9000/projects", {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    description: description,
                    status: status,
                    project_lead_id: assignedLeader
                })
            });

            const data = await response.json();
            setMessage(data.message);
        }
        catch(error)
        {
            setMessage("Couldn't connect to server");
        }
    }

    return(
        <div>

            <h2>Create Project</h2>

            <form onSubmit={handleSubmission}>
                <input
                    type="text"
                    placeholder="Project Name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                />
                <select
                    value={status}

                    onChange={(event) => setStatus(event.target.value)}
                >

                    <option value="">Select Status</option>
                    <option value="Planning">Planning</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                </select>
               <select
                    value={assignedLeader}

                    onChange={(event) => setAssignedLeader(event.target.value)}
                >
                    <option value ="">Select a Project Lead</option>

                    {users.map((user) => ( //goes through user list a drop down option for each
                        <option key={user._id} value={user._id}>
                            {user.username}

                        </option>
                    ))}
                </select>

                <button type="submit">Create the Project</button>
            </form>
            <p>{message}</p>
        </div>
    )
};
export default CreateAProject;