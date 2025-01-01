export default function StorageManager() {
    const LOCALSTORAGE_USER_PROPERTIES = ['tasks', 'projects']

    function initializeStorage() {
        // ensures that the necessary localStorage properties are initialized if user is new
        for (let storageProperty of LOCALSTORAGE_USER_PROPERTIES) {
            if (!localStorage[storageProperty]) {
                localStorage[storageProperty] = '[]'
            }
        }
    }

    function getStorage(storageKey) {
        if (!LOCALSTORAGE_USER_PROPERTIES.includes(storageKey)) {
            console.error('Invalid storage key')
            return null
        }
        return JSON.parse(localStorage[storageKey])
    }

    function setStorage(storageKey, updatedStorage) {
        if (!LOCALSTORAGE_USER_PROPERTIES.includes(storageKey)) {
            console.error('Invalid storage key')
            return false
        }
        if (typeof updatedStorage !== 'object' || updatedStorage === null) {
            console.error('Invalid data')
            return false
        }
        localStorage[storageKey] = JSON.stringify(updatedStorage)
    }

    initializeStorage()

    return { getStorage, setStorage }
}
