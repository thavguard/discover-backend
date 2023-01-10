module.exports = class UserDto {
    email;
    id;
    username;
    isActivated;
    avatar;
    role;
    createdAt;
    updatedAt;

    constructor(model) {
        this.email = model.email
        this.id = model.id
        this.isActivated = model.isActivated
        this.username = model.username
        this.avatar = model.avatar
        this.role = model.role
        this.createdAt = model.createdAt
        this.updatedAt = model.updatedAt
    }
}
