"use strict";

function subject() {
  document.querySelector("#subject").innerHTML = `
    <header>
      <h1>WEB</h1>
      Hello, WEB!
    </header>
  `;
}

function TOC() {
  const state = store.getState();
  let i = 0;
  let liTags = "";
  while (i < state.contents.length) {
    liTags =
      liTags +
      `
        <li>
          <a onclick="
            event.preventDefault();
            const action = {type: 'SELECT', id: ${state.contents[i].id}};
            store.dispatch(action);
          " href="${state.contents[i].id}">
            ${state.contents[i].title}
          </a>
        </li>
      `;
    i = i + 1;
  }
  document.querySelector("#toc").innerHTML = `
    <nav>
      <ol>${liTags}</ol>
    </nav>
  `;
}

function control() {
  document.querySelector("#control").innerHTML = `
    <ul>
      <li><a onclick="
        event.preventDefault();
        store.dispatch({
          type: 'CHANGE_MODE',
          mode: 'create'
        });
      " href="/create">create</a></li>
      <li><input onclick="
        store.dispatch({
          type: 'DELETE',
        });
      " type="button" value="delete"></input></li>
    </ul>
  `;
}

function article() {
  const state = store.getState();
  if (state.mode === "create") {
    document.querySelector("#content").innerHTML = `
      <article>
        <form onsubmit="
          event.preventDefault();
          const _title = this.title.value; 
          const _desc = this.desc.value;
          store.dispatch({
            type: 'CREATE',
            title: _title,
            desc: _desc
          }); 
        ">
          <p>
            <input type="text" name="title" placeholder="title">
          </p>
          <p>
            <textarea name="desc" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
      </article>
    `;
  } else if (state.mode === "read") {
    let i = 0;
    let aTitle, aDesc;
    while (i < state.contents.length) {
      if (state.contents[i].id === state.selected_id) {
        aTitle = state.contents[i].title;
        aDesc = state.contents[i].desc;
        break;
      }
      i = i + 1;
    }
    document.querySelector("#content").innerHTML = `
      <article>
        <h2>${aTitle}</h2>
        ${aDesc}
      </article>
    `;
  } else if (state.mode === "welcome") {
    document.querySelector("#content").innerHTML = `
      <article>
        <h2>Welcome</h2>
        Hello, Redux!!!
      </article>
    `;
  }
}

function reducer(state, action) {
  if (state === undefined) {
    return {
      max_id: 2,
      mode: "welcome",
      selected_id: 2,
      contents: [
        { id: 1, title: "HTML", desc: "HTML is .." },
        { id: 2, title: "CSS", desc: "CSS is .." },
      ],
    };
  }

  let newState = {};
  if (action.type === "SELECT") {
    newState = Object.assign({}, state, {
      selected_id: action.id,
      mode: "read",
    });
  } else if (action.type === "CREATE") {
    const newMaxId = state.max_id + 1;
    const newContents = state.contents.concat(); // 배열을 복제할 때는 Object.assign이 아니라, concat()을 사용할 것!
    newContents.push({ id: newMaxId, title: action.title, desc: action.desc });
    newState = Object.assign({}, state, {
      max_id: newMaxId,
      contents: newContents,
      mode: "read",
      // selected_id: newMaxId,
    });
  } else if (action.type === "DELETE") {
    let newContents = [];
    let i = 0;
    while (i < state.contents.length) {
      if (state.selected_id !== state.contents[i].id) {
        newContents.push(state.contents[i]);
      } // 반복문을 돌면서 selected_id에 해당하지 않는 contents들만 newContents에 따로 모아서 배열을 만드려는 것
      // 이렇게 하면 selected_id에 해당하는 content를 제외한 새로운 배열(newContents)이 만들어지겠지!
      i = i + 1;
    }
    newState = Object.assign({}, state, {
      contents: newContents,
      mode: "welcome",
    });
  } else if (action.type === "CHANGE_MODE") {
    newState = Object.assign({}, state, { mode: action.mode });
  }
  console.log(action, state, newState);
  return newState;
}

const store = Redux.createStore(reducer);
store.subscribe(article);
store.subscribe(TOC); // UI들을 그려주는 부품 함수(render)를 subscribe 하려면 한번에 등록이 안되고 해당 메서드를 여러 번 반복해서 호출해야 하나 봄.
subject();
TOC();
control();
article();

/**
 * 이 예제에서는
 * html에 작성된 element 덩어리들을 부품화, 모듈화시켜서
 * js의 함수가 해당하는 id값을 가진 element에 DOM UI를 그려주는 방식을 사용함.
 *
 * -> 한 마디로 React를 Vanilla JS로 구현했다고 보면 되겠지!
 *
 * 이렇게 부품화된 요소들을 Redux를 사용해서 CRUD를 만들어볼거임.
 */

/**
 * <form onsubmit="this.~~">
 *
 * form 태그의 onsubmit 프로퍼티에 작성해주는 코드 중에서 this는 무엇을 가리킬까?
 * -> 'form태그 자체'를 가리킨다고 보면 됨.
 *
 * 그러면 위에서 사용한 것처럼 this.title.value 라고 하면 뭘까?
 * this 즉, form 태그 자신이 갖고 있는 자식노드들 중에서
 * name이 title인 태그, 즉 첫 번째 input 태그에 해당할 것이고,
 * .value는 그것의 value를 의미하겠지!
 *
 * 그니까 결국 사용자가 해당 input 태그에 작성한 값이
 * this.title.value안에 들어가게 된다는 것!
 */
