import { useState, useRef, useEffect } from 'react';
import { FaTrashAlt, FaPlus, FaAngleDown, FaGripVertical, FaCheckSquare, FaSquare, FaSave } from 'react-icons/fa';
import { createPortal } from 'react-dom';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useParams } from 'react-router-dom';
import {
  useEditEnvironment,
  useFetchEnvironment,
  useAddEnvironmentVariable,
} from '../../api/queries/useEnvironmentQueries';

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
      if (draggedItem.index !== index) {
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

  const handleBlur = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: false }));
    setClickedTd(null);
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
            onBlur={() => handleBlur('variable')}
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
            onBlur={() => handleBlur('value')}
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
            onBlur={() => handleBlur('description')}
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

const DropdownMenu = ({ onClose, position, setIsSecreted }) => {
  const menuRef = useRef(null);

  const sendIsSecreted = (isSecreted) => {
    setIsSecreted(isSecreted);
    onClose();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <ul
      ref={menuRef}
      className='absolute bg-white shadow-lg w-32 text-left z-50 border border-gray-200'
      style={{ top: position.top, left: position.left }}
    >
      <li className='p-2 hover:bg-gray-100 cursor-pointer text-center' onClick={() => sendIsSecreted('SECRET')}>
        Secret
      </li>
      <li className='p-2 hover:bg-gray-100 cursor-pointer text-center' onClick={() => sendIsSecreted('DEFAULT')}>
        Default
      </li>
    </ul>
  );
};

