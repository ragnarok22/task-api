import { getFirestore, collection, doc, addDoc, query, deleteDoc, updateDoc } from "firebase/firestore";

export const addTask = async (_, data) => {
    try {
        const taskId = await addDoc(collection(getFirestore(), 'tasks'), {
            title: data.title,
            status: data.status || "PENDING",
            description: data.description || "",

        }).then(doc => doc.id)
        return {
            id: taskId,
            title: data.title,
            description: data.description,
            status: data.status
        }
    } catch (error) {
        console.error(error)
    }

}

export const updateTask = async (_, data) => {
    await updateDoc(doc(getFirestore(), 'tasks', data.task.id), data)
    return {code: 200, message: "updated"}
}

export const removeTask = async (_, { id }) => {
    try {
        await deleteDoc(doc(getFirestore(), 'tasks', id))
        return {code: '201' }
    } catch (error) {
        console.error('Cant remove')
    }
}

export const mutations = {
    addTask,
    updateTask,
    removeTask
}
