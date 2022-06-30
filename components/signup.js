import useForm from "../hooks/useForm";
import Link from "next/link";
import axios from "axios";
import { useAuth } from "./../contexts/authContext";
import { useRouter } from "next/router";

export default function Signup() {
  const router = useRouter();
  const [state, updateState] = useForm({ email: "", password: "" });
  const context = useAuth();
  function handleSubmit(e) {
    e.preventDefault();
    function success(position) {
      const latitude = parseFloat(position.coords.latitude);
      const longitude = parseFloat(position.coords.longitude);

      axios
        .post("/api/create", { ...state, latitude, longitude })
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
    function error() {
      axios
        .post("/api/create", {
          ...state,
          latitude: parseFloat(40.73061),
          longitude: parseFloat(-73.935242),
        })
        .then((res) => {
          const {
            data: { user },
          } = res;

          context.dispatch({ type: "login", user });
          router.push("/app");
        })
        .catch(console.log);
    }
    navigator.geolocation.getCurrentPosition(success, error);
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
          <button>Sign up</button>
        </div>
      </form>
      <div className="form-message">
        <p>
          Already have an account?{" "}
          <Link href="/login">
            <a>Log in</a>
          </Link>
        </p>
      </div>
    </div>
  );
}
