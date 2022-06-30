import { createContext, useContext, useEffect, useReducer } from "react";

const cartContext = createContext();

function reducer(state, action) {
  switch (action.type) {
    case "add": {
      return { ...state, items: [...state.items, action.item] };
    }

    case "delete": {
      return {
        ...state,

        items: state.items.filter(
          (i) => i.price_data.product_data.name !== action.name
        ),
      };
    }
    case "load": {
      return { ...state, items: [...action.items] };
    }
    default:
      break;
  }
}
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });

  useEffect(() => {
    if (localStorage.getItem("cart")) {
      dispatch({
        type: "load",
        items: JSON.parse(localStorage.getItem("cart")),
      });
    }
  }, []);
  useEffect(() => {
    Boolean(state.items.length) &&
      localStorage.setItem("cart", JSON.stringify(state.items));
  }, [state.items]);

  return (
    <cartContext.Provider value={{ state, dispatch }}>
      {children}
    </cartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(cartContext);
  return context;
}
