import{useState, useEffect} from "react";

function ViewAllProjects()
{
    //stores projects coming from mongodb
    const[projectList, setProjectList] = useState([]);

    useEffect(()=>{ //loads all projects
        async function loadProjects()
        {
            try
            {
                const response = await fetch("http://localhost:9000/projects");
                const data = await response.json();
                setProjectList(data); 
            }
            catch(error)
            {
                console.log("Couldn't load all projects");
            }
        }
        loadProjects();
    }, []);
    return(
        <div>
            <h2>Projects</h2>

            {projectList.map((project) => ( //goes through project list and shows each - aka project section
                <div className="projectSection" key={project._id}>

                    <p>Project Name: {project.name}</p>
                    <p>Description: {project.description}</p>
                    <p>Status: {project.status}</p>
                    <p>Project Lead: {project.project_lead_name}</p>
                
                </div>
            ))}
        </div>
    )
};
export default ViewAllProjects;
