const usersData = JSON.parse(localStorage.getItem("usersData"))||[];

const firstNameInp = document.getElementById("")
const lastNameInp = document.getElementById("")
const emailInp = document.getElementById("")
const passwordInp = document.getElementById("")
const confirmPasswordInp = document.getElementById("")


function addUser(){
    const firstName = firstNameInp.value.trim()
    const lastName = lastNameInp.value.trim()
    const email = emailInp.value.trim()
    const password = passwordInp.value.trim()
    const confirmPassword = confirmPasswordInp.value.trim()
    
    let existedName = usersData.find((val)=>{return val.name})


}