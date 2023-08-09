import { Link } from '@remix-run/react';
import React,{useState,useEffect} from 'react'
import ReactPaginate from 'react-paginate';
import stylesUrl from "~/styles/recipestyle.css";

export const links = () => [
  { rel: "stylesheet", href: stylesUrl },
];

export default function Recipe(){
    const[query,setQuery]=useState('')
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    // console.log(loading)
    // const[name,setName]=useState([])
    // const[imag,setImag]=useState([])
    const[detail,setDetail]=useState([])
    const handleSubmit=async(e)=>{
        e.preventDefault();
        // console.log(query);
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
            // const det = await Promise.all(data.hits.map(async (hit) => {
            //     return [hit.recipe.label, hit.recipe.image, hit.recipe.url, hit.recipe.mealType[0][0]];
            //   }));

            // data.hits.forEach((hit) => {
            //     // det.push([hit.recipe.label,hit.recipe.image,hit.recipe.url,hit.recipe.mealType[0][0]]);
            //     det.push([hit.recipe.label])
            //     console.log("going in")
            //   });
            const labels = data.hits.map(hit => [hit.recipe.label,hit.recipe.url,hit.recipe.image]);
            setDetail(labels);
            
            // setDetail(det);
            
            // console.log(detail)
            setLoading(false);
            setLoading(true); // Set loading to true before the setTimeout
      setTimeout(() => {
        setLoading(false); // Set loading to false after a small delay
      }, 2000); 


        }
        catch(error){
            console.log(error);
            setLoading(false);
        }
    }
    useEffect(() => {
        console.log('Detail array updated:', detail);
      }, [detail]);
    const totalItems = detail.length;   
    // console.log(detail)
    // console.log(detail.length)
    const maxPage = Math.ceil(totalItems / itemsPerPage);
  
    const handlePageClick = (data) => {
      const selectedPage = data.selected + 1; // react-paginate uses 0-based indexing
      setCurrentPage(selectedPage);
    };


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

                {/* Displaying paginated data */}
      <div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div>
            {detail.length > 0 ? (
              <ul>
                {detail
                  .slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage
                  )
                  .map((recipe, index) => (
                    <li key={index}>
                      <Link to={`/recipedetail?name=${encodeURIComponent( recipe[1])}}`}>{recipe[0]}
                      </Link>
                      <img src={recipe[2]} alt="" />
                    </li>
                  ))}
              </ul>
            ) : null}
          </div>
        )}
      </div>

      {/* Adding pagination component */}
      <div className="pagination-container">
        {maxPage > 1 && (
          <ReactPaginate
            pageCount={maxPage}
            pageRangeDisplayed={5}
            marginPagesDisplayed={2}
            onPageChange={handlePageClick}
            containerClassName={'pagination'}
            activeClassName={'active'}
          />
          )}
      </div>
      
    </div>
  );

}