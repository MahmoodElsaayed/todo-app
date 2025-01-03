export default function ProjectManager(storageManager) {
    const STORAGE_KEY = 'projects'
    const projects = storageManager.getStorage(STORAGE_KEY)

    function addProject(projectData) {
        projects.push(projectData)
        storageManager.setStorage(STORAGE_KEY, projects)
    }

    function deleteProject(projectTitle) {
        const projectIndex = projects.findIndex(
            (project) => project === projectTitle
        )
        if (projectIndex === -1) {
            console.error("Project doesn't exist")
            return false
        }
        projects.splice(projectIndex, 1)
        storageManager.setStorage(STORAGE_KEY, projects)
    }

    return { addProject, deleteProject }
}
