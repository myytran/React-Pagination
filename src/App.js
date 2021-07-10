import { useState, useEffect } from 'react';
import './App.css';

const url = 'https://jsonplaceholder.typicode.com/posts';

function App() {
  const [posts, setPosts] = useState([]);
  const [error, setErrors] = useState('');

  useEffect(() => {
    fetch(url)
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error('Something went wronng during data fetch');
      })
      .then((data) => {
        setPosts(data);
      })
      .catch((error) => setErrors(error.message));
  }, []);

  if (error) {
    return <h1>{error}</h1>;
  }

  //Post function Component
  function Post(props) {
    const { id, title, body } = props.data;
    return (
      <div className='post'>
        <small>{id}</small>
        <h1>{title}</h1>
        <p>{body}</p>
      </div>
    );
  }

  //Pagination function Component
  function Pagination({ data, RenderComponent, title, pageLimit, dataLimit }) {
    const [pages] = useState(Math.round(data.length / dataLimit));
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
      window.scrollTo({ behavior: 'smooth', top: '0px' });
    }, [currentPage]);

    function goToNextPage() {
      //increment current page by 1
      setCurrentPage((page) => page + 1);
    }

    function goToPreviousPage() {
      //decrement current page by 1
      setCurrentPage((page) => page - 1);
    }

    function changePage(e) {
      //when clicked will change current page to to any page that was clicked
      const pageNumber = Number(e.target.textContent);
      setCurrentPage(pageNumber);
    }

    const getPaginatedData = () => {
      //return and display the number of posts equal to dataLimit (10posts)
      const startIndex = currentPage * dataLimit - dataLimit;
      const endIndex = startIndex + dataLimit;
      return data.slice(startIndex, endIndex);
    };

    const getPaginationGroup = () => {
      // shows group of page numbers in pagination
      let start = Math.floor((currentPage - 1) / pageLimit) * pageLimit;
      return new Array(pageLimit).fill().map((_, index) => start + index + 1);
    };

    return (
      <div>
        <h1>{title}</h1>
        {/* shows 10 posts at a time */}
        <div className='dataContainer'>
          {getPaginatedData().map((d, index) => (
            <RenderComponent key={index} data={d} />
          ))}
        </div>

        {/* shows pagination, 5 pgs at a time with next and previous buttons */}
        <div className='pagination'>
          {/* PREVIOUS BUTTON */}
          <button
            className={`prev ${currentPage === 1 ? 'disabled' : ''}`}
            onClick={goToPreviousPage}
          >
            Previous
          </button>

          {/* Show page numbers */}
          {getPaginationGroup().map((item, index) => (
            <button
              key={index}
              onClick={changePage}
              className={`paginationItem ${
                currentPage === item ? 'active' : null
              }`}
            >
              <span>{item}</span>
            </button>
          ))}
          {/* NEXT BUTTON */}
          <button
            onClick={goToNextPage}
            className={`next ${currentPage === pages ? 'disabled' : ''}`}
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='App'>
      <h1>Data here!</h1>
      {posts.length > 0 ? (
        <>
          <Pagination
            data={posts}
            RenderComponent={Post}
            title='Posts'
            pageLimit={5}
            dataLimit={10}
          />
        </>
      ) : (
        <h1>No Posts to display</h1>
      )}
    </div>
  );
}

export default App;
