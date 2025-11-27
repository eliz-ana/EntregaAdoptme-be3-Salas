export default class UserDTO {
    static getUserTokenFrom = (user) =>{
        return {
            userId: user._id?.toString(),
            name: `${user.first_name} ${user.last_name}`,
            role: user.role,
            email:user.email
        }
    }
}