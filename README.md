<div align="center">
  <img src="./git/redux-logo.svg" width="100" />

  <h1>Projeto para estudo - Redux / Redux Saga</h1>
</div>

---

## O que o Redux resolve ?

O [Redux](https://redux.js.org/) é uma implementação da arquitetura Flux que propõe uma solução ao problema de compartilhamento de estados em aplicações web que consiste em criar um fluxo unidirecional de dados que poderá ser consumido por qualquer parte da aplicação.

## O Redux possui três Princípios

### *Single source of truth*

*"Uma única fonte de verdade"*

Este princípio estabelece que os estados da nossa aplicação devem ser armazenados em um único lugar, a [store](#store). Sendo assim, qualquer acesso aos dados armazenados na aplicação será feito através dele.

### *State is read-only*

*"Estado é apenas leitura"*

No Redux todos os dados são armazenados como somente leitura, ou seja, são imutáveis. A única forma de mudar qualquer coisa no estado é disparando uma [action](#action), que servirá para informar a nossa aplicação que um estado foi modificado gerando um novo estado para substituí-lo.

### *Changes are made with pure functions*

*"Mudanças são feitas com funções puras"*

Os **reducers** serão apenas funções puras (não causam efeitos colaterais, não mudam o estado da aplicação retornando sempre o mesmo valor ao receber os mesmo argumentos).

## Fluxo de uma evolução de estado


<figure>
  <img src="https://miro.medium.com/max/1400/1*EdiFUfbTNmk_IxFDNqokqg.png" alt="Imagem ilustrando o fluxo de do estado global em Redux" width="500" />
  <figcaption align="center">
    Imagem extraída de https://itnext.io/integrating-semantic-ui-modal-with-redux-4df36abb755c
  </figcaption>
</figure>

### Store

Store é o container que armazena e centraliza os dados da aplicação. Como vimos [anteriormente](#state-is-read-only), ele é imutável, não terá alterações nele, apenas evolução.

### Actions

As Actions são as fontes de informações que são enviadas da aplicação para a store. Elas são disparadas pelas [Action Creators](https://read.reduxbook.com/markdown/part1/04-action-creators.html), que são simples funções que, ao serem executadas, ativam os [Reducers](#reducers).

### Reducers

Os Reducers recebem e tratam as informações para que sejam ou não enviadas à store. Cada dado da store deve ter seu próprio reducer.

## Estrutura do nosso projeto

```ts
store
|_ index.ts
|_ modules
|  |_ cart
|  |  |_ actions.ts
|  |  |_ reducer.ts
|  |  |_ sagas.ts
|  |  |_ types.ts
|  |_ rootReducer.ts
|_ |_ rootSaga.ts
```

Todos os nossos arquivos relacionados estarão dentro da pasta *store*. Os arquivos *modules/cart/sagas.ts*  e *modules/rootSaga.ts* são relacionados ao [Redux saga](https://redux-saga.js.org/) que é uma biblioteca para gerenciamento de estados de forma assíncrona para o redux utilizando **middlewares**, não abordaremos a fundo sobre ele aqui ainda.

Farei um breve resumo de cada arquivo abordando apenas o essencial, recomendo que abra cada arquivo dentro do projeto e busque na documentação para poder investigar de formar mais aprofundada.

#### **store/modules/rootReducer.ts

Dentro do nosso *rootReducer* é onde será centralizado todos os nossos reducers, e para isso utilizaremos o [combineReducers](https://redux.js.org/api/combinereducers):

```ts
import {  combineReducers} from 'redux';

import cart from './cart/reducer';

export default combineReducers({
  cart,
  // ... demais reducers
});
```

#### **store/index.ts**

Criamos nossa **store** e exportamos para poder ser consumida por toda a aplicação:

```ts
import rootReducer from './modules/rootReducer';

const store = createStore(
  rootReducer,
);
```

E então provemos nosso estado global para toda a aplicação com o [Provider]() do [react-redux](https://react-redux.js.org/):

#### **/src/App.tsx**

```ts
import { Provider } from 'react-redux';

function App() {
  return (
    <Provider store={store}>
      // ...escopo do nosso ap
    </Provider>
  );
}
```

#### **store/modules/cart/types.ts**

É aconselhável que criêmos uma constante para armazenas todos os tipos das nossas actions como no exemplo abaixo:

```ts
export const ActionTypes = {
  addProductToCart: 'ADD_PRODUCT_TO_CART',
  removeProductToCart: 'REMOVE_PRODUCT_TO_CART',
  // ...
};
```

#### **store/modules/cart/actions.ts**

Aqui é onde ficara nossas Action Creators

```ts
import { ActionTypes } from '../../modules/cart/types';

export function addProductToCartRequest(params) {
  return {
    type: ActionTypes.addProductToCart,
    payload: {
      params, // dados associados a essa action
    },
  };
}
```

#### **store/modules/cart/reducer.ts**

É aqui que a mágica acontece, no reducer nós teremos as [funções puras](#changes-are-made-with-pure-functions) que tratam os dados dependendo do tipo da action recebida, retornando estes dados ou não conforme sua lógica:

```ts
const INITIAL_STATE = {
  items,
  // ... demais dados
};

function cart(state = INITIAL_STATE, action) {
  switch (action.type) {
      case ActionTypes.addProductToCartSuccess:
        const { product } = action.payload;

        return {
          ...state,
          items: [
            ...state.items,
            product,
          ],
        };
        break;
      default:
        return draft;
    }
}

export default cart;
```

#### Conexão dos nossos components com o redux

Para termos acesso aos estados da nossa aplicação precisamos nos conectar a nossa store:

```ts
import { useSelector } from 'react-redux';

const Cart = () => {
  const cart = useSelector(state => state.cart.items);

  return (
    <ul>
      {cart.map(item => (
        <li key={item.id}>
          <span>{item.name}</span>
          <span>{item.price}</span>
        </li>
      ))}
    </ul>
  );
};

export default Cart;
```

#### Acionando as actions

A única maneira de alterarmos os dados dentro do nosso aplicativo será acionando nossas [actions](#actions), vamos supor que temos um botão de "Adicionar ao carrinho", utiliaremos o [useDispatch](https://redux.js.org/tutorials/fundamentals/part-5-ui-react#dispatching-actions-with-usedispatch) para criarmos um dispatcher e o [useSelector](https://redux.js.org/tutorials/fundamentals/part-5-ui-react#reading-state-from-the-store-with-useselector) para ter acesso ao nosso estado:

```ts
import { useDispatch, useSelector } from "react-redux";
import { addProductToCartRequest } from "../store/modules/cart/actions";

const AddToCartButton = ({ product }) => {
  const dispatch = useDispatch();
  
  const handleAddProductToCart = () => {
    dispatch(addProductToCartRequest(product));
  };

  return (
    <button
      type="button"
      onClick={handleAddProductToCart}
    >
      Adicionar produto ao carrinho
    </button>
  );
};

export default AddToCartButton;
```

---

<div align="center">
  <img src="https://avatars.githubusercontent.com/u/64603070?s=48&v=4" width="40" />
  <sub>Made with 💜 by <a href="https://github.com/arimariojesus">Arimário jesus</a></sub>
</div>