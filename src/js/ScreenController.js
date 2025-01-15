export default function ScreenController(taskManager, projectManager) {
    const addTaskBtn = document.querySelector('#addTaskBtn')
    const closeModalBtns = document.querySelectorAll('.cancel.btn')

    function extractFormData(target) {
        const taskData = {}
        const formFields = target.querySelectorAll(
            ':is(input, select, textarea)'
        )
        formFields.forEach((field) => {
            if (field.type === `checkbox`) {
                field.value = field.checked
            }
            taskData[field.id] = field.value
        })
        return taskData
    }

    function generateTaskElement(taskData) {
        const taskTemplate =
            '<div class=task><div class=main><button class="btn complete-task-btn"></button><p class=title><p class=date></p><button class="btn accordion-btn"></button></div><div class=panel><div class="row title"><button class="btn edit-btn"title="edit property"></button><h4>Title</h4><output></output></div><div class="row description"><button class="btn edit-btn"title="edit property"></button><h4>Description</h4><output></output></div><div class="row date"><button class="btn edit-btn"title="edit property"></button><h4>Date</h4><output></output></div><div class="row priority"><button class="btn edit-btn"title="edit property"></button><h4>Priority</h4><output></output></div><div class="row project"><button class="btn edit-btn"title="edit property"></button><h4>Project</h4><output></output></div><button class="btn delete-btn"title="delete task"></button></div></div>'
        const parser = new DOMParser()
        const taskElement = parser.parseFromString(taskTemplate, 'text/html')
            .body.firstChild

        taskElement.dataset.key = taskData.key
        taskElement.querySelector('.main .title').textContent = taskData.title
        taskElement.querySelector('.main .date').textContent = taskData.date
        taskElement.querySelector('.panel .title output').textContent =
            taskData.title
        taskElement.querySelector('.panel .description output').textContent =
            taskData.description
        taskElement.querySelector('.panel .date output').textContent =
            taskData.date
        taskElement.querySelector('.panel .priority output').textContent =
            taskData.priority
        taskElement.querySelector('.panel .project output').textContent =
            taskData.project

        return taskElement
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
}
