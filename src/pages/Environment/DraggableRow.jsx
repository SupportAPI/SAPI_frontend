import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { FaPlus, FaGripVertical, FaCheckSquare, FaSquare, FaAngleDown, FaTrashAlt } from 'react-icons/fa';

// ItemType을 선언해야 합니다. 필요에 따라 ItemType의 값을 설정하세요.
const ItemType = 'ROW';

const DraggableRow = ({
  environment,
  index,
  moveRow,
  handleIsChecked,
  handleType,
  handleUpdate,
  handleAddRow,
  handleDeleteRow,
  handleEditRow,
  updateEnvironmentOrder,
  lastId,
}) => {
  const [{ isDragging }, dragRef] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const [, dropRef] = useDrop({
    accept: ItemType,
    hover: (draggedItem) => {
      // toIndex가 데이터 배열 길이 범위 내에 있는지 확인
    },
    drop: (draggedItem) => {
      if (index >= 0 && index <= lastId && draggedItem.index !== index) {
        console.log(draggedItem.index, ' gg ', index);
        moveRow(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const opacity = isDragging ? 0 : 1;
  const [isEditing, setIsEditing] = useState({
    variable: false,
    value: false,
    description: false,
  });

  const [clickedTd, setClickedTd] = useState(null);

  const handleEdit = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (env, field) => {
    setIsEditing((prev) => ({ ...prev, [field]: false }));
    setClickedTd(null);
    handleEditRow(env);
  };

  const handleTdClick = (field) => {
    setClickedTd(field);
    handleEdit(field);
  };

  return (
    <tr
      ref={(node) => dragRef(dropRef(node))}
      style={{ opacity }}
      className={`text-[14px] relative group ${index !== lastId ? 'border-b border-gray-300' : ''}`}
    >
      <td className='p-3 h-[58px] flex items-center justify-center space-x-2 border-r border-[#D9D9D9] cursor-pointer hover:bg-gray-50'>
        <FaPlus
          className='text-lg invisible group-hover:visible hover:text-gray-800 hover:bg-gray-200 rounded'
          onClick={() => handleAddRow(environment.id)}
        />
        <FaGripVertical className='text-lg invisible group-hover:visible cursor-move hover:bg-gray-300 rounded' />
        {environment.isChecked ? (
          <FaCheckSquare className='text-lg' onClick={() => handleIsChecked(environment.id)} />
        ) : (
          <FaSquare className='text-lg invisible group-hover:visible' onClick={() => handleIsChecked(environment.id)} />
        )}
      </td>

      <td
        className={`p-3 h-[58px] bg-white transition-all duration-200 transform ${
          clickedTd === 'variable' ? 'scale-105' : ''
        }`}
        style={
          clickedTd === 'variable'
            ? {
                boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.3)',
                borderRadius: '8px',
                border: '1px solid black',
                backgroundColor: 'white',
                width: 'calc(100% - 32px)',
                overflow: 'visible',
              }
            : { borderRight: '1px solid #D9D9D9' }
        }
        onClick={() => {
          handleTdClick('variable');
          handleEdit('variable');
        }}
      >
        {isEditing.variable ? (
          <input
            type='text'
            value={environment.variable}
            onChange={(e) => handleUpdate(environment.id, 'variable', e.target.value)}
            onBlur={(e) => handleBlur(environment, 'variable')}
            className='w-full py-1 bg-transparent focus:outline-none focus:border-none border-none'
            autoFocus
          />
        ) : (
          <span>{environment.variable}</span>
        )}
      </td>

      {/* Secret/Default Cell */}
      <td
        className='p-3 h-[58px] border-r border-[#D9D9D9] flex items-center justify-center cursor-pointer'
        onClick={(event) => handleType(event, environment.id)}
        style={{ minWidth: '110px' }}
      >
        <span className='whitespace-nowrap overflow-hidden'>
          {environment.type === 'SECRET' ? 'Secret' : 'Default'}
        </span>
        <FaAngleDown className='text-2xl ml-2' />
      </td>

      <td
        className={`p-3 h-[58px] border-r border-[#D9D9D9] bg-white transition-all duration-200 transform ${
          clickedTd === 'value' ? 'scale-105' : ''
        }`}
        onClick={() => handleTdClick('value')}
      >
        {isEditing.value ? (
          <input
            type='text'
            value={environment.value}
            onChange={(e) => handleUpdate(environment.id, 'value', e.target.value)}
            onBlur={(e) => handleBlur(environment, 'value')}
            className='w-full py-1 bg-transparent focus:outline-none focus:border-none border-none'
            autoFocus
          />
        ) : (
          <span>{environment.value}</span>
        )}
      </td>

      <td
        className={`p-3 h-[58px] border-r border-[#D9D9D9] bg-white transition-all duration-200 transform ${
          clickedTd === 'description' ? 'scale-105' : ''
        }`}
        onClick={() => handleTdClick('description')}
      >
        {isEditing.description ? (
          <input
            type='text'
            value={environment.description}
            onChange={(e) => handleUpdate(environment.id, 'description', e.target.value)}
            onBlur={(e) => handleBlur(environment, 'description')}
            className='w-full py-1 bg-transparent focus:outline-none focus:border-none border-none'
            autoFocus
          />
        ) : (
          <span>{environment.description}</span>
        )}
      </td>

      <td className='p-3 h-[58px] flex items-center justify-center space-x-2 border-r border-[#D9D9D9]'>
        <FaTrashAlt
          className='text-lg invisible group-hover:visible hover:text-gray-800 hover:bg-gray-200'
          onClick={() => handleDeleteRow(environment.id)}
        />
      </td>
    </tr>
  );
};

export default DraggableRow;
