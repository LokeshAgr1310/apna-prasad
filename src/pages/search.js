import React from 'react'

function Search({ query }) {
    return (
        <div>Searching for {query}</div>
    )
}

export default Search

export async function getServerSideProps(context) {

    const userQuery = context.query.query
    console.log("Query: ", userQuery)
    return {
        props: {
            "query": userQuery
        }
    }
}