import React, {useEffect, useState, useContext, ReactNode} from 'react'
import { useNavigate } from 'react-router-dom';
import { MyContext } from "../App"
import jwt_decode from "jwt-decode";
import userTodoList from "../database/users.json"
import { Skeleton  } from 'antd';

interface MyComponentProps {
    children: ReactNode;
  }

interface UserData {
    username: string;
}

const RouteGuard : React.FC<MyComponentProps>= ({children}) => {

    const contextData = useContext<any>(MyContext)
    const { user, setUser } = contextData;
    const [loading, setLoading] = useState(false)
    const [todos, setTodos] = useState<any>([]);;
    const navigate = useNavigate()

    useEffect(() => {
        setLoading(false)
        const token = localStorage.getItem("token")
        if (token) {
          const data: UserData = jwt_decode(token)
          if (data?.username) {
            setTodos(userTodoList.users.find((user) => user.username === data.username)?.todos ?? [])
            contextData.setUser({
              username : data.username,
              todos : userTodoList.users.find((user) => user.username === data.username)?.todos
            })
            setLoading(true)
          } else {
            navigate("/login")
          }
        } else {
          navigate("/login")
        }
    
      }, [])

  return <>
    {
        loading ? children : <Skeleton active />
    }
  </>
}

export default RouteGuard