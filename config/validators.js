const createEatery = obj => {
    const {name, email, password} = obj;
    if(name && email && password){
        if(name.length > 2){
            if(password.length > 5){
                return checkEmail(email)
            }else{
                return {status: false, message: 'Password must be at least 6 characters long'}
            }
        }else{
            return {status: false, message: "Eatery name must be at least 3 characters long"}
        }
    }else{
        return {status: false, message: "All the fields are required"}
    }
}

const createStudent = obj => {
    const {name, email, password} = obj;
    if(name && email && password){
        if(name.length > 2){
            if(password.length > 5){
                return checkEmail(email)
            }else{
                return {status: false, message: 'Password must be at least 6 characters long'}
            }
        }else{
            return {status: false, message: "Student name must be at least 3 characters long"}
        }
    }else{
        return {status: false, message: "All the fields are required"}
    }
}

const checkEmail = email => {
    const splitEmail = email.split('@')
    const username = splitEmail[0]
    const domain = splitEmail[1]
    if(username && domain){
        const splitDomain = domain.split('.')
        const domainName = splitDomain[0]
        const domainOrg = splitDomain[1]
        if(domainName && domainOrg){
            if(domainOrg.length > 1){
                return {status: true}
            }else{
                return {status: false, message: 'Invalid email address'}
            }
        }else{
            return {status: false, message: 'Invalid email address'}
        }
    }else{
        return {status: false, message: 'Invalid email address'}
    }
}

const checkLogin = obj => {
    const {email, password} = obj;
    if(email && password){
        const {status, message} = checkEmail(email)
        if(status){
            if(password.length > 5){
                return {status: true}
            }else{
                return {status: false, message: 'Password length must be at least 6 characters'}
            }
        }else{
            return {status, message}
        }
    }else{
        return {status:false, message: 'All the fields are required'}
    }
}

export default {
    createEatery,
    createStudent,
    checkLogin
}