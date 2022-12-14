import React from "react"
import { useState } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import 'bootstrap/dist/js/bootstrap.js'

export function AddSection(){

    function addTask(){
        const requestOptions = {
            method: "GET",
            headers: {"Content-Type":"application/json"}
        }}

        fetch("http://127.0.0.1:8000/api/task/", requestOptions)
            .then(response => response.json())
            .then(data => console.log(data))
    return (
        <div className="d-flex flex-row justify-content-between bg-white align-items-center mx-4 rounded py-4 mb-4">
            <div className='ms-4'>
               <input className="form-control form-control-lg border-white ms-2" type="text" placeholder="Add new..."/>
           </div>
            <div className="d-flex align-items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" className="text-primary">
                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
              </svg>
              <button className='btn btn-primary ms-4 me-4' style={{"width":"6rem"}} onClick={() => console.log("add")} type="submit">aAdd</button>
            </div>
          </div>
    )
}