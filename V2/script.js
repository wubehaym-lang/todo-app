let todoLists = JSON.parse(localStorage.getItem('todoLists')) || [];

const inputAction = document.getElementById('inputAction');
const actionTime = document.getElementById('actionTime');
const addBtn = document.getElementById('add-btn');
const errorBox = document.querySelector('.error-box');
let filter = 'all';
let sortTodo = 'Added Date';

displayTodoList()

addBtn.addEventListener('click', ()=> {
  todoId = localStorage.getItem('todoId') || 1;
  if(inputAction.value.trim() === '' || actionTime.value === ''){
   renderErrorBox();
  } else{
    todoLists.push({
      actionTake: inputAction.value,
      actionTakeTime: actionTime.value,
      isCompleted: false,
      isEditing: false,
      addOrder: todoId++
    });
  }
  
  displayTodoList();
  inputAction.value = '';
  actionTime.value = '';

  localStorage.setItem('todoId', todoId);
});

document.querySelectorAll('.nav-btn').forEach((navBtn)=> {
  navBtn.addEventListener('click', ()=> {
    BtnText = navBtn.innerText;
    const spans = document.querySelector('.span');
    spans.classList.remove('left');
    spans.classList.remove('center');
    spans.classList.remove('right');

    if(BtnText === 'All'){
      filter = 'all';
      spans.classList.add('left');
    } else if(BtnText === 'Active'){
      filter = 'active';
      spans.classList.add('center');
    } else if(BtnText === 'Completed'){
      filter = 'completed';
      spans.classList.add('right');
    }

    displayTodoList();
  });
});

function filterTodos(todoList){
  let result = '';

  if(todoList === true && filter === 'active'){
    result = 'hidden';
    
  } else if(todoList === false && filter === 'completed'){
    result = 'hidden';
    
  } else if(filter === 'all'){
    result = '';
  }

  return result;
}

  

function displayTodoList(){
  let todoListHTML = '';
  sortBy();
  todoLists.forEach((todoList, index) => {
    todoListHTML += `
    <div class="listbox ${todoList.isCompleted === true ? 'completed': ''} ${todoList.isEditing === true ? 'isEditing' : ''} ${filterTodos(todoList.isCompleted)}" id="list-box-${index}">
      <div class="listbox-dis">
        <input type="checkbox"  class="confir-comple" data-todo-id="${index}"
          ${todoList.isCompleted === true ? 'checked' : ''}>
        <div class="todo-action">${todoList.actionTake}</div>
        <div class="todo-time">${todoList.actionTakeTime}</div>
        <button class="edit-btn edit-todo" ${todoList.isCompleted === true ? 'disabled': ''} data-todo-id="${index}">Edit</button>
        <button class="delete-btn delete-todo" data-todo-id="${index}">Delete</button>
      </div>
      <div class="edit-box">
        <input type="text" value="${todoList.actionTake}" class="update-action" id="update-input-${index}">
        <input type="time" value="${todoList.actionTakeTime}" class="update-time" id="update-time-${index}"> 
        <button class="save-btn save-todo" data-todo-id="${index}">Save</button>
        <button class="delete-btn cancel-update" data-todo-id="${index}">Cancel</button>
      </div>

    </div>
    
    `
  });

  
  localStorage.setItem('todoLists', JSON.stringify(todoLists));

  renderTodo(todoListHTML);

  attachRender();
}



function attachRender(){
  document.querySelectorAll('.confir-comple').forEach((checkBox) => {
    checkBox.addEventListener('click', ()=> {
      const {todoId} = checkBox.dataset;

      todoLists[todoId].isCompleted = todoLists[todoId].isCompleted === true ? false : true;

      
      displayTodoList();
    });
  });

  document.querySelectorAll('.delete-todo').forEach((deleteBtn) =>{
    deleteBtn.addEventListener('click', ()=> {
      const {todoId} = deleteBtn.dataset;
      todoLists.splice(todoId, 1);
      displayTodoList();
    });
  });

  document.querySelectorAll('.edit-todo').forEach((editTodo) => {
    editTodo.addEventListener('click', ()=> {
      const {todoId} = editTodo.dataset;
      todoLists[todoId].isEditing = true;
     displayTodoList();
    });
  });

  
  document.querySelectorAll('.save-todo').forEach((saveBtn) => {
    saveBtn.addEventListener('click', ()=> {
      const {todoId} = saveBtn.dataset;
      const updateInput = document.getElementById(`update-input-${todoId}`);
      const updateTime = document.getElementById(`update-time-${todoId}`);

      if(updateInput.value.trim() !== ''  && updateTime.value !== ''){
        todoLists[todoId].isEditing = false;
        todoLists[todoId].actionTake = updateInput.value;
        todoLists[todoId].actionTakeTime = updateTime.value;
        displayTodoList();
      } else{
        renderErrorBox();
      }
    
    });
  });
  
    document.querySelectorAll('.cancel-update').forEach((cancelBtn) => {
      cancelBtn.addEventListener('click', () => {
        const {todoId} = cancelBtn.dataset;
        todoLists[todoId].isEditing = false;
        displayTodoList();
      });
    });
  
}


function renderTodo(todoListHTML){
  document.getElementById('renderList').innerHTML = todoListHTML;
}

function renderErrorBox(){
  errorBox.classList.remove('hidden');
  setTimeout(()=>{
    errorBox.classList.add('hidden');
  }, 3000);
}

document.querySelector('.sort-by').addEventListener('click', ()=> {
  document.querySelector('.sort-by').classList.toggle('box');
  document.querySelector('.sortBox').classList.toggle('hidden');
});

const menuPopup = document.querySelector('.menu-popup');

document.getElementById('menuBtn').addEventListener('click', () => {
  menuPopup.classList.toggle('hidden');
  
});

document.getElementById('clearAll').addEventListener('click', ()=> {
  todoLists = [];
  displayTodoList();
});

document.querySelectorAll('.sort-menu').forEach((sortBtn)=> {
  sortBtn.addEventListener('click', ()=> {
    sortTodo = sortBtn.innerText;
    menuPopup.classList.add('hidden');
    displayTodoList();
  });
});

function sortBy(){
  if(sortTodo === 'A-Z'){
    todoLists.sort((a, b)=> {
      if(a.actionTake > b.actionTake){
        return 1;
      }
      if(a.actionTake < b.actionTake){
        return -1;
      }
      return 0;
    });
  } else if(sortTodo === 'Time'){
     todoLists.sort((a, b)=> {
      if(a.actionTakeTime > b.actionTakeTime){
        return 1;
      }
      if(a.actionTakeTime < b.actionTakeTime){
        return -1;
      }
      return 0;
    });
  } else if(sortTodo === 'Added Date'){
     todoLists.sort((a, b)=> {
      if(a.addOrder > b.addOrder){
        return 1;
      }
      if(a.addOrder < b.addOrder){
        return -1;
      }
      return 0;
    });
  }
}
