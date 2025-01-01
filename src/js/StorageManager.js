export default function StorageManager() {
    const REQUIRED_STORAGE_PROPERTIES = ['tasks', 'projects']
    // ensure that the necessary localStorage properties are initialized if user is new
    for (let storageProperty of REQUIRED_STORAGE_PROPERTIES) {
        if (!localStorage[storageProperty]) {
            localStorage[storageProperty] = '[]'
        }
    }

    function getStorage(storageKey) {
        return localStorage[storageKey]
            ? JSON.parse(localStorage[storageKey])
            : null
    }

    return { getStorage }
}
