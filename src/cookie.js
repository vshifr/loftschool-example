/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если дабавляемая cookie не соответсвуте фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующией cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

filterNameInput.addEventListener('keyup', function() {
    // здесь можно обработать нажатия на клавиши внутри текстового поля для фильтрации cookie
    populateCookieTable();
});

addButton.addEventListener('click', () => {
    // здесь можно обработать нажатие на кнопку "добавить cookie"
    const name = addNameInput.value;
    const value = addValueInput.value;

    if (name) {
        setCookie(name, value);
        populateCookieTable();
    }
});

function getCookies (filterString) {
    return document.cookie
        .split(';')
        .filter(str => str.includes('='))
        .map(str => {
            const ind = str.indexOf('=');

            return {
                name: str.substr(0, ind).trim(),
                value: decodeURIComponent(str.substr(ind+1).trim())
            }

        })
        .filter(({ name, value }) => {
            return !filterString
                || name.toLowerCase().includes(filterString.toLowerCase())
                || value.toLowerCase().includes(filterString.toLowerCase());
        });
}

function setCookie(name, value) {
    document.cookie = name + '=' + encodeURIComponent(value);
}

function deleteCookie(name) {
    document.cookie = `${name} = 0; expires = ${new Date(Date.now() - 1000).toUTCString()}`;
}

function makeElement (type, text, parent, clickHandler) {
    const node = document.createElement(type);

    node.innerText = text;
    if (clickHandler) {
        node.addEventListener('click', clickHandler);
    }
    parent.appendChild(node);
}

function createCookieTableRowNode(cookie) {
    const { name, value } = cookie;
    const row = document.createElement('tr');

    makeElement('td', name, row);
    makeElement('td', value, row);
    makeElement(
        'button',
        'Удалить',
        row,
        () => {
            row.remove();
            deleteCookie(name);
        }
    );
    
    return row;
}

function populateCookieTable() {
    Array.from(listTable.children).forEach(node => node.remove()); // Delete old ones
    getCookies(filterNameInput.value).forEach(cookie => {
        listTable.appendChild(createCookieTableRowNode(cookie));
    });
}
