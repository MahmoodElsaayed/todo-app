export default function ScreenController(taskManager, projectManager) {
    const addTaskBtn = document.querySelector('#addTaskBtn')
    const closeModalBtns = document.querySelectorAll('.cancel.btn')

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
