import React from 'react'
import axios from 'axios'
function Home(){

    const handleAuth=()=>{
        axios.get('http://localhost:9091/checkauth', {
            headers: {
                'access-token': localStorage.getItem('token')
            }
        })
        .then(res => console.log(res))
        .catch(err => console.log(err));
    }

    return (  
        <div>
            <h1>Welcome </h1>
            <button onClick={handleAuth} className='btn btn-primary'>Check Authentication</button>
        </div>  
    )}
export default Home