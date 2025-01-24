export default function ScreenController(taskManager, projectManager) {
    const addTaskBtn = document.querySelector('#addTaskBtn')
    const addProjectBtn = document.querySelector('#addProjectBtn')
    const closeModalBtns = document.querySelectorAll('dialog .cancel-btn')
    const taskCreationForm = document.querySelector('#taskCreationForm')
    const projectCreationForm = document.querySelector('#projectCreationForm')
    const tasksContainer = document.querySelector('.tasks-container')

    function extractFormData(target) {
        const taskData = {}
        const inputFields = target.querySelectorAll(
            ':is(input, select, textarea)'
        )
        inputFields.forEach((field) => {
            if (field.type === `checkbox`) {
                taskData[field.id] = field.checked
                return
            }
            taskData[field.id] = field.value
        })
        return taskData
    }

    function generateTaskElement(task) {
        const taskTemplate =
            '<div class=task><div class=main><button class="btn complete-task-btn"></button><p class=title><p class=date></p><button class="btn accordion-btn"></button></div><div class=panel><div class="row title" data-property="title"><button class="btn edit-btn"title="edit property"></button><h4>Title</h4><output></output></div><div class="row description" data-property="description"><button class="btn edit-btn"title="edit property"></button><h4>Description</h4><output></output></div><div class="row date" data-property="date"><button class="btn edit-btn"title="edit property"></button><h4>Date</h4><output></output></div><div class="row priority" data-property="priority"><button class="btn edit-btn"title="edit property"></button><h4>Priority</h4><output></output></div><button class="btn delete-btn"title="delete task"></button></div></div>'
        const UNASSIGNED_DEFAULT_VAL = 'N/A'
        const taskElement = parseStringToHTML(taskTemplate)

        taskElement.dataset.key = task.key
        if (task.isComplete) {
            taskElement
                .querySelector('.complete-task-btn')
                .classList.add('completed')
        }
        taskElement.querySelector('.main .title').textContent =
            task.title || UNASSIGNED_DEFAULT_VAL
        taskElement.querySelector('.main .date').textContent =
            task.date || UNASSIGNED_DEFAULT_VAL
        taskElement.querySelector('.panel .title output').textContent =
            task.title || UNASSIGNED_DEFAULT_VAL
        taskElement.querySelector('.panel .description output').textContent =
            task.description || UNASSIGNED_DEFAULT_VAL
        taskElement.querySelector('.panel .date output').textContent =
            task.date || UNASSIGNED_DEFAULT_VAL
        taskElement.querySelector('.panel .priority output').textContent =
            task.priority || UNASSIGNED_DEFAULT_VAL

        // toggle task completion listener
        taskElement
            .querySelector('.complete-task-btn')
            .addEventListener('click', toggleTaskStatus)

        // toggle task accordion listener
        taskElement
            .querySelector('.accordion-btn')
            .addEventListener('click', (event) => {
                event.target.closest('.task').classList.toggle('expanded')
            })

        // task deletion listener
        taskElement
            .querySelector('.delete-btn')
            .addEventListener('click', deleteTask)

        // property editing listner
        taskElement
            .querySelectorAll('.edit-btn')
            .forEach((btn) => btn.addEventListener('click', openPropertyEditor))

        return taskElement
    }

    function addTask(event) {
        const taskData = extractFormData(event.target)
        event.target.reset() // reset submitted form

        const task = taskManager.createTask(taskData)
        taskManager.storeTask(task)

        const taskElement = generateTaskElement(task)
        tasksContainer.appendChild(taskElement)
    }

    function deleteTask(event) {
        const taskElement = event.target.closest('.task')
        taskManager.deleteTask(taskElement.dataset.key)
        taskElement.remove()
    }

    function parseStringToHTML(stringTemplate) {
        const parser = new DOMParser()
        const doc = parser.parseFromString(stringTemplate, 'text/html')
        return doc.body.firstChild
    }

    function generatePropertyEditor(property) {
        const inputFields = {
            title: '<input type="text" id="title" required minlength="1" pattern=".*\\S.*" placeholder="Enter a title" title="Title must contain at least one non-space character."/>',
            date: '<input type="date" id="date" required />',
            priority:
                '<select id="priority" required><option value="" disabled selected>--Select Priority--</option><option value="1">1</option><option value="2">2</option><option value="3">3</option></select>',
            description:
                '<textarea id="description"placeholder="Enter a description" required></textarea>',
        }
        const editingFormTemplate = `
            <form class="editing-form">${inputFields[property]}<div class="row flat"><button type="submit" class="submit-btn btn" title="edit task"></button><button type="button" class="cancel-btn btn" title="cancel"></button></div></form>
        `
        const formElement = parseStringToHTML(editingFormTemplate)

        // close task-editor listener
        formElement
            .querySelector('.cancel-btn')
            .addEventListener('click', closePropertyEditor)

        // submit task-editor listener
        formElement.addEventListener('submit', (event) => {
            event.preventDefault()
            updateTaskProperty(event)
        })

        return formElement
    }

    function openPropertyEditor(event) {
        const propertyContainer = event.target.parentElement
        // exit if editor is already open
        if (propertyContainer.querySelector('.editing-form')) {
            return
        }
        const outputElement = propertyContainer.querySelector('output')
        const formElement = generatePropertyEditor(
            propertyContainer.dataset.property
        )

        outputElement.style.display = 'none'
        propertyContainer.appendChild(formElement)
    }

    function closePropertyEditor(event) {
        const propertyContainer = event.target.closest('div[data-property]')
        const outputElement = propertyContainer.querySelector('output')
        const propertyEditor = propertyContainer.querySelector('.editing-form')

        outputElement.style.display = 'block'
        propertyEditor.remove()
    }

    function updateTaskProperty(event) {
        const [propertyName, newValue] = Object.entries(
            extractFormData(event.target)
        )[0]
        const taskElement = event.target.closest('.task')
        const outputElement = event.target.previousSibling

        taskManager.updateTaskProperty(
            taskElement.dataset.key,
            propertyName,
            newValue
        )
        outputElement.textContent = newValue

        // ensures that the .task.main text reflects the same changes as the output fields
        if (propertyName === 'title') {
            const mainTitle = taskElement.querySelector('.main .title')
            mainTitle.textContent = newValue
        }
        if (propertyName === 'date') {
            const mainDate = taskElement.querySelector('.main .date')
            mainDate.textContent = newValue
        }

        closePropertyEditor(event)
    }

    function toggleTaskStatus(event) {
        const STATUS_PROPERTY_NAME = 'isComplete'
        const taskKey = event.target.closest('.task').dataset.key
        const task = taskManager.getTaskByKey(taskKey)

        taskManager.updateTaskProperty(
            taskKey,
            STATUS_PROPERTY_NAME,
            !task.isComplete
        )

        event.target.classList.toggle('completed')
    }

    function generateProjectElement(type, project) {
        const USER_PROJECT_TYPE = 'user'
        project = project.toLowerCase()
        const projectTemplate = {
            default: `<div class="project" data-filter="${project}"><div class="project-icon"></div><p class="project-title">${project[0].toUpperCase() + project.slice(1)}</p></div>`,

            user: `<div class="project" data-filter="${project}"><div class="project-icon"></div><p class="project-title">${project[0].toUpperCase() + project.slice(1)}</p><button class="btn delete-btn"></button></div>`,
        }
        const projectElement = parseStringToHTML(projectTemplate[type])

        if (type === USER_PROJECT_TYPE) {
            // delete project listener
            projectElement
                .querySelector('.delete-btn')
                .addEventListener('click', deleteProject)
        }

        return projectElement
    }

    function addProject(event) {
        const PROJECT_TYPE = 'user'
        const projectData = extractFormData(event.target)

        event.target.reset()
        projectManager.addProject(projectData.title)

        const projectElement = generateProjectElement(
            PROJECT_TYPE,
            projectData.title
        )
        const userProjectsContainer = document.querySelector('.user-projects')

        userProjectsContainer.appendChild(projectElement)
    }

    function deleteProject(event) {
        const projectElement = event.target.closest('.project')
        const projectTitle = projectElement.dataset.filter

        projectManager.deleteProject(projectTitle)
        projectElement.remove()
    }

    addTaskBtn.addEventListener('click', () => {
        document.querySelector('#addTaskModal').showModal()
    })

    addProjectBtn.addEventListener('click', () => {
        document.querySelector('#addProjectModal').showModal()
    })

    closeModalBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            // close modal without resetting
            btn.closest('dialog').close()
        })
    })

    taskCreationForm.addEventListener('submit', addTask)

    projectCreationForm.addEventListener('submit', addProject)

    // Load projects
    document.addEventListener('DOMContentLoaded', () => {
        const DEFAULT_PROJECTS = ['day', 'week', 'all']
        const userProjects = projectManager.getProjects()

        const defaultProjectContainer =
            document.querySelector('.default-projects')
        const userProjectsContainer = document.querySelector('.user-projects')

        DEFAULT_PROJECTS.forEach((project) => {
            defaultProjectContainer.appendChild(
                generateProjectElement('default', project)
            )
        })

        userProjects.forEach((project) => {
            userProjectsContainer.appendChild(
                generateProjectElement('user', project)
            )
        })
    })
}
