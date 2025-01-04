import StorageManager from './StorageManager'
import ProjectManager from './ProjectManager'
import TaskManager from './TaskManager'

const storageManager = StorageManager()
const projectManager = ProjectManager(storageManager)
const taskManager = TaskManager(storageManager, projectManager)
