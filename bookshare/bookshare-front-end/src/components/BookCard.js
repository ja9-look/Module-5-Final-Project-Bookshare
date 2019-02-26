import React, {Component} from 'react';
import { Link } from 'react-router-dom';

class BookCard extends Component {

    render() {

        const book = this.props.book.volumeInfo
        console.log(book)

        return(
            <Link to={`/books/${book.title}`} style={{ textDecoration: 'none', color: '#000000' }}>
                <div className={'bookCardWrapper'} onClick={this.handleBookClick}>
                    <img className={'bookImage'} src={book.imageLinks ? book.imageLinks.thumbnail : "https://data.europa.eu/euodp/sites/all/themes/openDataPortalTheme/images/no-image-icon.png"} alt={book.title}/>
                    <h6 className={'bookTitle'}>{book.title ? (book.title.length > 20 ? book.title.substring(0, 20) + `...` : book.title) : "(No Title Available)"}</h6>
                    <p className={'bookPublishDate'}>{book.publishedDate ? book.publishedDate : "(No Published Date Available)"}</p>
                    <p className={'bookDescription'}>{book.description ? (book.description.length > 150 ? book.description.substring(0, 150)+`...` : book.description) : "(No description available)"}</p>
                </div>
            </Link>
        )
    }
}

export default BookCard;