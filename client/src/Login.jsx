import{ useState } from "react";
function Login()
{
    //stores what user is typing in
    const[username, setUsername] = useState("");
    const[password, setPassword] = useState("");
    const[message, setMessage] = useState("");

    async function handleSubmission(event)
    {
        event.preventDefault();

        try
        {
            //sends username and password
            const response = await fetch("http://localhost:9000/login", {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
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
            <h2>Login</h2>
            <form onSubmit = {handleSubmission}>
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

                <button type ="submit">Login</button>
            </form>
            <p>{message}</p>
        </div>
    );
}
export default Login;