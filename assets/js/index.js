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

function createPizzaTable() {
    let pizzaTableExist = document.getElementById('pizza_table')
    if (!pizzaTableExist) {
        let tableContainer = document.createElement('table')
        tableContainer.id = 'pizza_table'

        // Creating table Header here
        let tableHeader = document.createElement('thead')

        let tableRow = document.createElement('tr')

        let thTitles = ['Id', 'Name', 'Weight', 'Size', 'Price', 'Edit']

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

        let test = [
            { id: 0, name: 'test1', weight: '200g', size: '30cm', price: '100uah' },
            { id: 1, name: 'test2', weight: '400g', size: '35cm', price: '200uah' },
            { id: 2, name: 'test3', weight: '600g', size: '40cm', price: '300uah' },
        ]

        test.forEach(item => {
            let tableRow = document.createElement('tr')
            tableRow.id = 'element_id' + item.id
            for (let value in item) {
                let td = document.createElement('td')
                td.classList.add('cell')
                td.textContent = item[value]

                tableRow.appendChild(td)
            }
            let buttonsContainer = document.createElement('td')
            let buttonsContainerClasses = buttonsContainer.classList
            buttonsContainerClasses.add('cell')
            buttonsContainerClasses.add('buttons')

            let buttonEdit = document.createElement('button')
            buttonEdit.type = 'button'
            buttonEdit.id = 'table_edit_element' + item.id
            buttonEdit.className = 'table button'
            buttonEdit.textContent = 'Edit ID' + item.id
            buttonsContainer.appendChild(buttonEdit)

            let buttonRemove = document.createElement('button')
            buttonRemove.type = 'button'
            buttonRemove.id = 'table_remove_element' + item.id
            buttonRemove.className = 'table button'
            buttonRemove.textContent = 'Remove ID' + item.id
            buttonsContainer.appendChild(buttonRemove)

            tableRow.appendChild(buttonsContainer)
            tableBody.appendChild(tableRow)
        })

        tableContainer.appendChild(tableBody)

        let root = document.getElementsByClassName('root')[0]
        root.appendChild(tableContainer)
    }
    else {
        pizzaTableExist.classList.toggle('hidden')
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
            { inputId: 'name', placeholder: 'name' },
            { inputId: 'weight', placeholder: 'weight' },
            { inputId: 'size', placeholder: 'size' },
            { inputId: 'ingredients', placeholder: 'ingredients' },
            { inputId: 'price', placeholder: 'price' },
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
        buttonAdd.addEventListener('click', addPizza)

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

function addPizza() {
    //do something and close modal_container
    closeModalElement()
}