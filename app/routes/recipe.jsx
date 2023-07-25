import { Link } from '@remix-run/react';
import React,{useState,useEffect} from 'react'

export default function Recipe(){
    const[query,setQuery]=useState('')
     const [loading, setLoading] = useState(false);
     console.log(loading)
    // const[name,setName]=useState([])
    // const[imag,setImag]=useState([])
    const[detail,setDetail]=useState([])
    const handleSubmit=async(e)=>{
        e.preventDefault();
        console.log(query);
        try{
            const response= await fetch(`https://api.edamam.com/api/recipes/v2?type=public&q=${query}&app_id=d871d5da&app_key=8c9d46e4e1e0f4e50c4ab9105fb6beee`,{
                method:'GET'
            });
            if(!response.ok){
                console.log("error")}

            const data=await response.json()
            // console.log(data)
            // const recipes=[]
            // const imgrecipes=[]
            // const det=[]
            const det = await Promise.all(data.hits.map(async (hit) => {
                return [hit.recipe.label, hit.recipe.image, hit.recipe.url, hit.recipe.mealType[0][0]];
              }));

            data.hits.forEach((hit) => {
                det.push([hit.recipe.label,hit.recipe.image,hit.recipe.url,hit.recipe.mealType[0][0]]);
              });
            setDetail(det);
            setLoading(false);
            setLoading(true); // Set loading to true before the setTimeout
      setTimeout(() => {
        setLoading(false); // Set loading to false after a small delay
      }, 2000); 
            // setLoading(false);
            // console.log(loading);
            // console.log(detail)


            // data.hits.forEach((hit) => {
            //     recipes.push(hit.recipe.label);
            //   });
            //   setName(recipes);
            // console.log(recipes);

            // data.hits.forEach((hit) => {
            //     imgrecipes.push(hit.recipe.image);
            //   });
            //   setImag(imgrecipes);
            //   console.log(imgrecipes);
        }
        catch(error){
            console.log(error);
            setLoading(false);
        }
    }
    
    // useEffect(() => {
    //     console.log(name); // This will log the updated name state whenever it changes.
    //   }, [name]);

    // const handleClick=async(e)=>{
    //     return(            <div><p>hello</p>
    //         {(loading)?<div>Loading</div>:detail.map((recipe, index) => (
    //             <li key={index}><Link to={recipe[2]}>{index + 1}. {recipe[0]}</Link><img src={recipe[1]} alt="" /></li>
    //         ))}
    //         </div>)
    // }

    return(
        <div>
            <nav>
                <Link to='/'>Home</Link>
                {/* <Link to='/'>About</Link> */}
            </nav>
            Hello there
            <form onSubmit={handleSubmit}>
                <label htmlFor='recipequery'>Enter the keyword of the recipe you want</label>
                <input
                type="text"
                placeholder="Keyword"
                id="recipequery"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                />
                <button>Submit</button>
            </form>
            <div>
        {loading ? <div>Loading...</div> : (
          <div>
            {detail.length > 0 ? (
              <ul>
                {detail.map((recipe, index) => (
                  <li key={index}>
                    {/* <Link to={recipe[2]}>{index + 1}. {recipe[0]}</Link> */}
                    <Link to={`/recipedetail?name=${encodeURIComponent(recipe[0])}&imag=${recipe[2]}`}>{recipe[0]}</Link>
                    <img src={recipe[1]} alt="" />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        )}
      </div>
            {/* <div>
            {(loading)?<div>Loading</div>:detail.map((recipe, index) => (
                <li key={index}><Link to={recipe[2]}>{index + 1}. {recipe[0]}</Link><img src={recipe[1]} alt="" /></li>
            ))}
            </div> */}
        </div>
    )
}