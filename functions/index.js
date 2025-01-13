export const imageSource = (user) => {
    if(user.image){
        return user.image.url;
    }
    else {
        return '/images/user-placeholder.png'
    }
}