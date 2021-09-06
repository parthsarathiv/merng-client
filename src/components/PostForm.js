import React from 'react'
import { Form, Button } from 'semantic-ui-react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/client'

import { useForm } from '../utils/hooks'
import { FETCH_POSTS_QUERY } from '../utils/graphql'

function PostForm(){

    const {values, onChange, onSubmit } = useForm(createPostCallback, {
        body: ''
    })

    const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
        variables: values,
        update(proxy, result){

            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            })
            
            proxy.writeQuery({
                query: FETCH_POSTS_QUERY,
                data: {
                  getPosts: [result.data.createPost, ...data.getPosts],
                },
              })
              
            values.body = ''
        },
        onError(err) {
                 return err;
               },
    })

    function createPostCallback(){
        createPost()
    }

    return (
        <>
        <Form onSubmit = { onSubmit }>
            <h2>Create a post:</h2>
            <Form.Field>
                <Form.Input 
                    placeholder = "Kooh!"
                    name = "body"
                    onChange = {onChange}
                    values = {values.body}
                    error = {error}
                />
                <Button type = "submit" color = "teal">
                    Submit
                </Button>
            </Form.Field>
        </Form>
        {error && (<div className = "ui error message" style = {{marginBottom: "10px"}}>
            <ul className = "list">
                <li>{error.graphQLErrors[0].message}</li>
            </ul>
        </div>)}
        </>
    )
}

const CREATE_POST_MUTATION = gql`
    mutation createPost($body: String!){
        createPost(body: $body){
            id body createdAt username
            likes {
                id username createdAt
            }
            likeCount
            comments {
                id username createdAt body
            }
            commentCount
        }
    }
`

export default PostForm