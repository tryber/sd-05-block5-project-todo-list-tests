const TODO_PAGE_TITLE = 'Minha Lista de Tarefas';
const TODO_PAGE_DESCRIPTION_SELECTOR = '#funcionamento';
const TODO_PAGE_DESCRIPTION = 'Clique duas vezes em um item para marcá-lo como completo';
const TODO_ADD_INPUT_SELECTOR = 'input#texto-tarefa';
const TODO_LIST_SELECTOR = 'ol#lista-tarefas';
const TODO_LIST_LINE_SELECTOR = 'ol#lista-tarefas>li';
const TODO_ADD_BUTTON_SELECTOR = 'button#criar-tarefa';
const TODO_REMOVE_ALL_BUTTON_SELECTOR = 'button#apaga-tudo';
const TODO_REMOVE_DONE_BUTTON_SELECTOR = 'button#remover-finalizados';
const TODO_SAVE_LIST_BUTTON_SELECTOR = 'button#salvar-tarefas';
const TODO_MOVE_UP_BUTTON_SELECTOR = 'button#mover-cima';
const TODO_MOVE_DOWN_BUTTON_SELECTOR = 'button#mover-baixo';
const TODO_REMOVE_SELECTED_BUTTON_SELECTOR = 'button#remover-selecionado';

const addTodo = (todo) => {
  cy.get(TODO_ADD_INPUT_SELECTOR).type(todo.content);
  cy.get(TODO_ADD_BUTTON_SELECTOR).click();
};

const addTodos = (todos = []) => (todos.map(addTodo));

const checkTodoList = (todos = []) => {

  if (todos.length === 0) {
    cy.get(TODO_LIST_LINE_SELECTOR).should('not.exist');
  } else {
    cy.get(TODO_LIST_LINE_SELECTOR).each(($li, index) => {
      const todo = todos[index];
      expect($li).to.have.text(todo.content);
      if (todo.done) expect($li).to.have.class('completed');
    });
  }
};

