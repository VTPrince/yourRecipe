import { Link } from "@remix-run/react";
export const meta = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div>
      Lets start finding recipes according to your choice
      <Link to='/recipe'>Lets go!</Link>
    </div>
  );
}
