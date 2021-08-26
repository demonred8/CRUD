'use strict'
createModalButton()
createTableButton()

function createModalButton() {
    let button = document.createElement('button')
    button.type = 'button'
    button.id = 'modal_button'
    button.textContent = 'Open Modal'
    button.addEventListener('click', createModalElement)

    let root = document.getElementsByClassName('root')[0]
    root.appendChild(button)
}

function createTableButton() {
    let button = document.createElement('button')
    button.type = 'button'
    button.id = 'table_button'
    button.textContent = 'Open Table'
    button.addEventListener('click', createPizzaTable)

    let root = document.getElementsByClassName('root')[0]
    root.appendChild(button)
}

async function createPizzaTable() {
    let pizzaTableExist = document.getElementById('modal_table_container')
    if (!pizzaTableExist) {
        // Creating div, which will be MODAL container for table
        let modalContainer = createTableModalContainer('modal_table_container')

        let tableContainer = document.createElement('table')
        tableContainer.id = 'pizza_table'

        // Creating table Header here
        let tableHeader = document.createElement('thead')

        let tableRow = document.createElement('tr')

        let thTitles = ['Name', 'Size', 'Weight', 'Price', 'Ingridients', 'Edit']

        thTitles.forEach(item => {
            let th = document.createElement('th')
            th.classList.add('cell')
            th.textContent = item
            tableRow.appendChild(th)
        })
        tableHeader.appendChild(tableRow)
        tableContainer.appendChild(tableHeader)

        // Creating table Body here
        let tableBody = document.createElement('tbody')

        let pizzasArray = await getPizzasFromServer()
        console.log(pizzasArray)
        pizzasArray.forEach(item => {
            let tableRow = document.createElement('tr')
            tableRow.id = 'element_id' + item._id
            for (let value in item) {
                if (value !== '_id') {
                    let td = document.createElement('td')
                    td.id = 'cell_' + value + 'ID' + item._id
                    td.classList.add('cell')
                    td.textContent = item[value]
                    tableRow.appendChild(td)
                }
            }
            let buttonsContainer = document.createElement('td')
            buttonsContainer.id = 'cell_buttonsID' + item._id
            buttonsContainer.className = 'cell buttons'

            let buttonEdit = document.createElement('button')
            buttonEdit.type = 'button'
            buttonEdit.id = 'editID' + item._id
            buttonEdit.className = 'table button'
            buttonEdit.textContent = 'Edit'
            buttonEdit.addEventListener('click', editTableElement)
            buttonsContainer.appendChild(buttonEdit)

            let buttonRemove = document.createElement('button')
            buttonRemove.type = 'button'
            buttonRemove.id = 'removeID' + item._id
            buttonRemove.className = 'table button'
            buttonRemove.textContent = 'Remove'
            buttonRemove.addEventListener('click', removeTableElement)
            buttonsContainer.appendChild(buttonRemove)

            tableRow.appendChild(buttonsContainer)
            tableBody.appendChild(tableRow)
        })

        tableContainer.appendChild(tableBody)
        modalContainer.appendChild(tableContainer)

        let root = document.getElementsByClassName('root')[0]
        root.appendChild(modalContainer)
    }
    else {
        pizzaTableExist.classList.toggle('hidden')
    }
}

function createTableModalContainer(id) {
    let modalContainer = document.createElement('div')
    modalContainer.id = id
    let modalContainerClasses = modalContainer.classList
    modalContainerClasses.add('modal')
    modalContainerClasses.add('flex')
    modalContainer.addEventListener('click', closeTableModalContainer)
    return modalContainer
}

function closeTableModalContainer(event) {
    let modal = document.getElementById('modal_table_container')

    if (event.target == modal) {
        modal.classList.toggle('hidden')
    }
}

async function removeTableElement(event) {
    let eventID = (event.target.id).replace(/^(removeID)/g, '')
    let isRemovedFromServer = await removePizzaFromServer(eventID)
    if (isRemovedFromServer) {
        document.getElementById('element_id' + eventID).remove()
    }
}

