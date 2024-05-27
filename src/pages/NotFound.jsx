import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
    return (
        <div class="not-found-container">
            <h1 className='not-found-h'>404</h1>
            <p className='not-found-p'>Oops! The page you're looking for doesn't exist.</p>
            <Link to="/" class="home-button">Go to Homepage</Link>
        </div>
    )
}

export default NotFound