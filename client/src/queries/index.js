import { gql } from 'apollo-boost'

export const GET_CURRENCIES = gql`
    query {
        currencies{
            id,
            createdAt
            currencies{
                imageUrl,
                name,
                price,
                change
            }
        }
    }
`