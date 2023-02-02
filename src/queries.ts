import { getFirestore, collection, getDocs, addDoc, query, getDoc, doc } from "firebase/firestore";
import { GraphQLError } from "graphql";

const getTasks = async () => {
    const tasksQuery = query(collection(getFirestore(), 'tasks'))
    return await getDocs(tasksQuery).then(value => {
        return value.docs.map(doc => {
            return { id: doc.id, ...doc.data()}
        })
    })
}

const getTaskById = async (_, { id }) => {
    const docSnap = await getDoc(doc(getFirestore(), 'tasks', id))
    
    if (docSnap.exists()) {
        return docSnap.data()
    } else {
        throw new GraphQLError('Task not found', {
            extensions: { code: 404 }
        })
    }
}

export const queries = {
    getTasks,
    getTaskById
}