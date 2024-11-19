
document.addEventListener('DOMContentLoaded', async function () {
    console.log('Скрипт загружен');
    await listRecord();
    await addNewUserForm();


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
                    <td>${user.id}</td>
                                <td>${user.username}</td>
                                <td>${user.password}</td>
                                <td>${user.name}</td>
                                <td>${user.surname}</td>
                                <td>${user.age}</td>
                                <td>
                                    <td>
                                        <button type="button" className="btn btn-info" data-bs-toggle="modal"
                                                data-bs-target="#editModal">
                                            Изменить
                                        </button>
                                    </td>
                                    <td>
                                        <button type="button" className="btn btn-danger" data-bs-toggle="modal"
                                                data-bs-target="#deleteModal">
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
// formAddUser.addEventListener("click", function (event) {
//     event.preventDefault();
//     newUser = {
//         username: document.querySelector('#loginNew').nodeValue,
//         password: document.querySelector('#passwordNew').nodeValue,
//         name: document.querySelector('#nameNew').nodeValue,
//         surname: document.querySelector('#surnameNew').nodeValue,
//         age: document.querySelector('#ageNew').nodeValue,
//         roleSet: Array.from(document.getElementById("roleNew").selectedOptions).map(option => option.value)
//     };
// });
//
// function addUser(newUser) {
//     try {
//         const response = fetch("admin/user/add", {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(newUser)
//         });
//         if (response.ok) {
//             console.log("Пользователь добавлен");
//             formAddUser.reset();
//             document.querySelector('a#v-pills-admin').click();
//             addTableUsers();
//         }
//     } catch (error) {
//         console.error('Ошибка добавления пользователя', error)
//     }
//
//     addNewUserTabPane.addEventListener('click', event => {
//         if (event.target.classList.contains('btn-save')) {
//             addUser(newUser);
//             formAddUser.reset();
//             document.querySelector('a#v-pills-admin').click();
//         }
//     });
// }
// async function openEditWindow(userId) {
//     try {
//         const response = await  fetch('/admin/user/${userId}}');
//         if (!response.ok) {
//             throw new Error('Пользователь для редактирования не найде');
//         }
//         const user = await response.json();
//         document.querySelector('#idEdit').value = user.id;
//         document.querySelector('#loginEdit').value = user.username;
//         document.querySelector('#passwordEdit').value = user.password;
//         document.querySelector('#nameEdit').value = user.name;
//         document.querySelector('#surnameEdit').value = user.surname;
//         document.querySelector('#ageEdit').value = user.age;
//
//         const editRoles = document.querySelector('#rolesEdit');
//         editRoles.innerHTML = '';
//         user.roleSet.forEach(role => {
//             const option = document.createElement('option');
//             option.value = role.id;
//             option.textContent = role.name;
//             editRoles.appendChild(option);
//         });
//         const editModal = new bootstrap.Modal(document.querySelector('#editModal'));
//         editModal.show();
//     }  catch (error) {
//         console.error('Ошибка при заполнении формы редактирования:', error);
//     }
// }
//
// document.querySelector('#editFormBody').addEventListener('submit', async (event) => {
//     event.preventDefault();
//     const userId = document.querySelector('#idEdit').value;
//     const editUser = {
//         id: userId,
//         username: document.querySelector('#loginEdit').value,
//         password: document.querySelector('#passwordEdit').value,
//         name: document.querySelector('#nameEdit').value,
//         surname: document.querySelector('#surnameEdit').value,
//         age: document.querySelector('#ageEdit').value,
//         roleSet: Array.from(document.querySelector('#rolesEdit').selectedOptions).map(option => option.value)
//     };
//     try {
//         const response = await fetch('/admin/user/${userId}', {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(editUser)
//         });
//         let responseText = await response.text();
//         console.log('Текст ответа', responseText);
//         if (!response.ok) {
//             const err = JSON.parse(responseText);
//             throw new Error('Ошибка обновления пользователя ' + (err.message || 'Неизвестная ошибка'));
//         }
//         const updateUser = JSON.parse(responseText);
//         console.log('Пользователь обновлен ', updateUser);
//         await addTableUsers();
//         const editModal = bootstrap.Modal.getInstance(document.querySelector('#editModalWindow'));
//         if (editModal) {
//             editModal.hide();
//         }
//     } catch (err) {
//         console.log('Ошибка при обновлении пользователя', err);
//         await addTableUsers();
//     }
//
// });
