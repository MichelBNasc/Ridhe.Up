'use strict'

const openModal = () => document.getElementById('modal').classList.add('active')

const closeModal = () => {
  document.getElementById('modal').classList.remove('active')
  fieldsClear()
}

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_heroi')) ?? []
const setLocalStorage = dbHeroi =>
  localStorage.setItem('db_heroi', JSON.stringify(dbHeroi))

//--EXCLUIR HERÓI--//
const deleteHeroi = index => {
  const dbHeroi = readHeroi()
  dbHeroi.splice(index, 1)
  setLocalStorage(dbHeroi)
}

//--EDITAR HERÓI--//
const updateHeroi = (index, heroi) => {
  const dbHeroi = readHeroi()
  dbHeroi[index] = heroi
  setLocalStorage(dbHeroi)
}

//--LER HERÓI--//
const readHeroi = () => getLocalStorage()

//--CRIAR HERÓI--//
const createHeroi = heroi => {
  const dbHeroi = getLocalStorage()
  dbHeroi.push(heroi)
  setLocalStorage(dbHeroi)
}

//--LAYOUT INTERAÇÕES--//
const heroiValidFields = () => {
  return document.getElementById('formHeroi').reportValidity()
}

const fieldsClear = () => {
  const fields = document.querySelectorAll('.modal-field')
  fields.forEach(field => (field.value = ''))
}

const registerHeroi = () => {
  if (heroiValidFields()) {
    const heroi = {
      nome: document.getElementById('nome').value,
      codinome: document.getElementById('codinome').value,
      distrito: document.getElementById('distrito').value,
      poderes: document.getElementById('poderes').value
    }
    const index = document.getElementById('nome').dataset.index
    if (index == 'new') {
      createHeroi(heroi)
      updateTable()
      closeModal()
    } else {
      updateHeroi(index, heroi)
      updateTable()
      closeModal()
    }
  }
}

const createLine = (heroi, index) => {
  const newLine = document.createElement('tr')
  newLine.innerHTML = `
    <td><img src="img/icons/img.png" alt="Sem imagem"></td>
    <td>${heroi.nome}</td>
    <td>${heroi.codinome}</td>
    <td>${heroi.distrito}</td>
    <td>${heroi.poderes}</td>
    <td>
      <button id="editar-${index}" type="button" class="button green"><img src="img/icons/edit.png" alt="Sem imagem"></button>
      <button id="excluir-${index}" type="button" class="button red"><img src="img/icons/bin.png" alt="Sem imagem"></button>
    </td>
    `
  document.querySelector('#tbHeroi>tbody').appendChild(newLine)
}

const tableClear = () => {
  const lines = document.querySelectorAll('#tbHeroi> tbody tr')
  lines.forEach(line => line.parentNode.removeChild(line))
}

const updateTable = () => {
  const dbHeroi = readHeroi()
  tableClear()
  dbHeroi.forEach(createLine)
}

const fieldsComplete = heroi => {
  document.getElementById('nome').value = heroi.nome
  document.getElementById('codinome').value = heroi.codinome
  document.getElementById('distrito').value = heroi.distrito
  document.getElementById('poderes').value = heroi.poderes
  document.getElementById('nome').dataset.index = heroi.index
}

const editHeroi = index => {
  const heroi = readHeroi()[index]
  heroi.index = index
  fieldsComplete(heroi)
  openModal()
}

const editDelete = eventHeroi => {
  if (eventHeroi.target.type == 'button') {
    const [action, index] = eventHeroi.target.id.split('-')
    if (action == 'editar') {
      editHeroi(index)
    } else {
      const heroi = readHeroi()[index]
      const response = confirm(`Deseja mesmo excluir o Herói ${heroi.codinome}`)
      if (response) {
        deleteHeroi(index)
        updateTable()
      }
    }
  }
}

updateTable()

//--EVENTOS--//
document.getElementById('cadastrarCliente').addEventListener('click', openModal)

document.getElementById('modalClose').addEventListener('click', closeModal)

document.getElementById('registrar').addEventListener('click', registerHeroi)

document.getElementById('cancelar').addEventListener('click', closeModal)

document.querySelector('#tbHeroi>tbody').addEventListener('click', editDelete)

//--FILTER--//
document.getElementById('button2').addEventListener('click', pesquisar)

function pesquisar() {
  var coluna = '4'
  var filtrar, tabela, tr, td, th, i

  filtrar = document.getElementById('busca')
  filtrar = filtrar.value.toUpperCase()

  tabela = document.getElementById('tbHeroi')
  tr = tabela.getElementsByTagName('tr')
  th = tabela.getElementsByTagName('th')

  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName('td')[coluna]

    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filtrar) > -1) {
        tr[i].style.display = ''
      } else {
        tr[i].style.display = 'none'
      }
    }
  }
}

//--IMAGE UPLOAD--//
var btnClose = document.querySelector('.close-preview-js')
var output = document.getElementById('new')
var loaderFile = function (event) {
  var reader = new FileReader()
  reader.onload = function () {
    output.style.display = 'block'
    btnClose.style.display = 'block'
    output.style.backgroundImage = 'url(' + reader.result + ')'
  }
  reader.readAsDataURL(event.target.files[0])
}

var editarAvatar = document.querySelector('.editar-content')
var buttonFile = document.getElementById('file-preview-js')

editarAvatar.addEventListener('click', function () {
  buttonFile.click()
})

btnClose.addEventListener('click', function () {
  btnClose.style.display = 'none'
  output.style.backgroundImage = "url('')"
  document.getElementById('file-preview-js').value = ''
})
