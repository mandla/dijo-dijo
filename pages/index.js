import Splash from "../components/splash";
import Cookie from "next-cookies";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home({ auth }) {
  const router = useRouter();
  useEffect(() => {
    auth ? router.push("/app") : router.push("/signup");
  }, []);
  return (
    <div>
      <Splash />
    </div>
  );
}
export async function getServerSideProps(context) {
  const { foodsUser } = Cookie(context);
  return {
    props: {
      auth: Boolean(foodsUser),
    },
  };
}
