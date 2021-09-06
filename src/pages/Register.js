import React, {useState, useContext} from 'react'
import { Form, Button } from 'semantic-ui-react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/client'

import { AuthContext } from '../context/auth'
import { useForm } from '../utils/hooks'


function Register(props) {
    const context = useContext(AuthContext)
    const [errors, setErrors] = useState({})

    const { onChange, onSubmit, values} = useForm(registerUser, {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    })

    const [addUser, { loading }] = useMutation(REGISTER_USER, {
        update(_, { data: { login: userData }}) {
            context.login(userData)
            props.history.push('/')
        },
        onError(err){
            setErrors(err.graphQLErrors[0].extensions.exception.errors)
        },
        variables: values
    })

    function registerUser () {
        addUser()
    }

    return (
        <div className = 'formContainer'>
            <Form onSubmit = {onSubmit} noValidate className = {loading ? 'loading': ''}>
                <h1>Register</h1>
                <Form.Input 
                    label = "Username" 
                    placeholder = "Username.." 
                    name = "username" 
                    value = {values.username}
                    type = "text"
                    error = {errors.username}
                    onChange = {onChange} />
                <Form.Input 
                    label = "Email" 
                    placeholder = "Email.." 
                    name = "email" 
                    value = {values.email}
                    type = "email"
                    error = {errors.email}
                    onChange = {onChange} />

                <Form.Input 
                    label = "Password" 
                    placeholder = "Password.." 
                    name = "password" 
                    value = {values.password}
                    type = "password"
                    error = {errors.password}
                    onChange = {onChange} />

                <Form.Input 
                    label = "Confirm Password" 
                    placeholder = "Confirm Password.." 
                    name = "confirmPassword" 
                    value = {values.confirmPassword}
                    type = "password"
                    error = {errors.confirmPassword}
                    onChange = {onChange} />

                <Button type ="submit" primary>
                    Register
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

const REGISTER_USER = gql`
    mutation register(
        $username: String!
        $email: String!
        $password: String!
        $confirmPassword: String!
    ){
        register(
            registerInput: {
                username: $username
                email: $email
                password: $password
                confirmPassword: $confirmPassword
            }
        ) {
            id email username createdAt token
        }
    }
`

export default Register; 