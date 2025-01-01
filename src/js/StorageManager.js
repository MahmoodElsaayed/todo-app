export default function StorageManager() {
    const REQUIRED_STORAGE_PROPERTIES = ['tasks', 'projects']
    // ensure that the necessary localStorage properties are initialized if user is new
    for (let storageProperty of REQUIRED_STORAGE_PROPERTIES) {
        if (!localStorage[storageProperty]) {
            localStorage[storageProperty] = '[]'
        }
    }
}