function editTableElement(event) {
    let eventID = (event.target.id).replace(/^(editID)/g, '')
    let currentButtonsContainer = document.getElementById('cell_buttonsID' + eventID)

    document.getElementById('editID' + eventID).classList.toggle('hidden')
    document.getElementById('removeID' + eventID).classList.toggle('hidden')

    let buttonApply = document.createElement('button')
    buttonApply.type = 'button'
    buttonApply.id = 'applyID' + eventID
    buttonApply.className = 'table button'
    buttonApply.textContent = 'Apply'
    buttonApply.addEventListener('click', updateTableElement)

    let buttonClose = document.createElement('button')
    buttonClose.type = 'button'
    buttonClose.id = 'closeID' + eventID
    buttonClose.className = 'table button'
    buttonClose.textContent = 'Close'
    buttonClose.addEventListener('click', removeEditButtons)

    let inputs = [
        { id: 'input_nameID' + eventID, placeholder: 'Name', appendTo: 'cell_nameID' + eventID, basicValue: document.getElementById('cell_nameID' + eventID).textContent },
        { id: 'input_sizeID' + eventID, placeholder: 'Size', appendTo: 'cell_sizeID' + eventID, basicValue: document.getElementById('cell_sizeID' + eventID).textContent },
        { id: 'input_weightID' + eventID, placeholder: 'Weight', appendTo: 'cell_weightID' + eventID, basicValue: document.getElementById('cell_weightID' + eventID).textContent },
        { id: 'input_priceID' + eventID, placeholder: 'Price', appendTo: 'cell_priceID' + eventID, basicValue: document.getElementById('cell_priceID' + eventID).textContent },
        { id: 'input_ingridientsID' + eventID, placeholder: 'Ingridients', appendTo: 'cell_ingridientsID' + eventID, basicValue: document.getElementById('cell_ingridientsID' + eventID).textContent },
    ]

    inputs.forEach(item => {
        let input = document.createElement('input')
        input.id = item.id
        input.setAttribute('placeholder', item.placeholder)
        input.defaultValue = item.basicValue
        document.getElementById(item.appendTo).appendChild(input)
    })

    currentButtonsContainer.appendChild(buttonApply)
    currentButtonsContainer.appendChild(buttonClose)
}

function updateTableElement(event) {
    let eventID = (event.target.id).replace(/^(applyID)/g, '')

    let cellsToUpdate = [
        { id: 'cell_nameID' + eventID, newValue: document.getElementById('input_nameID' + eventID).value },
        { id: 'cell_sizeID' + eventID, newValue: document.getElementById('input_sizeID' + eventID).value },
        { id: 'cell_weightID' + eventID, newValue: document.getElementById('input_weightID' + eventID).value },
        { id: 'cell_priceID' + eventID, newValue: document.getElementById('input_priceID' + eventID).value },
        { id: 'cell_ingridientsID' + eventID, newValue: document.getElementById('input_ingridientsID' + eventID).value },
    ]

    let isPizzaUpdated = updatePizzaOnServer(eventID)
    if (isPizzaUpdated) {
        cellsToUpdate.forEach(item => document.getElementById(item.id).textContent = item.newValue)
        removeEditButtons(event)
    }
}

function removeEditButtons(event) {
    let eventID
    if (event.target.id.match(/^(closeID)/g)) {
        eventID = (event.target.id).replace(/^(closeID)/g, '')

        let inputsToRemove = [
            { id: 'input_nameID' + eventID },
            { id: 'input_sizeID' + eventID },
            { id: 'input_weightID' + eventID },
            { id: 'input_priceID' + eventID },
            { id: 'input_ingridientsID' + eventID },
        ]

        inputsToRemove.forEach(item => document.getElementById(item.id).remove())
    }
    if (event.target.id.match(/^(applyID)/g)) {
        eventID = (event.target.id).replace(/^(applyID)/g, '')
    }

    document.getElementById('applyID' + eventID).remove()
    document.getElementById('closeID' + eventID).remove()



    document.getElementById('editID' + eventID).classList.toggle('hidden')
    document.getElementById('removeID' + eventID).classList.toggle('hidden')
}


function getPizzasFromServer() {
    const request = new Request('https://crudcrud.com/api/5abf92a029df4f90bdb08b2b86e21df9/pizza');

    return fetch(request)
        .then(response => response.json())
        .then(data => data)
}

async function addPizzaToServer() {
    let pizzaName = document.getElementById('name').value
    let pizzaWeight = document.getElementById('weight').value
    let pizzaSize = document.getElementById('size').value
    let pizzaPrice = document.getElementById('price').value
    let pizzaIngridients = document.getElementById('ingridients').value

    let rawResponse = await fetch('https://crudcrud.com/api/5abf92a029df4f90bdb08b2b86e21df9/pizza', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({
            name: pizzaName, size: pizzaSize,
            weight: pizzaWeight,
            price: pizzaPrice,
            ingridients: pizzaIngridients
        })
    }).catch(error => {
        alert('Error: Pizza not added', error)
    })
    if (rawResponse) {
        alert('Pizza successfully added to the server!')
        closeModalElement()
    }
}

