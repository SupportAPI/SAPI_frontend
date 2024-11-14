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
  useDeleteEnvironmentVariable,
} from '../../api/queries/useEnvironmentQueries';
import DraggableRow from './DraggableRow';
import DropdownMenu from './DropdownMeny';

const Environment = () => {
  const { environmentId } = useParams();
  const [checkedNum, setCheckedNum] = useState(0);
  const [activeTypeId, setActiveTypeId] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [addEnvironment, setAddEnvironment] = useState(null);
  const [data, setData] = useState([]);
  const addEnvironmentVariable = useAddEnvironmentVariable(environmentId);
  const editEnvironment = useEditEnvironment(environmentId);
  const deleteEnvironment = useDeleteEnvironmentVariable(environmentId);

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

  console.log('environem', environmentData);
  console.log('Data', data);

  const handleDeleteCheckedRows = async () => {
    const checkedItems = data.filter((item) => item.isChecked);
    const uncheckedItems = data.filter((item) => !item.isChecked);

    if (checkedItems.length === 0) return; // 체크된 항목이 없으면 함수 종료

    await Promise.all(
      checkedItems.slice(1).map((item) =>
        deleteEnvironment.mutateAsync({
          categoryId: environmentId,
          environmentId: item.id,
        })
      )
    );

    // 삭제 후 남은 항목이 없다면 기본값 항목을 추가
    if (uncheckedItems.length === 0) {
      const lastEnv = {
        id: checkedItems[0].id, // 첫 번째 체크된 항목의 ID 사용
        variable: '',
        type: 'DEFAULT',
        value: '',
        description: '',
        orderIndex: 0,
      };
      await editEnvironment.mutateAsync({
        categoryId: environmentId,
        environment: lastEnv,
      });
    }
  };

  const handleDeleteRow = (id) => {
    console.log(id);
    if (data?.length === 1) {
      const lastEnv = {
        id: id,
        variable: '',
        type: 'DEFAULT',
        value: '',
        description: '',
        orderIndex: 0,
      };
      editEnvironment.mutateAsync({
        categoryId: environmentId,
        environment: lastEnv,
      });
    } else {
      deleteEnvironment.mutateAsync({
        categoryId: environmentId,
        environmentId: id,
      });
    }
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

    // 객체 형태로 인자를 전달합니다
    setAddEnvironment(
      await addEnvironmentVariable.mutateAsync({
        categoryId: environmentId,
        orderIndex: currentIndex + 1,
      })
    );
  };

  const handleEditRow = async (environment) => {
    await editEnvironment.mutateAsync({
      categoryId: environmentId,
      environment: environment,
    });
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
      // fromIndex와 toIndex가 orderIndex 기준임을 고려하여 직접 조회
      const fromOrderIndex = prevData.find((item) => item.orderIndex === fromIndex)?.orderIndex;
      const toOrderIndex = prevData.find((item) => item.orderIndex === toIndex)?.orderIndex;

      // 유효성 검사
      if (fromOrderIndex === undefined || toOrderIndex === undefined) return prevData;
      if (toOrderIndex >= prevData.length || toOrderIndex < 0) return prevData;

      const updatedData = [...prevData];
      const movedItemIndex = updatedData.findIndex((item) => item.orderIndex === fromOrderIndex);
      const [movedItem] = updatedData.splice(movedItemIndex, 1);
      updatedData.splice(toOrderIndex, 0, movedItem);

      return updatedData.map((item) => {
        if (fromOrderIndex < toOrderIndex && item.orderIndex > fromOrderIndex && item.orderIndex <= toOrderIndex) {
          // 뒤로 이동하는 경우: 중간 항목은 -1
          return { ...item, orderIndex: item.orderIndex - 1 };
        } else if (
          fromOrderIndex > toOrderIndex &&
          item.orderIndex >= toOrderIndex &&
          item.orderIndex < fromOrderIndex
        ) {
          // 앞으로 이동하는 경우: 중간 항목은 +1
          return { ...item, orderIndex: item.orderIndex + 1 };
        } else if (item.id === movedItem.id) {
          // 이동한 항목은 목표 위치의 orderIndex 설정
          return { ...item, orderIndex: toOrderIndex };
        } else {
          return item;
        }
      });
    });
  };

  const updateEnvironmentOrder = async () => {
    data.forEach((item) => {
      editEnvironment.mutateAsync({
        categoryId: environmentId,
        environment: item,
      });
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
              {data
                .slice() // 원본 data를 변경하지 않도록 복사본 생성
                .sort((a, b) => a.orderIndex - b.orderIndex) // orderIndex 기준으로 정렬
                .map((environment, index) => (
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
                    handleEditRow={handleEditRow}
                    updateEnvironmentOrder={updateEnvironmentOrder}
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
