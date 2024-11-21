
document.addEventListener('DOMContentLoaded', async function () {
    console.log('Скрипт загружен');
    await listRecord();
    await addNewUserForm();
    //await openEditWindow()


});

const USER_ROLE = {id: 1, name: "USER"};
const ADMIN_ROLE = {id: 2, name: "ADMIN"};


//const formAddUser = document.querySelector('#newUser')

let newUser;

async function listRecord() {
    const table = document.querySelector('#tableAddAllUsers');
    table.innerHTML = "";
    fetch("admin/users")
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data)) {
                data.forEach(user => {
                    //const roles = user.roleList.map(role => role.)
                    table.innerHTML +=
                        `
                <tr>
                     <td>${user.username}</td>
                     <td>${user.password}</td>
                     <td>${user.name}</td>
                      <td>${user.surname}</td>
                      <td>${user.age}</td>
                      <td>
                          <td>
                              <button type="button" class="btn btn-info" data-bs-toggle="modal"
                                         data-bs-target="#editModal" onclick="openEditWindow(${user.id})">
                                            Изменить
                              </button>
                          </td>
                           <td>
                             <button type="button" class="btn btn-danger" data-bs-toggle="modal"
                                                data-bs-target="#deleteModal" onclick="openDeleteWindow(${user.id})">
                                            Удалить
                             </button>
                           </td>
                      </td>                                
                </tr>
                `
                })
            } else {
                console.log('Какия то ошибка');

            }
        })
        .catch(err => {
            console.log('Ошибка по катч')
        });

}

async function createNewUser(user) {
    await fetch("admin/user/add",
        {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(user)})
}

async function addNewUserForm() {
    const newUserForm = document.querySelector('#formAddUser');

    newUserForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const userName = newUserForm.querySelector("#loginNew").value.trim();
        const password = newUserForm.querySelector("#passwordNew").value.trim();
        const name = newUserForm.querySelector("#nameNew").value.trim();
        const surname = newUserForm.querySelector("#surnameNew").value.trim();
        const age = newUserForm.querySelector("#ageNew").value.trim();

        const rolesSelected = document.getElementById("roleNew");

        let roles = [];
        for (let option of rolesSelected.selectedOptions) {
            if (option.value === USER_ROLE.name) {
                roles.push(USER_ROLE);
            } else if (option.value === ADMIN_ROLE.name) {
                roles.push(ADMIN_ROLE);
            } else {
                roles.push(ADMIN_ROLE, USER_ROLE);
            }
        }

        const newUserData = {
            username: userName,
            password: password,
            name: name,
            surname: surname,
            age: age,
            roleSet: roles
        };


        const response = await createNewUser(newUserData);
        console.log("Ответ сервера ", response);
        newUserForm.reset();
        document.querySelector('#nav-tab').click();
        await listRecord();
    });
}

