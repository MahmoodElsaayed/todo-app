export default function ProjectManager(storageManager) {
    const STORAGE_KEY = 'projects'
    const projects = storageManager.getStorage(STORAGE_KEY)
    let activeProject = ''

    function addProject(projectTitle) {
        if (projects.includes(projectTitle)) {
            console.error('Cannot create duplicate projects')
            return false
        }
        projects.push(projectTitle)
        storageManager.setStorage(STORAGE_KEY, projects)
    }

    function deleteProject(projectTitle) {
        const projectIndex = projects.indexOf(projectTitle)
        if (projectIndex === -1) {
            console.error("Project doesn't exist")
            return false
        }
        projects.splice(projectIndex, 1)
        storageManager.setStorage(STORAGE_KEY, projects)
    }

    function getProjects() {
        return projects
    }

    function setActiveProject(selectedProject) {
        activeProject = selectedProject
    }

    function getActiveProject() {
        return activeProject
    }

    return {
        addProject,
        deleteProject,
        getProjects,
        setActiveProject,
        getActiveProject,
    }
}
