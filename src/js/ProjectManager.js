import { startOfDay, differenceInDays } from 'date-fns'

export default function ProjectManager(storageManager) {
    const STORAGE_KEY = 'projects'
    const projects = storageManager.getStorage(STORAGE_KEY)
    let activeProject = 'day' // Default startup value

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

    function filterTasksByProject() {
        const TASKS_STORAGE_KEY = 'tasks'
        const tasks = storageManager.getStorage(TASKS_STORAGE_KEY)

        return tasks.reduce((accumulator, currentTask) => {
            const todayDate = startOfDay(new Date())
            const taskDate = startOfDay(new Date(currentTask.date))

            const differenceBetweenDates = differenceInDays(taskDate, todayDate) // Returns:
            // - Negative if taskDate is overdue (-<days diff>)
            // - Positive if taskDate is upcoming (+<days diff>)
            // - 0 if taskDate is today
            if (
                (activeProject === 'day' && differenceBetweenDates <= 0) ||
                (activeProject === 'week' && differenceBetweenDates <= 7) ||
                activeProject === currentTask.project ||
                activeProject === 'all'
            ) {
                accumulator.push(currentTask)
            }
            return accumulator
        }, [])
    }

    return {
        addProject,
        deleteProject,
        getProjects,
        setActiveProject,
        getActiveProject,
        filterTasksByProject,
    }
}
