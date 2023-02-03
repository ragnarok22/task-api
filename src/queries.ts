import { getFirestore, collection, getDocs, orderBy, limit, query, getDoc, doc, where } from "firebase/firestore";
import { GraphQLError } from "graphql";

const getTasks = async (_, { filters }) => {


    const tasksRef = collection(getFirestore(), 'tasks')
    let tasksQuery = query(tasksRef, orderBy('title'))

    if (filters) {
        const { title, description, status } = filters
        if (title) {
            tasksQuery = query(tasksQuery, where('title', '>=', title))
            tasksQuery = query(tasksQuery, where('title', '<=', title + 'z'))
        }
        if (description) {
            tasksQuery = query(tasksQuery, where('description', '==', description))
        }
        if (status) {
            tasksQuery = query(tasksQuery, where('status', '==', status))
        }
    }

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