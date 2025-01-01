export default function StorageManager() {
    const LOCALSTORAGE_USER_PROPERTIES = ['tasks', 'projects']
    // ensure that the necessary localStorage properties are initialized if user is new
    for (let storageProperty of LOCALSTORAGE_USER_PROPERTIES) {
        if (!localStorage[storageProperty]) {
            localStorage[storageProperty] = '[]'
        }
    }

    function getStorage(storageKey) {
        if (!LOCALSTORAGE_USER_PROPERTIES.includes(storageKey)) {
            console.error('Invalid storage key')
            return null
        }
        return JSON.parse(localStorage[storageKey])
    }

    return { getStorage }
}
