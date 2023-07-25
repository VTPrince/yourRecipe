import React from "react";
import { useLoaderData, Link } from "@remix-run/react";

export function loader({ request }) {
  const { search } = new URL(request.url);
  const params = new URLSearchParams(search);
  const recipeName = params.get("name");
  const recipeImag = params.get("imag")

  return { recipeName,recipeImag };
}

export default function RecipeDetail() {
  const { recipeName } = useLoaderData();
  const {recipeImag} = useLoaderData();

  return (
    <div>
      Hello: {recipeName}
      <Link to={recipeImag}>Let's see how this is prepared</Link>
      {/* <h1>{recipeImag}</h1> */}
    </div>
  );
}
