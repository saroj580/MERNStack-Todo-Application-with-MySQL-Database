import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Home() {
    const [tab, setTab] = useState(1)
    const [task, setTask] = useState('')
    const [todos, setTodos] = useState([])
    const [isEdit, setIsEdit] = useState(false)

    const handleTabs = (all) => {
        setTab(all)
        console.log(all)
    }

    // const handleAddTask = (e) => {
    //     e.preventDefault()
    //     console.log(task);
    //     // axios is used to make the request to the server
    //     axios.post('http://localhost:5000/new-task', 
    //     { task }) 
    //     // axios.post is used to make the post request to the server and the first parameter is the url of the server and the second parameter is the data i.e 'new-task' that we want to send to the server and the data is in the form of object
        
    // }
    
    const handleAddTask = async (e) => {
        e.preventDefault()
        if (!task.trim()) return;
            try {
                const response = await axios.post('http://localhost:5000/new-task', { task })
                console.log('Task added:', response.data)
                setTodos(response.data);
                setTask('');
            } catch (error) {
                if (error.code === 'ERR_CONNECTION_REFUSED') {
                    console.error('Server is not running. Please start your backend server')
                } else {
                    console.error('Error adding task:', error)
                }
            }
    }

    const [updateId, setUpdateId] = useState(null)
    const [updatedTask, setUpdatedTask] = useState('')
    const handleEdit = (id, task) => {
        setIsEdit(true);
        setTask(task);
        console.log(id);
        setUpdatedTask(task);
        setUpdateId(id);
    }

    const updateTask = () => {
        axios.post('http://localhost:5000/update-task', { updateId, task })
            .then(res => {
                setTodos(res.data);
                setTask('');
        })
    }

    const handleDelete = (id) => { 
        console.log(id);
        axios.post('http://localhost:5000/delete-task', { id })
            .then(res => { 
                setTodos(res.data);
            })
    }

    const handleComplete = (id) => { 
        console.log(id);
        axios.post('http://localhost:5000/complete-task', { id })
            .then(res => { 
                setTodos(res.data);
            })
        
    }

    useEffect(() => {
        axios.get('http://localhost:5000/read-task')
            .then((res) => {
                console.log(res);
                setTodos(res.data);
        })
    },[])


  return (
        <div className='bg-gray-100 w-screen h-screen'>
          <div className='flex flex-col items-center justify-center h-screen w-screen'>
              <h1 className='text-center'>Suggest More functionalities to add</h1>
              {/* input are goes here */}
                <div>
                    <h2 className='font-bold text-2xl mb-4'>ToDo List</h2>
                </div>
                <div className='flex items-center justify-center'>
                    <input value={task} onChange={(e) => setTask(e.target.value)} type="text" placeholder='Enter Todo' className='p-2 outline-none border border-blue-400 rounded-md w-64'/>
                    <button className='px-4 bg-blue-600 m-2 text-white p-2 border border-black rounded-r-md' >{isEdit ? <button onClick={updateTask}>Update</button> : <button onClick={handleAddTask}>Add</button>}</button>
                </div>
                
              {/* ALl the tabs are goes here */}
              <div className='flex w-80 text-sm justify-evenly mt-2'>
                  <button onClick={() => handleTabs(1)} className={`${tab === 1 ? 'text-blue-700' : 'text-black'} cursor-pointer`}>All</button>
                  <button onClick={() => handleTabs(2)} className={`${tab === 2 ? 'text-blue-700' : 'text-black'} cursor-pointer`}>Active</button>
                  <button onClick={() => handleTabs(3)} className={`${tab === 3 ? 'text-blue-700' : 'text-black'} cursor-pointer`}>Completed</button>
              </div>

                {/* All the todos are goes here */}
              {
                tab == 1 && todos?.map(todo => (
                  <div className='flex justify-between bg-white w-80 p-2 mt-4' key={todo.id}>
                    <div>
                        <p className='text-lg font-semibold'>{todo.task}</p>
                        <p className='text-xs text-gray-600'>{new Date(todo.createdAt).toLocaleString()}</p>
                        <p className='text-sm  text-gray-700'>Status:{todo.status}</p>
                    </div>
                    <div className='flex flex-col items-start text-sm'>
                        <button className='text-blue-600' onClick={()=> handleEdit(todo.id, todo.task)}>Edit</button>
                        <button className='text-red-600' onClick={() => handleDelete(todo.id)}>Delete</button>
                        <button className='text-green-600' onClick={() => handleComplete(todo.id)}>Completed</button>
                    </div>
                    </div>
                ))
              }

              {
                tab == 2 && todos?.filter(todo => todo.status === 'active').map(todo => (
                  <div className='flex justify-between bg-white w-80 p-2 mt-4' key={todo.id}>
                    <div>
                        <p className='text-lg font-semibold'>{todo.task}</p>
                        <p className='text-xs text-gray-600'>{new Date(todo.createdAt).toLocaleString()}</p>
                        <p className='text-sm  text-gray-700'>Status:{todo.status}</p>
                    </div>
                    <div className='flex flex-col items-start text-sm'>
                        <button className='text-blue-600' onClick={()=> handleEdit(todo.id, todo.task)}>Edit</button>
                        <button className='text-red-600' onClick={() => handleDelete(todo.id)}>Delete</button>
                        <button className='text-green-600' onClick={() => handleComplete(todo.id)}>Completed</button>
                    </div>
                    </div>
                ))
              }

              {
                tab == 3 && todos?.filter(todo => todo.status == 'completed').map(todo => (
                  <div className='flex justify-between bg-white w-80 p-2 mt-4' key={todo.id}>
                    <div>
                        <p className='text-lg font-semibold'>{todo.task}</p>
                        <p className='text-xs text-gray-600'>{new Date(todo.createdAt).toLocaleString()}</p>
                        <p className='text-sm  text-gray-700'>Status:{todo.status}</p>
                    </div>
                    <div className='flex flex-col items-start text-sm'>
                        <button className='text-blue-600' onClick={()=> handleEdit(todo.id, todo.task)}>Edit</button>
                        <button className='text-red-600' onClick={() => handleDelete(todo.id)}>Delete</button>
                        <button className='text-green-600' onClick={() => handleComplete(todo.id)}>Completed</button>
                    </div>
                    </div>
                ))
              }
            </div>
        </div>
    )
}
