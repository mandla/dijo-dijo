import useForm from "../hooks/useForm";
import Link from "next/link";
import axios from "axios";
import { useAuth } from "./../contexts/authContext";
import { useRouter } from "next/router";

export default function login() {
  const router = useRouter();
  const [state, updateState] = useForm({ email: "", password: "" });
  const context = useAuth();
  function handleSubmit(e) {
    e.preventDefault();
    axios
      .post("/api/login", { ...state })
      .then((res) => {
        const {
          data: { user },
        } = res;
        console.log(user);
        context.dispatch({ type: "login", user });
        router.push("/app");
      })
      .catch(console.log);
  }
  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit}>
        <header>
          <h2>Local Foods</h2>
        </header>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            value={state.email}
            name="email"
            required
            onChange={updateState}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            value={state.password}
            name="password"
            required
            onChange={updateState}
          />
        </div>
        <div>
          <button type="submit">Log in</button>
        </div>
      </form>
      <div className="form-message">
        <p>
          Don't have an account?{" "}
          <Link href="/signup">
            <a>Sign up</a>
          </Link>
        </p>
      </div>
    </div>
  );
}
