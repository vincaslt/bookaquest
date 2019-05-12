import axios from 'axios'
import config from '../config'
import { CreateUserDTO } from '../interfaces/dto/user'

const api = axios.create({
  baseURL: config.backendUrl
})

// TODO: should be CreateUser and convert to DTO before sending
export const register = (user: CreateUserDTO) => api.post('/users', user).then(res => res.data)
