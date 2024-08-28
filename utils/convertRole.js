/**
 * 
 * @param {'Admin' | 'Team_724' | 'Head' | 'Member'} role 
 */
const convertRole = (role) => {
    let roleId;
    switch (role) {
        case 'Admin':
            roleId = 1
            break;
        case 'Team_724':
            roleId = 2
            break
        case 'Head':
            roleId = 3
            break;
        case "Member":
            roleId = 4
            break;
        default:
            roleId = 4
            break;
    }

    return roleId;
}

export default convertRole;