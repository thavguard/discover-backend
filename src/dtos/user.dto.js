module.exports = class UserDto {
    email;
    id;
    username;
    isActivated;
    avatar;

    constructor(model) {
        this.email = model.email
        this.id = model.id
        this.isActivated = model.isActivated
        this.username = model.username
        this.avatar = model.avatar
    }
}