import StorageManager from './StorageManager'
import ProjectManager from './ProjectManager'
import TaskManager from './TaskManager'
import ScreenController from './ScreenController'

const storageManager = StorageManager()
const projectManager = ProjectManager(storageManager)
const taskManager = TaskManager(storageManager, projectManager)
ScreenController(taskManager, projectManager)
