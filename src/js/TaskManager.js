export default function TaskManager(storageManager, projectManager) {
    const STORAGE_KEY = 'tasks'
    const tasks = storageManager.getStorage(STORAGE_KEY)

    function getTasks() {
        return tasks
    }

    function getTaskByKey(taskKey) {
        return tasks[getTaskIndex(taskKey)]
    }

    function createTask(taskData) {
        const DEFAULT_VALUES = {
            priority: 3,
            isComplete: false,
        }

        return {
            key: generateTaskKey(),
            title: taskData.title,
            description: taskData.description,
            date: taskData.date,
            priority: taskData.priority || DEFAULT_VALUES.priority,
            isComplete: taskData.isComplete || DEFAULT_VALUES.isComplete,
            project: projectManager.getActiveProject(),
        }
    }

    function generateTaskKey() {
        const validChars =
            'abcdefghijklmnopqrstuvwsyzABCDEFGHIJKLMNOPQRSTUVWSYZ0123456789@#$&_'
        const midPoint = Math.floor(validChars.length / 2)
        return validChars
            .split('')
            .map((c) => ({ c, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map((obj) => obj.c)
            .join('')
            .slice(midPoint - 3, midPoint + 3)
    }

    function storeTask(task) {
        tasks.push(task)
        storageManager.setStorage(STORAGE_KEY, tasks)
    }

    function updateTaskProperty(taskKey, targetProperty, newValue) {
        const taskIndex = getTaskIndex(taskKey)
        tasks[taskIndex][targetProperty] = newValue
        storageManager.setStorage(STORAGE_KEY, tasks)
    }

    function getTaskIndex(taskKey) {
        return tasks.findIndex((task) => task.key === taskKey)
    }

    function deleteTask(taskKey) {
        const taskIndex = getTaskIndex(taskKey)
        tasks.splice(taskIndex, 1)
        storageManager.setStorage(STORAGE_KEY, tasks)
    }

    return {
        createTask,
        storeTask,
        updateTaskProperty,
        deleteTask,
        getTasks,
        getTaskByKey,
    }
}
