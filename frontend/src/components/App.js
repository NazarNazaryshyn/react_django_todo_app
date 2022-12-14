import React from "react";
import { render } from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css"
import 'bootstrap/dist/js/bootstrap.js'

import { useState, useRef } from "react"


export function App(){

    const [title, setTitle] = useState("");
    const [items, setItems] = useState([]);
    const [filter, setFilter] = useState("All");
    const [token, setToken] = useState("")
    const [newTitle, setNewTitle] = useState("")

    const dateRef = useRef()
    const usernameLoginRef = useRef()
    const passwordLoginRef = useRef()
    const usernameRegisterRef = useRef()
    const passwordRegisterRef = useRef()
    const password2RegisterRef = useRef()

    function loadUserTasks(){
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+localStorage.getItem("token")
            }
        }
        fetch(`http://127.0.0.1:8000/api/user_tasks/?id=${localStorage.getItem("currentUserId")}`, requestOptions)
            .then(response => response.json())
            .then(data => setItems(data))
    }

    function register(){
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                username: usernameRegisterRef.current.value,
                password: passwordRegisterRef.current.value,
                password2: password2RegisterRef.current.value
            })
        }
        fetch("http://127.0.0.1:8000/api/register/", requestOptions)
    }

    function login(){
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                username: usernameLoginRef.current.value,
                password: passwordLoginRef.current.value
            })
        }
        fetch("http://127.0.0.1:8000/api/custom_token/obtain/", requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data["detail"]){
                    setToken("")
                }else {
                    setToken(data["access"])
                    localStorage.setItem("currentUserId", data["id"])
                    localStorage.setItem("token", data["access"])
                    loadUserTasks()
                }
            })
    }

    function addTask(){
        const deadline = dateRef.current.value
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+token
            },
            body: JSON.stringify({
                title: title,
                deadline: deadline,
                owner: localStorage.getItem("currentUserId")
            })
        }
        fetch("http://127.0.0.1:8000/api/task/", requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data["detail"]){
                    throw new Error(data["detail"])
                }
                const newTasks = [data, ...items]
                setItems(newTasks)
            })
    }

    function deleteTask(id){
        const requestOptions = {
            method: "DELETE",
            headers: {
                'Content-Type':"application/json",
                "Authorization": "Bearer "+token
            }
        }
        setItems(items.filter(item => item.id !== id))
        fetch(`http://127.0.0.1:8000/api/task/${id}/`, requestOptions)
            .then(response => {
                let newTasks = [...items].filter(item => item.pk !== id)
                setItems(newTasks)
            })
    }

    function filterCompleted(){
        setFilter("Completed")
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+localStorage.getItem("token")
            }
        }
        fetch(`http://127.0.0.1:8000/api/get_completed/?id=${localStorage.getItem("currentUserId")}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setItems(data)
            })
    }

    function filterMissedDeadline(){
        setFilter("Missed deadline")
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+localStorage.getItem("token")
            }
        }
        fetch(`http://127.0.0.1:8000/api/missed_deadline/?id=${localStorage.getItem("currentUserId")}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(items)
                setItems(data)
                console.log(items)
                console.log(data)
            })
    }

    function filterAll(){
        setFilter("All")
        loadUserTasks()
    }

    function changeIsDone(id){
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "Application/json",
                "Authorization": "Bearer "+token
            }
        }
        const boolean = (items.find(item => item.pk === id))["is_done"]

        items.find(item => {
            if (item.pk === id){
                item.is_done = !boolean
            }
            setItems([...items])
            if (filter === "Completed"){
                let newTasks = [...items].filter(item => item.pk !== id)
                setItems(newTasks)
            }
        })

        fetch(`http://127.0.0.1:8000/api/change_is_done/?id=${id}&checked=${boolean}`, requestOptions)
    }

    function changeTitle(id){
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "Application/json",
                "Authorization": "Bearer "+token
            }
        }
        fetch(`http://127.0.0.1:8000/api/change_title/?task_id=${id}&new_title=${newTitle}`, requestOptions)
        items.find(item => {
            if (item.pk === id){
                item.title = newTitle
            }
            setItems([...items])
        })
    }

    function getCurrentDate(){
        let today = new Date()
        let dd = today.getDate() + 1
        let mm = today.getMonth() + 1
        let yyyy = today.getFullYear()

        if (Number(dd) < 10){
            return `${yyyy}-${mm}-0${dd}`
        }
        return `${yyyy}-${mm}-${dd}`
    }

    function checkForDate(currentDate, deadlineDate){
        if (Number(currentDate.substring(0,4)) > Number(deadlineDate.substring(0,4))){
            return true
        } else if (Number(currentDate.substring(5,7)) > Number(deadlineDate.substring(5,7))){
            return true
        } else if(Number(currentDate.substring(8,10)) > Number(deadlineDate.substring(8,10))){
            return true
        }
        return false
    }

    return (
        <>
            <div className="container shadow- mb-4 mt-4 bg-light rounded">
            <div className="row justify-content-end p-3">
                <div className="col-4 d-flex justify-content-center">
                    <div className="d-flex flex-row align-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-check-square-fill text-primary me-4" viewBox="0 0 16 16">
                        <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/>
                    </svg>
                    <h1 className="text-primary"><u>My Todo-s</u></h1>
                </div>
                </div>
                <div className="col-4 d-flex justify-content-end align-items-center">
                    {(token.length < 2)? (
                        <div className="d-flex flex-row align-items-center me-2">
                            <div className="me-3">
                                <div className="modal fade" id="modalLoginForm" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                                    <div className="d-flex justify-content-center">
                                        <div className="modal-dialog px-3" role="document">
                                        <div className="modal-content">
                                            <div className="modal-header text-center">
                                                <h4 className="modal-title w-100 font-weight-bold">Sign in</h4>
                                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div className="modal-body mx-3">
                                                <div className="md-form mb-4 d-flex justify-content-start mt-3">
                                                    <div className="me-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                                                            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/>
                                                        </svg>
                                                    </div>
                                                    <div className="d-flex flex-column">
                                                        <input type="email" id="defaultForm-email" ref={usernameLoginRef} className="form-control validate" />
                                                        <label data-error="wrong" data-success="right" htmlFor="defaultForm-email">Your username</label>
                                                    </div>
                                                </div>
                                                <div className="md-form mb-3 d-flex">
                                                    <div className="me-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-lock" viewBox="0 0 16 16">
                                                            <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/>
                                                        </svg>
                                                    </div>
                                                    <div className="d-flex flex-column">
                                                        <input type="password" id="loginPassword" ref={passwordLoginRef} className="form-control validate"/>
                                                        <label data-error="wrong" data-success="right" htmlFor="loginPassword">Your password</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="modal-footer d-flex justify-content-center">
                                                <button className="btn btn-primary"  onClick={login} data-dismiss="modal" aria-label="Close">Login</button>
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <button className="btn btn-primary" data-toggle="modal" data-target="#modalLoginForm">Login</button>
                                </div>
                            </div>
                            <div>
                                <div className="modal fade" id="modalRegisterForm" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                                    <div className="d-flex justify-content-center">
                                        <div className="modal-dialog" role="document">
                                        <div className="modal-content">
                                            <div className="modal-header text-center">
                                                <h4 className="modal-title w-100 font-weight-bold">Sign in</h4>
                                                <button type="button" className="close" data-dismiss="modal"
                                                        aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div className="modal-body mx-3">
                                                <div className="md-form mb-4 d-flex justify-content-start mt-3">
                                                    <div className="me-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                                                            <path
                                                                d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/>
                                                        </svg>
                                                    </div>
                                                    <div className="d-flex flex-column">
                                                        <input type="email" id="defaultForm-email" className="form-control validate" ref={usernameRegisterRef}/>
                                                        <label data-error="wrong" data-success="right" htmlFor="defaultForm-email">Username</label>
                                                    </div>
                                                </div>
                                                <div className="md-form mb-4 d-flex">
                                                    <div className="me-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-lock" viewBox="0 0 16 16">
                                                            <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/>
                                                        </svg>
                                                    </div>
                                                    <div className="d-flex flex-column">
                                                        <input type="password" id="registerPassword" className="form-control validate" ref={passwordRegisterRef}/>
                                                        <label data-error="wrong" data-success="right" htmlFor="registerPassword">Password</label>
                                                    </div>
                                                </div>
                                                <div className="md-form mb-3 d-flex">
                                                    <div className="me-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-lock" viewBox="0 0 16 16">
                                                            <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/>
                                                        </svg>
                                                    </div>
                                                    <div className="d-flex flex-column">
                                                        <input type="password" id="registerPassword2" className="form-control validate" ref={password2RegisterRef}/>
                                                        <label data-error="wrong" data-success="right" htmlFor="registerPassword2">Password2</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="modal-footer d-flex justify-content-center">
                                                <button className="btn btn-primary" onClick={register} data-dismiss="modal" aria-label="Close">Register</button>
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <button className="btn btn-primary" data-toggle="modal" data-target="#modalRegisterForm">Register</button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <button className="btn btn-danger me-2 " style={{"height":"2.5rem"}} onClick={() => {
                            setToken("")
                        }} >Logout</button>
                    )}
                </div>

            </div>
            <div className="d-flex flex-row justify-content-between bg-white align-items-center mx-4 rounded py-4 mb-4">
            <div className='ms-4'>
               <input className="form-control form-control-lg border-white ms-2" type="text" placeholder="Add new..." onChange={(e) => setTitle(e.target.value)}/>
           </div>
            <div className="d-flex align-items-center flex-row justify-content-end">

                <label htmlFor="date" className="col-sm-1 col-form-label text-muted">Date</label>
                    <div className="col-sm-4">
                        <div className="input-group date" id="datepicker">
                            <input type="text" className="form-control" ref={dateRef}/>
                        <span className="input-group-append">
                            <span className="input-group-text bg-white">
                                <a className="fa fa-calendar"></a>
                            </span>
                        </span>
                        </div>
                    </div>
                {(!(token.length < 2)?
                    <button className='btn btn-primary ms-4 me-4' style={{"width":"6rem"}} onClick={addTask}>Add</button>
                    :
                    <button className='btn btn-primary ms-4 me-4 disabled' style={{"width":"6rem"}} onClick={addTask}>Add</button>
                    )}

            </div>
          </div>
            <hr className='mx-4 bg-secondary'></hr>
            <div className='container pb-4'>
                { (token.length < 2)? (
                    <div className="d-flex align-items-center justify-content-center">
                        <h1 className="text-muted ">You have to login/register</h1>
                    </div>
                ) : (
                    <div>
                        <div className='d-flex align-items-center flex-row-reverse mx-4 mt-4 mb-5'>
                        <div className='d-flex flex-row align-items-center'>
                      <label className='ms-5 me-3 text-muted'>
                        Filter
                      </label>
                      <div className="dropdown show">
                        <a className="btn btn-light border-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {filter}
                        </a>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                          <a className="dropdown-item" href="#" onClick={filterAll}>All</a>
                          <a className="dropdown-item" href="#" onClick={filterCompleted}>Completed</a>
                          <a className="dropdown-item" href="#" onClick={filterMissedDeadline}>Missed deadline</a>
                        </div>
                      </div>
                    </div>
                    </div>
                        {
                            items.map((item) => {
                                return (
                                    <div className="d-flex justify-content-between mx-2  mb-2" key={item.pk}>
                                        <div className="form-check d-flex align-items-center">
                                                <input className="form-check-input me-4" type="checkbox" onClick={() => changeIsDone(item.pk)} checked={item.is_done} value="" id={"flexCheckDefault" + item.pk}/>
                                                <label className="form-check-label " htmlFor={"flexCheckDefault" + item.pk}>
                                                  {item.title}
                                                </label>
                                            </div>

                                        <div className="d-flex ">
                                            {(checkForDate(getCurrentDate(), item.deadline))? (
                                                <div className="me-5 bg-white border border-warning rounded px-2 d-flex justify-content-center align-items-center">
                                                <div className="me-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-hourglass-split text-warning" viewBox="0 0 16 16">
                                                        <path d="M2.5 15a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1h-11zm2-13v1c0 .537.12 1.045.337 1.5h6.326c.216-.455.337-.963.337-1.5V2h-7zm3 6.35c0 .701-.478 1.236-1.011 1.492A3.5 3.5 0 0 0 4.5 13s.866-1.299 3-1.48V8.35zm1 0v3.17c2.134.181 3 1.48 3 1.48a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351z"/>
                                                    </svg>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    {item.deadline}
                                                </div>
                                            </div>
                                            ): undefined}
                                            <div>
                                                <div className='d-flex flex-row justify-content-between mb-2'>

                                                    <button type="button" className="btn btn-light" data-toggle="modal" data-target={"#exampleModalCenter" + item.pk}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-pencil-fill text-primary" viewBox="0 0 16 16">
                                                            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                                                        </svg>
                                                    </button>
                                                    <div className="modal fade" id={"exampleModalCenter" + item.pk} tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                                                        <div className="modal-dialog modal-dialog-centered" role="document">
                                                            <div className="modal-content">
                                                                <div className="modal-header">
                                                                    <h5 className="modal-title" id="exampleModalLongTitle">Modal title</h5>
                                                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                                        <span aria-hidden="true">&times;</span>
                                                                    </button>
                                                                </div>
                                                                    <div className="modal-body">
                                                                        <input className="form-control form-control-lg border-white" type="text" placeholder="Change title..." onChange={(e) => setNewTitle(e.target.value)}/>
                                                                    </div>
                                                                <div className="modal-footer">
                                                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close
                                                                    </button>
                                                                    <button type="button" className="btn btn-primary" onClick={() => changeTitle(item.pk)}>Save changes
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button className="btn btn-light" onClick={() => deleteTask(item.pk)} type="button">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-trash-fill text-danger" viewBox="0 0 16 16">
                                                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                                                        </svg>
                                                    </button>
                                                </div>
                                                <div className='d-flex flex-row align-items-center'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" className="bi bi-info-circle-fill text-secondary me-1" viewBox="0 0 16 16">
                                                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                                                </svg>
                                                <div className='text-muted'>{item.created_at}</div>
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                )}
          </div>
        </div>
        </>
  )
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);