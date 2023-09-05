
import development from './development'
import production from './production'
import firebaseConfig from './firebase'

function getConfig(environment: string) {
    if (environment === 'development') {
        return development
    } else if (environment === 'production') {
        return production
    } else if (environment === 'firebase') {
        return firebaseConfig
    }
}
export const config: any = getConfig(process.env.NODE_ENV)