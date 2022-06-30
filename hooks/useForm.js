import { useState } from "react";

export default function useForm(initState) {
  const [state, setState] = useState(initState);
  const updateState = (e) => {
    setState((s) => ({ ...s, [e.target.name]: e.target.value }));
  };
  return [state, updateState];
}
