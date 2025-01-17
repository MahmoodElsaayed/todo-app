export default function ScreenController(taskManager, projectManager) {
    const addTaskBtn = document.querySelector('#addTaskBtn')
    const closeModalBtns = document.querySelectorAll('dialog .cancel-btn')
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
            '<div class=task><div class=main><button class="btn complete-task-btn"></button><p class=title><p class=date></p><button class="btn accordion-btn"></button></div><div class=panel><div class="row title" data-property="title"><button class="btn edit-btn"title="edit property"></button><h4>Title</h4><output></output></div><div class="row description" data-property="description"><button class="btn edit-btn"title="edit property"></button><h4>Description</h4><output></output></div><div class="row date" data-property="date"><button class="btn edit-btn"title="edit property"></button><h4>Date</h4><output></output></div><div class="row priority" data-property="priority"><button class="btn edit-btn"title="edit property"></button><h4>Priority</h4><output></output></div><button class="btn delete-btn"title="delete task"></button></div></div>'
        const unassigned = 'N/A'
        const taskElement = parseStringToHTML(taskTemplate)

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

        taskElement
            .querySelectorAll('.edit-btn')
            .forEach((btn) => btn.addEventListener('click', openPropertyEditor))

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

    function parseStringToHTML(stringTemplate) {
        const parser = new DOMParser()
        const doc = parser.parseFromString(stringTemplate, 'text/html')
        return doc.body.firstChild
    }

    function openPropertyEditor(event) {
        const propertyContainer = event.target.parentElement
        // exit if editor is already open
        if (propertyContainer.querySelector('.editing-form')) {
            return
        }
        const propertyName = propertyContainer.dataset.property
        const outputElement = propertyContainer.querySelector('output')
        const inputFields = {
            title: '<input type="text" id="title" required minlength="1" pattern=".*S.*" placeholder="Enter a title" title="Title must contain at least one non-space character."/>',
            date: '<input type="date" id="date" />',
            priority:
                '<select id="priority"><option value="" disabled selected>--Select Priority--</option><option value="1">1</option><option value="2">2</option><option value="3">3</option></select>',
            description:
                '<textarea id="description"placeholder="Enter a description"></textarea>',
        }
        const editingFormTemplate = `
            <form method="dialog" class="editing-form">${inputFields[propertyName]}<div class="row flat"><button type="submit" class="submit-btn btn" title="edit task"></button><button type="button" class="cancel-btn btn" title="cancel"></button></div></form>
        `
        const formElement = parseStringToHTML(editingFormTemplate)

        outputElement.style.display = 'none'
        propertyContainer.appendChild(formElement)
    }

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
