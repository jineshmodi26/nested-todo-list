import React, { useState, useContext } from 'react';
import { Tree, Input, Button, message, Divider } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { MyContext } from "../App"

interface Todo {
  id: string;
  text: any;
  children?: Todo[];
}

const { TreeNode } = Tree;

const Dashboard: React.FC = () => {

  const contextData = useContext<any>(MyContext)
  const { user, setUser } = contextData;
  const [loading, setLoading] = useState(false)
  const [todos, setTodos] = useState<any>([]);
  const [selectedTodo, setSelectedTodo] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const navigate = useNavigate()

  const logout = () => {
    localStorage.clear()
    navigate("/login")
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const handleAddTodo = () => {
    if (inputText.trim() === '') {
      message.error('Please enter a todo item.');
      return;
    }
    if (!selectedTodo) {
      const newTodo: Todo = {
        id: uuidv4(),
        text: inputText,
      };

      setTodos([...todos, newTodo]);
    } else {
      const parentTodo = findTodoById(todos, selectedTodo);
      if (!parentTodo) return;

      const newSubTodo = {
        id: uuidv4(),
        text: inputText,
      };

      parentTodo.children = parentTodo.children ? [...parentTodo.children, newSubTodo] : [newSubTodo];
    }
    setInputText('');
  };

  const findTodoById = (todos: any, id: string): Todo | undefined => {
    for (let todo of todos) {
      if (todo.id === id) {
        return todo;
      }
      if (todo.children) {
        const foundSubTodo = findTodoById(todo.children, id);
        if (foundSubTodo) {
          return foundSubTodo;
        }
      }
    }
    return undefined;
  };

  const handleTreeSelect = (selectedKeys: React.Key[]) => {
    setSelectedTodo(selectedKeys[0] as string);
  };

  const renderTreeNodes = (data: Todo[]): React.ReactNode => {
    return data.map((todo) => {
      if (todo.children) {
        return (
          <TreeNode title={todo.text} key={todo.id}>
            {renderTreeNodes(todo.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={todo.text} key={todo.id} />;
    });
  };

  return <>
    <div>
      <div style={{ margin: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div><h5>Welcome <span style={{ color: "grey" }}>{user.username}</span></h5></div>
        <div><Button type='primary' onClick={logout}>Logout</Button></div>
      </div>
      <Divider />
      <h2>Nested Todo List</h2>
      <Input
        style={{ width: "20%" }}
        type="text"
        value={inputText}
        onChange={handleInputChange}
        placeholder="Add Todo"
      />
      <Button type='primary' onClick={handleAddTodo}>Add</Button>
      <h4>My Todos</h4>
      <h5>*Note : Add nested task by selecting task on click and add</h5>
      {
        todos.length === 0 ? "No Data" : <Tree style={{ margin: "2%" }} showIcon onSelect={handleTreeSelect} showLine>{renderTreeNodes(todos)}</Tree>
      }
    </div>
  </>
};

export default Dashboard;