async function putUpdateUser(userId, editUser) {
     await fetch(`/admin/userput/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'},
        body: JSON.stringify(editUser)
    });
}

async function openEditWindow(userId) {
    console.log("Пользователь", userId);
    try {
        const response = await  fetch(`/admin/userget/${userId}`);
        if (!response.ok) {
            throw new Error('Пользователь для редактирования не найде');
        }
        const user = await response.json();
        document.querySelector('#idEdit').value = user.id;
        document.querySelector('#loginEdit').value = user.username;
        document.querySelector('#passwordEdit').value = user.password;
        document.querySelector('#nameEdit').value = user.name;
        document.querySelector('#surnameEdit').value = user.surname;
        document.querySelector('#ageEdit').value = user.age;

        const editRoles = document.querySelector('#rolesEdit');
        editRoles.innerHTML = '';
        user.roleSet.forEach(role => {
            const option = document.createElement('option');
            option.value = role.id;
            option.textContent = role.name;
            editRoles.appendChild(option);
        });
        const editModal = new bootstrap.Modal(document.querySelector('#editModal'));
        editModal.show();
    }  catch (error) {
        console.error('Ошибка при заполнении формы редактирования:', error);
    }
}

document.querySelector('#editFormBody').addEventListener('submit', async (event) => {
    event.preventDefault();
    const userId = document.querySelector('#idEdit').value;
    const roleSelected = document.querySelector('#rolesEdit');
    const modalEdit = document.querySelector('#editModal');
    let roles = [];
    for (let option of roleSelected.selectedOptions) {
        if (option.value === USER_ROLE.name) {
            roles.push(USER_ROLE);
        } else if (option.value === ADMIN_ROLE.name) {
            roles.push(ADMIN_ROLE);
        } else {
            roles.push(ADMIN_ROLE, USER_ROLE);
        }
    }
    const editUser = {
        id: userId,
        username: document.querySelector('#loginEdit').value,
        password: document.querySelector('#passwordEdit').value,
        name: document.querySelector('#nameEdit').value,
        surname: document.querySelector('#surnameEdit').value,
        age: document.querySelector('#ageEdit').value,
        roleSet: roles
    };
    //try {
        // const response = await fetch(`/admin/userput/${userId}`, {
        //     method: 'PUT',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(editUser)
        // });
        console.log("Собран пользователь" , editUser);
        const response = await putUpdateUser(userId, editUser);
        console.log('Текст ответа', response);
        await listRecord();
        const editModal = bootstrap.Modal.getInstance(modalEdit);
        editModal.hide();
        document.querySelector('#v-pills-admin-tab').click();

});


async function DeleteUser(userId) {
    await fetch(`/admin/userdel/${userId}`, {
        method: 'DELETE'});
}

async function openDeleteWindow(userId) {
    console.log("Пользователь", userId);
    try {
        const response = await  fetch(`/admin/userget/${userId}`);
        if (!response.ok) {
            throw new Error('Пользователь для редактирования не найде');
        }
        const user = await response.json();
        document.querySelector('#idDel').value = user.id;
        document.querySelector('#loginDel').value = user.username;
        document.querySelector('#passwordDel').value = user.password;
        document.querySelector('#nameDel').value = user.name;
        document.querySelector('#surnameDel').value = user.surname;
        document.querySelector('#ageDel').value = user.age;

        const deleteRoles = document.querySelector('#rolesDelete');
        deleteRoles.innerHTML = '';
        user.roleSet.forEach(role => {
            const option = document.createElement('option');
            option.value = role.id;
            option.textContent = role.name;
            deleteRoles.appendChild(option);
        });
        const deleteModal = new bootstrap.Modal(document.querySelector('#deleteModal'));
        deleteModal.show();
    }  catch (error) {
        console.error('Ошибка при заполнении формы удаления:', error);
    }
}


document.querySelector('#deleteFormBody').addEventListener('submit', async (event) => {
    event.preventDefault();
    const userId = document.querySelector('#idDel').value;
    //const roleSelected = document.querySelector('#rolesEdit');
    const modalDelete = document.querySelector('#deleteModal');
    // let roles = [];
    // for (let option of roleSelected.selectedOptions) {
    //     if (option.value === USER_ROLE.name) {
    //         roles.push(USER_ROLE);
    //     } else if (option.value === ADMIN_ROLE.name) {
    //         roles.push(ADMIN_ROLE);
    //     } else {
    //         roles.push(ADMIN_ROLE, USER_ROLE);
    //     }
    // }
    // const editUser = {
    //     id: userId,
    //     username: document.querySelector('#loginEdit').value,
    //     password: document.querySelector('#passwordEdit').value,
    //     name: document.querySelector('#nameEdit').value,
    //     surname: document.querySelector('#surnameEdit').value,
    //     age: document.querySelector('#ageEdit').value,
    //     roleSet: roles
    // };
    //try {
    // const response = await fetch(`/admin/userput/${userId}`, {
    //     method: 'PUT',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(editUser)
    // });
    //console.log("Собран пользователь" , editUser);
    await DeleteUser(userId);
    await listRecord();
    const deleteModal = bootstrap.Modal.getInstance(modalDelete);
    deleteModal.hide();
    document.querySelector('#v-pills-admin-tab').click();

});



// }
//
// function addAuthenticationUserHeader() {
//     const  userInfo = document.querySelector('#headerNavBar');
//     let navBar = "";
//     const tableAboutUser = document.querySelector('#tableAboutUser');
//     let tableUser = "";
//     fetch("admin/user")
//         .then(response => response.json())
//         .then(user => {
//             navBar = '<h5><strong>${user.username} с ролями: ${user.roleSet} </strong></h5>'
//             userInfo.innerHTML = navBar
//             uTable =
//                 `<tr>
//                         <td>${user.id}</td>
//                         <td>${user.username}</td>
//                         <td>${user.password}</td>
//                         <td>${user.name}</td>
//                         <td>${user.surname}</td>
//                         <td>${user.age}</td>
//                         <td>${user.roleSet}</td>
//                      </tr>
//                     `
//             tableAboutUser.innerHTML = uTable;
//         })
//         .catch(err => {
//             console.log("Ошибка в блоке о пользователе", err);
//         });
// }
//

