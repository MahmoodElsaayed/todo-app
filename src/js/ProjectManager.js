export default function ProjectManager(storageManager) {
    const STORAGE_KEY = 'projects'
    const projects = storageManager.getStorage(STORAGE_KEY)

    function addProject(projectData) {
        projects.push(projectData)
        storageManager.setStorage(STORAGE_KEY, projects)
    }

    return { addProject }
}
