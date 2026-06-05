import axios from 'axios'

const API=axios.create({
      baseURL:"http://localhost:6700/api"
})

API.interceptors.request.use((req)=>{
      const token=localStorage.getItem("token");
      if(token){
        req.headers.authorization=`Bearer ${token}` 
      }
      return req;
})

export default API;