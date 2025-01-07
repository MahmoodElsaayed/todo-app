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
