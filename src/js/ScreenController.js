export default function ScreenController(taskManager, projectManager) {
    const addTaskBtn = document.querySelector('#addTaskBtn')
    const closeModalBtns = document.querySelectorAll('.cancel.btn')
    const taskCreationForm = document.querySelector('#taskCreationForm')
    const tasksContainer = document.querySelector('.tasks-container')

    function extractFormData(target) {
        const taskData = {}
        const formFields = target.querySelectorAll(
            ':is(input, select, textarea)'
        )
        formFields.forEach((field) => {
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
            '<div class=task><div class=main><button class="btn complete-task-btn"></button><p class=title><p class=date></p><button class="btn accordion-btn"></button></div><div class=panel><div class="row title"><button class="btn edit-btn"title="edit property"></button><h4>Title</h4><output></output></div><div class="row description"><button class="btn edit-btn"title="edit property"></button><h4>Description</h4><output></output></div><div class="row date"><button class="btn edit-btn"title="edit property"></button><h4>Date</h4><output></output></div><div class="row priority"><button class="btn edit-btn"title="edit property"></button><h4>Priority</h4><output></output></div><div class="row project"><button class="btn edit-btn"title="edit property"></button><h4>Project</h4><output></output></div><button class="btn delete-btn"title="delete task"></button></div></div>'
        const parser = new DOMParser()
        const taskElement = parser.parseFromString(taskTemplate, 'text/html')
            .body.firstChild
        const unassigned = 'NA/A'

        taskElement.dataset.key = task.key
        if (task.isComplete) {
            taskElement
                .querySelector('.complete-task-btn')
                .classList.add('completed')
        }
        taskElement.querySelector('.main .title').textContent =
            task.title || unassigned
        taskElement.querySelector('.main .date').textContent =
            task.date || unassigned
        taskElement.querySelector('.panel .title output').textContent =
            task.title || unassigned
        taskElement.querySelector('.panel .description output').textContent =
            task.description || unassigned
        taskElement.querySelector('.panel .date output').textContent =
            task.date || unassigned
        taskElement.querySelector('.panel .priority output').textContent =
            task.priority || unassigned
        taskElement.querySelector('.panel .project output').textContent =
            task.project || unassigned

        taskElement
            .querySelector('.complete-task-btn')
            .addEventListener('click', (event) => {
                event.target.classList.toggle('completed')
            })

        taskElement
            .querySelector('.accordion-btn')
            .addEventListener('click', (event) => {
                event.target.closest('.task').classList.toggle('expanded')
            })

        taskElement
            .querySelector('.delete-btn')
            .addEventListener('click', deleteTask)

        return taskElement
    }

    function addTask(event) {
        const taskData = extractFormData(event.target)
        event.target.reset()

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

    // Open task modal
    addTaskBtn.addEventListener('click', () => {
        document.querySelector('#addTaskModal').showModal()
    })

    // Close any open modal (without resetting)
    closeModalBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            btn.closest('dialog').close()
        })
    })

    taskCreationForm.addEventListener('submit', addTask)
}
