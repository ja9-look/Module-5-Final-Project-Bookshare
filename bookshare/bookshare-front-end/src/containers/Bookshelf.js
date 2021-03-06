import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import API from '../adapters/API';

class Bookshelf extends Component {

    state = {
        allBooks: []
    }

    componentDidMount = () => {
        if (this.props.currentUser) {
            API.getBookshelf(this.props.currentUser.user.bookshelf)
            .then(async data => {
                const bookPromises = data.bookshelf.book_bookshelves.map(book =>
                    book.isbn
                        ? API.getBooksByIsbn(book.isbn)
                            .then(data => {
                                // console.log(!data.error)
                                if (!data.error) {
                                return {
                                    ...book,
                                    ...data.items[0].volumeInfo
                                }
                                }
                            })
                        : book
                )
                const allBooks = (await Promise.all(bookPromises)).filter(book => book)
                // console.log(allBooks)
                this.setState({ allBooks })
            })
        }
    }

    handleReadClick = (event) => {
        event.preventDefault()
        const id = this.props.currentUser.user.bookshelf
        const isbn = event.target.parentElement.id
        API.updateReadStatusBook(id, isbn)
    }

    handleBoughtClick = (event) => {
        event.preventDefault()
        const id = this.props.currentUser.user.bookshelf
        const isbn = event.target.parentElement.id
        API.updateBoughtStatusBook(id, isbn)
    }
    
    handleAddToFavourites = (event) => {
        event.preventDefault()
        const id = this.props.currentUser.user.bookshelf
        const isbn = event.target.parentElement.id        
        // console.log(id, isbn)
        API.addBookToFavourites(id, isbn)
        this.props.history.push(`/bookshelves/${this.props.currentUser.user.bookshelf}`)
    }

    handleRemoveClick = (event) => {
        event.preventDefault()
        const id = this.props.currentUser.user.bookshelf
        const isbn = event.target.parentElement.id
        // console.log(id, isbn)
        API.deleteBookshelf(id, isbn)
        .then(this.props.history.push(`/bookshelves/${id}`))
    }

    handleFilterToggle = (event) => {
        event.preventDefault()
        const dropdownContent = document.querySelector('.dropdown-content')
        dropdownContent.classList.toggle('hidden')
    }

    handleReadFilter = (event) => {
        event.preventDefault()
        // console.log(this)
        this.getBooksBy(`read`)
    }

    handleBoughtFilter = (event) => {
        event.preventDefault()
        this.getBooksBy(`bought`)
    }

    handleFavouritesFilter = (event) => {
        event.preventDefault()
        this.getBooksBy(`favourite`)
    }

    getBooksBy = (filter) => {
        API.getBookshelf(this.props.currentUser.user.bookshelf)
            .then(async data => {
                const bookPromises = data.bookshelf.book_bookshelves.map(book => {
                    // console.log(book[filter])
                    return book[filter] &&
                        (book.isbn
                            ? API.getBooksByIsbn(book.isbn)
                                .then(data => {
                                    // console.log(!data.error)
                                    if (!data.error){
                                    return({
                                        ...book,
                                        ...data.items[0].volumeInfo
                                    })
                                }
                                })
                            : book)
                })
                const allBooks = (await Promise.all(bookPromises)).filter(book => book)
                // console.log(allBooks)
                this.setState({ allBooks })
            })
    }


    handleShowAll = (event) => {
        event.preventDefault()
        this.props.history.push(`/bookshelves/${this.props.currentUser.user.bookshelf}`)
    }
    

    render() {
        return (
            <div className={'bookshelfBrowserWrapper'}>
                <div className={'contentArea'}>
                    <video autoPlay loop className={'video-background'} muted playsInline>
                        <source src={`https://res.cloudinary.com/ja9-look/video/upload/v1551958532/distant_lights.mp4`} type="video/mp4" />
                    </video>
                    <div className={'bookshelfTitleFilter'}>
                        <h4>My bookshelf</h4>
                        <div className="filterBookshelf">
                        <button className={'filterBookshelfButton'} onClick={this.handleFilterToggle} >Filter ▼</button>
                            <div className="dropdown-content hidden">
                                <p onClick={this.handleShowAll}>All</p>
                                <p onClick={this.handleReadFilter}>Read</p>
                                <p onClick={this.handleBoughtFilter}>Bought</p>
                                <p onClick={this.handleFavouritesFilter}>Favourites</p>
                            </div>
                        </div>
                    </div>
                    <div className={'booksBrowserWrapper'}>
                        {this.state.allBooks.map(book => {
                            if (book.title) { 
                                return (
                                    <Link to={book.industryIdentifiers ? `/book_browser/books/${book.industryIdentifiers[0].identifier}` : "/"} style={{ textDecoration: 'none', color: '#000000' }} >
                                        <div className={'bookshelfCardWrapper'} id={book.industryIdentifiers ? book.industryIdentifiers[0].identifier : ""}>
                                            <img className={'bookImage'} src={book.imageLinks ? book.imageLinks.thumbnail : "https://data.europa.eu/euodp/sites/all/themes/openDataPortalTheme/images/no-image-icon.png"} alt={book.title} />
                                            <h6 className={'bookTitle'}>{book.title ? (book.title.length > 20 ? book.title.substring(0, 20) + `...` : book.title) : "(No Title Available)"}</h6>
                                            <p className={'bookAuthor'}>{book.authors ? book.authors[0] : "(No Author Available)"}</p>
                                            <img alt="favourite" className={'addToFavourites'} onClick={this.handleAddToFavourites} src={(book.favourite) ? `https://res.cloudinary.com/ja9-look/image/upload/v1551958523/heart.png` : `https://res.cloudinary.com/ja9-look/image/upload/v1551958523/heart_blank.png`} />
                                            <div className={'bookshelfButtons'}>
                                                <button className={book.read ? "readButton focus" : "readButton"} onClick={this.handleReadClick}>Read</button>
                                                <button className={book.bought ? "boughtButton focus" : "boughtButton"} onClick={this.handleBoughtClick}>Bought</button>
                                                <button className={'removeButton'} onClick={this.handleRemoveClick}>Remove</button>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            }
                        }
                        )}
                    </div>
                </div>
            </div>
        )
    }

}

export default withRouter(Bookshelf);