async function updatePizzaOnServer(id) {
    let getFromInputs = [
        { value: document.getElementById('input_nameID' + id).value },
        { value: document.getElementById('input_sizeID' + id).value },
        { value: document.getElementById('input_weightID' + id).value },
        { value: document.getElementById('input_priceID' + id).value },
        { value: document.getElementById('input_ingridientsID' + id).value },
    ]

    let rawResponse = await fetch('https://crudcrud.com/api/5abf92a029df4f90bdb08b2b86e21df9/pizza/' + id, {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: 'PUT',
        body: JSON.stringify({
            name: getFromInputs[0].value,
            size: getFromInputs[1].value,
            weight: getFromInputs[2].value,
            price: getFromInputs[3].value,
            ingridients: getFromInputs[4].value,
        })
    }).catch(error => {
        alert('Pizza not updated!', error)
        return false
    })
    if (rawResponse) {
        alert('Pizza successfully updated on the server')
        return true
    }
}

async function removePizzaFromServer(id) {
    let rawResponse = await fetch('https://crudcrud.com/api/5abf92a029df4f90bdb08b2b86e21df9/pizza/' + id, {
        method: 'DELETE',
    }).catch(error => {
        alert('Pizza not removed!', error)
        return false
    })
    if (rawResponse) {
        alert('Pizza successfully removed from the server')
        return true
    }
}

function createModalElement() {
    let modalContainerExist = document.getElementById('modal_container')
    if (!modalContainerExist) {
        let modalContainer = createModalContainer('modal_container')
        let modalHeader = createModalHeader('modal_header', 'Title')

        let modalContent = document.createElement('div')
        modalContent.id = 'modal_content'
        modalContent.classList.add('flex')
        modalContent.appendChild(modalHeader)

        let modalBody = document.createElement('div')
        modalBody.id = 'modal_body'
        modalBody.classList.add('flex')

        let inputs = [
            { inputId: 'name', placeholder: 'Name' },
            { inputId: 'size', placeholder: 'Size' },
            { inputId: 'weight', placeholder: 'Weight' },
            { inputId: 'price', placeholder: 'Price' },
            { inputId: 'ingridients', placeholder: 'Ingridients' },
        ]

        inputs.forEach(item => {
            let input = document.createElement('input')
            input.type = 'text'
            input.id = item.inputId
            input.setAttribute('placeholder', item.placeholder)
            modalBody.appendChild(input)
        })

        modalContent.appendChild(modalBody)

        let modalFooter = document.createElement('div')
        modalFooter.id = 'modal_footer'
        modalFooter.classList.add('flex')

        let buttonAdd = document.createElement('button')
        buttonAdd.id = 'modal_edit'
        buttonAdd.textContent = 'Add'
        buttonAdd.addEventListener('click', addPizzaToServer)

        modalFooter.appendChild(buttonAdd)

        modalContent.appendChild(modalFooter)

        modalContainer.appendChild(modalContent)
        let root = document.getElementsByClassName('root')[0]
        root.appendChild(modalContainer)
    }
    else {
        modalContainerExist.classList.toggle('hidden')
    }
}

function closeModalElement() {
    document.getElementById('modal_container').classList.toggle('hidden')
}

function closeModalContainer(event) {
    let modal = document.getElementById('modal_container')

    if (event.target == modal) {
        modal.classList.toggle('hidden')
    }
}

function createModalContainer(id) {
    let modalContainer = document.createElement('div')
    modalContainer.id = id
    let modalContainerClasses = modalContainer.classList
    modalContainerClasses.add('modal')
    modalContainerClasses.add('flex')
    modalContainer.addEventListener('click', closeModalContainer)
    return modalContainer
}

function createModalHeader(id, title) {
    let modalHeader = document.createElement('div')
    modalHeader.id = id
    modalHeader.classList.add('flex')

    let modalTitle = document.createElement('span')
    modalTitle.id = 'modal_title'
    modalTitle.textContent = title
    modalHeader.appendChild(modalTitle)

    let buttonClose = document.createElement('button')
    buttonClose.className = 'close'
    buttonClose.textContent = 'x'
    buttonClose.addEventListener('click', closeModalElement)
    modalHeader.appendChild(buttonClose)

    return modalHeader
}