describe('Todo list project', () => {
  beforeEach(() => {
    cy.visit('./index.html');
  });

  it('Sua lista deve possuir o título “Minha Lista de Tarefas” em uma tag <header>', () => {
    cy.get('header').contains(TODO_PAGE_TITLE);
  });

  it('Abaixo do título deve haver um pequeno e discreto parágrafo com id="funcionamento" e com o texto “Clique duas vezes em um item para marcá-lo como completo”', () => {
    cy.get(TODO_PAGE_DESCRIPTION_SELECTOR).contains(TODO_PAGE_DESCRIPTION);
  });

  it('Deve haver um input com o id="texto-tarefa" onde o usuário poderá digitar o nome do item que deseja adicionar à lista', () => {
    cy.get(TODO_ADD_INPUT_SELECTOR).should('exist');
  });

  it('Deve haver uma lista ordenada de tarefas com o id="lista-tarefas"', () => {
    cy.get(TODO_LIST_SELECTOR).should('exist');
  });

  it('Deve haver um botão com id="criar-tarefa" e ao clicar nesse botão, um novo item deverá ser criado ao final da lista e o texto do input deve ser limpo', () => {
    cy.get(TODO_ADD_BUTTON_SELECTOR).should('exist');

    const todo1 = {
      content: 'minha primeira tarefa'
    };

    const todo2 = {
      content: 'minha segunda tarefa'
    };

    addTodo(todo1);
    checkTodoList([todo1]);
    cy.get(TODO_ADD_INPUT_SELECTOR).should('have.value', '');

    addTodo(todo2);
    checkTodoList([todo1, todo2]);
    cy.get(TODO_ADD_INPUT_SELECTOR).should('have.value', '');
  });

  it('Os itens da lista de tarefas devem ser ordenados por ordem de criação', () => {
    const todo1 = {
      content: 'minha tarefa'
    };

    const todo2 = {
      content: 'minha outra tarefa'
    };

    const todo3 = {
      content: 'minha terceira tarefa'
    };

    addTodo(todo1);
    checkTodoList([todo1]);

    addTodo(todo2);
    checkTodoList([todo1, todo2]);

    addTodo(todo3);
    checkTodoList([todo1, todo2, todo3]);
  });

  it('Ao passar o mouse sobre qualquer botão o ícone do mouse deve mudar para uma mãozinha', () => {
    const todos = [{
      content: 'tarefinha facin de fazer'
    }, {
      content: 'tarefa mais hard'
    }];

    addTodos(todos);
    checkTodoList(todos);

    cy.get(TODO_LIST_LINE_SELECTOR).first().trigger('hover').then(($li) => {
      expect($li).to.have.css('cursor', 'pointer');
    });
  });

  it('Ao clicar em um item da lista, altere a cor de fundo do item para cinza rgb(128,128,128)', () => {
    const todos = [{
      content: 'uma tarefa qualquer'
    }, {
      content: 'uma outra tarefa atoa'
    }];

    addTodos(todos);
    checkTodoList(todos);

    cy.get(TODO_LIST_LINE_SELECTOR).first().click().then(($li) => {
      expect($li).to.have.css('background-color', 'rgb(128, 128, 128)');
    });
  });

  it('Ao clicar duas vezes em um item, ele deverá ser riscado e clicando duas vezes novamente, a ação deve ser desfeita', () => {
    const todos = [{
      content: 'já terminei essa tarefa'
    }, {
      content: 'está eu ainda não terminei'
    }];

    addTodos(todos);
    checkTodoList(todos);

    cy.get(TODO_LIST_LINE_SELECTOR).first().dblclick();
    cy.get(TODO_LIST_LINE_SELECTOR).first().should('have.class', 'completed');
    cy.get('.completed').should('have.css', 'text-decoration', 'line-through solid rgb(0, 0, 0)')

    cy.get(TODO_LIST_LINE_SELECTOR).first().dblclick();
    cy.get(TODO_LIST_LINE_SELECTOR).first().should('not.have.class', 'completed');
  });

  it('Deve haver um botão com `id="apaga-tudo"`que quando clicado deve apagar todos os items da lista', () => {
    const todos = [{
      content: 'blablabla'
    }, {
      content: 'hahahahaha'
    }];

    addTodos(todos);
    checkTodoList(todos);

    cy.get(TODO_REMOVE_ALL_BUTTON_SELECTOR).click();
    checkTodoList();
  });

  it('Deve haver um botão`id="remover-finalizados"`que quando clicado remove **somente** os elementos finalizados da sua lista', () => {
    const todo1 = {
      content: 'vou terminar essa tarefa logo'
    };

    const todo2 = {
      content: 'essa tarefa eu vou demorar para finalizar'
    };

    const todo3 = {
      content: 'essa tarefa tbm vai demorar...'
    };

    const todos = [todo1, todo2, todo3];

    addTodos(todos);
    checkTodoList(todos);

    cy.get(`${TODO_LIST_LINE_SELECTOR}:nth-child(2)`).dblclick();
    cy.get(`${TODO_LIST_LINE_SELECTOR}:nth-child(3)`).dblclick();
    cy.get(TODO_REMOVE_DONE_BUTTON_SELECTOR).click();

    checkTodoList([todo1]);
  });

  it('Adicione um botão com `id=salvar-tarefas` que salve o conteúdo da lista', () => {
    const todo1 = {
      content: 'primeira tarefa a ser salva'
    };

    const todo2 = {
      content: 'esta tarefa será salva também'
    };

    const todo3 = {
      content: 'mais uma para salvar'
    };

    const todos = [todo1, todo2, todo3];
    const newTodosState = [
      {
        ...todo1,
        done: true
      },
      todo2,
      todo3
    ];

    addTodos(todos);
    checkTodoList(todos);

    cy.get(TODO_LIST_LINE_SELECTOR).first().dblclick();
    cy.get(TODO_SAVE_LIST_BUTTON_SELECTOR).click();

    cy.reload();
    checkTodoList(newTodosState);
  });

  it('Adicione dois botões, um com `id="mover-cima"` e outro com `id="mover-baixo"`, que permitam mover o item selecionado para cima ou para baixo na lista de tarefas', () => {
    const todos = [{
      content: 'primeira tarefa'
    }, {
      content: 'segunda tarefa'
    }, {
      content: 'terceira tarefa'
    }, {
      content: 'quarta tarefa'
    }];

    const newTodosState = [todos[3], todos[2], todos[1], todos[0]];

    addTodos(todos);
    checkTodoList(todos);

    cy.get(`${TODO_LIST_LINE_SELECTOR}:nth-child(2)`).click();
    cy.get(TODO_MOVE_UP_BUTTON_SELECTOR).click();

    cy.get(`${TODO_LIST_LINE_SELECTOR}:nth-child(4)`).click();
    cy.get(TODO_MOVE_UP_BUTTON_SELECTOR).click();

    cy.get(`${TODO_LIST_LINE_SELECTOR}:nth-child(3)`).click();
    cy.get(TODO_MOVE_UP_BUTTON_SELECTOR).click();

    cy.get(`${TODO_LIST_LINE_SELECTOR}:nth-child(1)`).click();
    cy.get(TODO_MOVE_DOWN_BUTTON_SELECTOR).click();

    cy.get(`${TODO_LIST_LINE_SELECTOR}:nth-child(4)`).click();
    cy.get(TODO_MOVE_UP_BUTTON_SELECTOR).click();

    cy.get(`${TODO_LIST_LINE_SELECTOR}:nth-child(3)`).click();
    cy.get(TODO_MOVE_UP_BUTTON_SELECTOR).click();

    checkTodoList(newTodosState);
  });

  it('Adicione um botão com `id="remover-selecionado"` que, quando clicado, remove o item selecionado', () => {
    const todo1 = {
      content: 'não posso remover essa tarefa'
    };

    const todo2 = {
      content: 'essa tarefa aqui eu posso remover'
    };

    const todos = [todo1, todo2];

    addTodos(todos);
    checkTodoList(todos);

    cy.get(TODO_LIST_LINE_SELECTOR).last().click();
    cy.get(TODO_REMOVE_SELECTED_BUTTON_SELECTOR).click();
    checkTodoList([todo1]);
  });
});
