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
  document.querySelector("#toc").innerHTML = `
    <nav>
      <ol>
        <li><a href="1.html">HTML</a></li>
        <li><a href="2.html">CSS</a></li>
      </ol>
    </nav>
  `;
}

function control() {
  document.querySelector("#control").innerHTML = `
    <ul>
      <li><a href="">create</a></li>
      <li><input type="button" value="delete"></input></li>
    </ul>
  `;
}

function article() {
  document.querySelector("#content").innerHTML = `
    <article>
      <h2>HTML</h2>
      HTML is ...
    </article>
  `;
}

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
