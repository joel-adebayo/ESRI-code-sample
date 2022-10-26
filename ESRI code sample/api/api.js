import axios from 'axios'
import Cookies from 'js-cookie'


const instance = axios.create({
    baseURL:'http://localhost:8000/',
})

export default instance