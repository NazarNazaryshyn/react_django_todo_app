import React from "react"


export function MiddleSection(){
    return (
        <div className='d-flex align-items-center flex-row-reverse mx-4 mt-4 mb-5'>
            <div className='d-flex flex-row align-items-center'>
              <label className='ms-5 me-3 text-muted'>
                Filter
              </label>
              <div className="dropdown show">
                <a className="btn btn-light border-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  All
                </a>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                  <a className="dropdown-item" href="#">All</a>
                  <a className="dropdown-item" href="#">Completed</a>
                  <a className="dropdown-item" href="#">Active</a>
                  <a className="dropdown-item" href="#">Has due date</a>
                </div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-sort-up ms-2" viewBox="0 0 16 16">
                  <path d="M3.5 12.5a.5.5 0 0 1-1 0V3.707L1.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.498.498 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L3.5 3.707V12.5zm3.5-9a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z"/>
              </svg>
            </div>

            <div className='d-flex flex-row align-items-center'>
              <label className="me-3 text-muted">
                Sort
              </label>
              <div className="dropdown show">
                  <a className="btn btn-light border-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Added date
                  </a>
                  <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                    <a className="dropdown-item" href="#">Added date</a>
                    <a className="dropdown-item" href="#">Due date</a>
                  </div>
              </div>
            </div>
          </div>
    )
}