const Environment = () => {
  const { environmentId } = useParams();
  const [checkedNum, setCheckedNum] = useState(0);
  const [activeTypeId, setActiveTypeId] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [addEnvironment, setAddEnvironment] = useState(null);
  const [data, setData] = useState([]);
  const addEnvironmentVariable = useAddEnvironmentVariable(environmentId);
  const editEnvironment = useEditEnvironment(environmentId);

  const {
    data: environmentData = null,
    isLoading: isDataLoading = false,
    error: isDataError = null,
    refetch: envRefetch,
  } = environmentId ? useFetchEnvironment(environmentId) : {};

  useEffect(() => {
    if (Array.isArray(environmentData)) {
      const processData = environmentData.map((item) => ({
        ...item,
        isChecked: false,
      }));
      setData(processData);
    }
  }, [environmentData]);

  const handleDeleteCheckedRows = () => {
    setData((prevData) => {
      const updatedData = prevData.filter((item) => !item.isChecked);
      return updatedData?.length === 0
        ? [
            {
              id: 1, // 초기 ID 값 설정
              variable: '',
              type: 'DEFAULT',
              value: '',
              description: '',
              isChecked: false,
            },
          ]
        : updatedData;
    });
  };

  const handleDeleteRow = (id) => {
    setData((prevData) => {
      if (prevData?.length === 1) {
        return [
          {
            variable: '',
            type: 'DEFAULT',
            value: '',
            description: '',
            orderIndex: 0,
            isChecked: false,
          },
        ];
      } else {
        return prevData.filter((item) => item.id !== id);
      }
    });
  };

  const handleIsChecked = (id) => {
    setData((prevData) =>
      prevData.map((item) => {
        if (item.id === id) {
          const newCheckedStatus = !item.isChecked;
          setCheckedNum((prevCount) => prevCount + (newCheckedStatus ? 1 : -1));
          return { ...item, isChecked: newCheckedStatus };
        }
        return item;
      })
    );
  };

  const handleIsCheckedAll = (checked) => {
    if (checked) {
      setCheckedNum(0);
      setData((prevData) =>
        prevData.map((item) => {
          return { ...item, isChecked: false };
        })
      );
    } else {
      setCheckedNum(lastId);
      setData((prevData) =>
        prevData.map((item) => {
          return { ...item, isChecked: true };
        })
      );
    }
  };

  const handleUpdate = (id, field, value) => {
    setData((prevData) => prevData.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const handleType = (event, id) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setDropdownPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
    setActiveTypeId((prevId) => (prevId === id ? null : id));
  };

  const handleIsSecreted = (isSecret) => {
    setData((prevData) => prevData.map((item) => (item.id === activeTypeId ? { ...item, type: isSecret } : item)));
  };

  const handleAddRow = async (currentIndex) => {
    if (currentIndex === -1) {
      currentIndex = lastId;
    }

    // 데이터 업데이트 부분을 setData 바깥으로 분리합니다.
    const newRow = {
      variable: '',
      isSecreted: 'DEFAULT',
      value: '',
      description: '',
      orderIndex: currentIndex + 1,
      isChecked: false,
    };

    setData((prevData) => {
      const updatedData = prevData.map((item) =>
        item.orderIndex > currentIndex ? { ...item, orderIndex: item.orderIndex + 1 } : item
      );

      return [...updatedData, newRow].sort((a, b) => a.orderIndex - b.orderIndex);
    });

    // 비동기 함수를 별도로 호출해 환경 변수를 추가합니다.
    setAddEnvironment(
      await addEnvironmentVariable.mutateAsync({
        environmentId,
        orderIndex: currentIndex + 1,
      })
    );
  };

  useEffect(() => {
    if (addEnvironment) {
      setData((prevData) => {
        const newData = prevData.filter((item) => item.orderIndex !== addEnvironment.orderIndex);
        return [...newData, addEnvironment].sort((a, b) => a.orderIndex - b.orderIndex);
      });
    }
  }, [addEnvironment]);

  const moveRow = (fromIndex, toIndex) => {
    setData((prevData) => {
      const updatedData = [...prevData];
      const [movedItem] = updatedData.splice(fromIndex, 1);
      updatedData.splice(toIndex, 0, movedItem);

      const reorderedData = updatedData.map((item, index) => ({
        ...item,
        orderIndex: index + 1,
      }));

      reorderedData.forEach((item) => {
        editEnvironment.mutateAsync({
          environmentId,
          environment: item,
        });
      });

      return reorderedData;
    });
  };

  const lastId = data.length > 0 ? data[data.length - 1].id : 1;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className='p-8 overflow-y-scroll max-h-[680px]'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-bold'>Environment - {}</h2>
          <div className='flex space-x-4'>
            <button
              className='flex items-center h-8 text-[14px] space-x-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 px-2 rounded-md'
              onClick={() => handleAddRow(-1)}
            >
              <FaPlus />
              <span>Add</span>
            </button>
            <button
              className='flex items-center h-8 text-[14px] space-x-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 px-2 rounded-md'
              onClick={handleDeleteCheckedRows}
            >
              <FaTrashAlt />
              <span>Delete</span>
            </button>
          </div>
        </div>
        <hr className='border-t border-gray-300 mb-4' />

        <div className='border border-gray-300 shadow rounded-lg overflow-hidden'>
          <table className='min-w-full table-fixed overflow-visible'>
            <colgroup>
              <col style={{ width: '2%' }} />
              <col style={{ width: '13%' }} />
              <col style={{ width: '3%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '25%' }} />
              <col style={{ width: '4%' }} />
            </colgroup>
            <thead>
              <tr className='bg-gray-100 border-b border-gray-300'>
                <th className='p-3 h-[58px] flex items-center justify-center space-x-2 border-r border-[#D9D9D9] group'>
                  <FaPlus className='text-lg invisible rounded' />
                  <FaGripVertical className='text-lg invisible' />
                  {checkedNum === lastId ? (
                    <FaCheckSquare
                      className='text-lg invisible group-hover:visible'
                      onClick={() => handleIsCheckedAll(true)}
                    />
                  ) : (
                    <FaSquare
                      className='text-lg invisible group-hover:visible'
                      onClick={() => handleIsCheckedAll(false)}
                    />
                  )}
                </th>
                <th className='p-3 font-medium border-r border-[#D9D9D9] text-left'>Variable</th>
                <th className='p-3 font-medium border-r border-[#D9D9D9]'>Type</th>
                <th className='p-3 font-medium border-r border-[#D9D9D9] text-left'>Value</th>
                <th className='p-3 font-medium border-r border-[#D9D9D9] text-left'>Description</th>
                <th className='p-3 text-left'></th>
              </tr>
            </thead>
            <tbody>
              {data.map((environment, index) => (
                <DraggableRow
                  key={environment.orderIndex}
                  environment={environment}
                  index={environment.orderIndex}
                  moveRow={moveRow}
                  handleIsChecked={handleIsChecked}
                  handleType={handleType}
                  handleUpdate={handleUpdate}
                  handleAddRow={handleAddRow}
                  handleDeleteRow={handleDeleteRow} // 삭제 함수 전달
                  lastId={lastId - 1}
                />
              ))}
            </tbody>
          </table>
        </div>

        {activeTypeId !== null &&
          createPortal(
            <DropdownMenu
              onClose={() => setActiveTypeId(null)}
              position={dropdownPosition}
              setIsSecreted={handleIsSecreted}
            />,
            document.body
          )}
      </div>
    </DndProvider>
  );
};

export default Environment;
