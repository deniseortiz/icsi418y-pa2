import{ useState } from "react";
function Signup()
{
    const[f_name, setFName] = useState("");
    const[l_name, setLName] = useState("");
    const[username, setUsername] = useState("");
    const[password, setPassword] = useState("");
    const[message, setMessage] = useState("");

    async function handleSubmission(event)
    {
        event.preventDefault();

        try
        {
            const response = await fetch("http://localhost:9000/signup", {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    f_name: f_name,
                    l_name: l_name,
                    username: username,
                    password: password
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
            <h2>Sign Up Here
    
            </h2>
            <form onSubmit = {handleSubmission}>
                <input
                    type="text"
                    placeholder="First Name"
                    value={f_name}
                    onChange={(event) => setFName(event.target.value)}
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={l_name}
                    onChange={(event) => setLName(event.target.value)}
                />

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />

                <button type ="submit">Sign Up</button>
            </form>
            <p>{message}</p>
        </div>
    );
}
export default Signup;