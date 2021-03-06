import React, {useState, useContext} from 'react'
import { Form, Button } from 'semantic-ui-react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/client'
import { useForm } from '../utils/hooks'

import { AuthContext } from '../context/auth'

function Login(props) {
    const [errors, setErrors] = useState({})
    const context = useContext(AuthContext)

    const { onChange, onSubmit, values} = useForm(loginUserCallback, {
        username: '',
        password: '',
    })

    const [loginUser, { loading }] = useMutation(LOGIN_USER, {
        update(_, { data: { login: userData}}) {
            context.login(userData)
            props.history.push('/')
        },
        onError(err){
            setErrors(err.graphQLErrors[0].extensions.exception.errors)
        },
        variables: values
    })

    function loginUserCallback () {
        loginUser()
    }

    return (
        <div className = 'formContainer'>
            <Form onSubmit = {onSubmit} noValidate className = {loading ? 'loading': ''}>
                <h1>Login</h1>
                <Form.Input 
                    label = "Username" 
                    placeholder = "Username.." 
                    name = "username" 
                    value = {values.username}
                    type = "text"
                    error = {errors.username}
                    onChange = {onChange} />

                <Form.Input 
                    label = "Password" 
                    placeholder = "Password.." 
                    name = "password" 
                    value = {values.password}
                    type = "password"
                    error = {errors.password}
                    onChange = {onChange} />

                <Button type ="submit" primary>
                    Login
                </Button>
            </Form>
            {Object.keys(errors).length > 0 && (
                <div className = "ui error message">
                    <ul className = "list">
                        {Object.values(errors).map(value => (
                            <li key = {value}>{value}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

const LOGIN_USER = gql`
    mutation login(
        $username: String!
        $password: String!
    ){
        login(
            username: $username password: $password
        ) {
            id email username createdAt token
        }
    }
`

export default Login; 