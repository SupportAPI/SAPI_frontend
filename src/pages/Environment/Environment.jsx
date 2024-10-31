import { useState, useRef, useEffect } from "react";
import { FaTrashAlt, FaPlus, FaShareAlt, FaDownload, FaAngleDown, FaGripVertical, FaCheckSquare, FaSquare } from 'react-icons/fa';
import { createPortal } from "react-dom";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemType = "ROW";

const DraggableRow = ({ environment, index, moveRow, handleIsChecked, handleType, handleUpdate, handleAddRow, handleDeleteRow, lastId }) => {
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
            className={`relative group ${index !== lastId ? 'border-b border-black' : ''}`}
        >
            <td className="p-4 h-[58.83px] flex items-center justify-center space-x-2 border-r border-[#D9D9D9]">
                <FaPlus
                    className="text-lg invisible group-hover:visible hover:bg-gray-300 rounded" 
                    onClick={() => handleAddRow(environment.id)}
                />
                <FaGripVertical 
                    className="text-lg invisible group-hover:visible cursor-move hover:bg-gray-300 rounded" 
                />
                {environment.isChecked ? (
                    <FaCheckSquare className="text-lg" onClick={() => handleIsChecked(environment.id)} />
                ) : (
                    <FaSquare className="text-lg invisible group-hover:visible" onClick={() => handleIsChecked(environment.id)} />
                )}
            </td>

            <td 
                className={`p-4 bg-white transition-all duration-200 transform ${
                    clickedTd === "variable" ? "scale-105" : ""
                }`}
                style={
                    clickedTd === "variable"
                        ? {
                            boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.3)",
                            borderRadius: "8px",
                            border: "1px solid black",
                            backgroundColor: "white",
                            width: "calc(100% - 32px)",
                            overflow: "visible",
                        }
                        : { borderRight: "1px solid #D9D9D9" }
                }
                onClick={() => {
                    handleTdClick("variable");
                    handleEdit("variable");
                }}
            >
                {isEditing.variable ? (
                    <input
                        type="text"
                        value={environment.variable}
                        onChange={(e) => handleUpdate(environment.id, "variable", e.target.value)}
                        onBlur={() => handleBlur("variable")}
                        className="w-full py-1 bg-transparent focus:outline-none focus:border-none border-none"
                        autoFocus
                    />
                ) : (
                    <span>{environment.variable}</span>
                )}
            </td>

            <td
                className="p-4 border-r border-[#D9D9D9] flex items-center justify-center cursor-pointer relative"
                onClick={(event) => handleType(event, environment.id)}
            >
                {environment.isSecreted ? "Secret" : "Default"}
                <FaAngleDown className="text-2xl ml-2" />
            </td>
            
            <td 
                className={`p-4 border-r border-[#D9D9D9] bg-white transition-all duration-200 transform ${
                    clickedTd === "value" ? "scale-105" : ""
                }`}
                onClick={() => handleTdClick("value")}
            >
                {isEditing.value ? (
                    <input
                        type="text"
                        value={environment.value}
                        onChange={(e) => handleUpdate(environment.id, "value", e.target.value)}
                        onBlur={() => handleBlur("value")}
                        className="w-full py-1 bg-transparent focus:outline-none focus:border-none border-none"
                        autoFocus
                    />
                ) : (
                    <span>{environment.value}</span>
                )}
            </td>

            <td 
                className={`p-4 border-r border-[#D9D9D9] bg-white transition-all duration-200 transform ${
                    clickedTd === "description" ? "scale-105" : ""
                }`}
                onClick={() => handleTdClick("description")}
            >
                {isEditing.description ? (
                    <input
                        type="text"
                        value={environment.description}
                        onChange={(e) => handleUpdate(environment.id, "description", e.target.value)}
                        onBlur={() => handleBlur("description")}
                        className="w-full py-1 bg-transparent focus:outline-none focus:border-none border-none"
                        autoFocus
                    />
                ) : (
                    <span>{environment.description}</span>
                )}
            </td>
            <td className="p-4 h-[58.83px] flex items-center justify-center space-x-2 border-r border-[#D9D9D9]">
                <FaTrashAlt 
                    className="text-lg invisible group-hover:visible hover:bg-gray-300" 
                    onClick={() => handleDeleteRow(environment.id)} // 삭제 함수 호출
                />
            </td>
        </tr>
    );
};

const Environment = () => {
    const [activeTypeId, setActiveTypeId] = useState(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const [data, setData] = useState([
        { id: 1, variable: "Authorization", isSecreted: true, value: "werwrwer", description: "토큰값", isChecked: true },
        { id: 2, variable: "Authorization", isSecreted: false, value: "werwrwsdfsdfer", description: "토큰값", isChecked: false },
    ]);

    const handleDeleteRow = (id) => {
        setData((prevData) => {
            if (prevData.length === 1) {
                return [{
                    id: prevData[0].id, 
                    variable: "",
                    isSecreted: false,
                    value: "",
                    description: "",
                    isChecked: false,
                }];
            } else {
                return prevData.filter(item => item.id !== id);
            }
        });
    };

    const handleIsChecked = (id) => {
        setData(prevData =>
            prevData.map(item =>
                item.id === id ? { ...item, isChecked: !item.isChecked } : item
            )
        );
    };

    const handleUpdate = (id, field, value) => {
        setData(prevData =>
            prevData.map(item =>
                item.id === id ? { ...item, [field]: value } : item
            )
        );
    };

    const handleType = (event, id) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setDropdownPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
        setActiveTypeId(prevId => (prevId === id ? null : id));
    };

    const handleIsSecreted = (isSecret) => {
        setData(prevData =>
            prevData.map(item =>
                item.id === activeTypeId ? { ...item, isSecreted: isSecret } : item
            )
        );
    };

    const handleAddRow = (currentId) => {
        setData((prevData) => {
            const updatedData = prevData.map(item => 
                item.id > currentId ? { ...item, id: item.id + 1 } : item
            );

            return [
                ...updatedData,
                {
                    id: currentId + 1,
                    variable: "",
                    isSecreted: false,
                    value: "",
                    description: "",
                    isChecked: false,
                }
            ].sort((a, b) => a.id - b.id);
        });
    };

    const moveRow = (fromIndex, toIndex) => {
        setData((prevData) => {
            const updatedData = [...prevData];
            const [movedItem] = updatedData.splice(fromIndex, 1);
            updatedData.splice(toIndex, 0, movedItem);
            return updatedData.map((item, index) => ({ ...item, id: index + 1 }));
        });
    };

    const lastId = data.length > 0 ? data[data.length - 1].id : null;

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="p-8 overflow-y-scroll max-h-[680px]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Environment</h2>
                    <div className="flex space-x-4">
                        <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                            <FaPlus /><span>Add</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                            <FaTrashAlt /><span>Delete</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                            <FaDownload /><span>Export</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                            <FaShareAlt /><span>Share</span>
                        </button>
                    </div>
                </div>
                <hr className="border-t border-gray-300 mb-4" />

                <div className="border border-black shadow rounded overflow-visible">
                    <table className="min-w-full table-fixed overflow-visible">
                        <colgroup>
                            <col style={{ width: "2%" }} />
                            <col style={{ width: "13%" }} />
                            <col style={{ width: "3%" }} />
                            <col style={{ width: "20%" }} />
                            <col style={{ width: "25%" }} />
                            <col style={{ width: "4%" }} />
                        </colgroup>
                        <thead>
                            <tr className="bg-[#F9FEFF] border-b border-black">
                                <th className="p-4 border-r border-[#D9D9D9] text-left"></th>
                                <th className="p-4 border-r border-[#D9D9D9] text-left">Variable</th>
                                <th className="p-4 border-r border-[#D9D9D9]">Type</th>
                                <th className="p-4 border-r border-[#D9D9D9] text-left">Value</th>
                                <th className="p-4 border-r border-[#D9D9D9] text-left">Description</th>
                                <th className="p-4 text-left"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((environment, index) => (
                                <DraggableRow
                                    key={environment.id}
                                    environment={environment}
                                    index={index}
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

                {activeTypeId !== null && createPortal(
                    <DropdownMenu onClose={() => setActiveTypeId(null)} position={dropdownPosition} setIsSecreted={handleIsSecreted} />,
                    document.body
                )}
            </div>
        </DndProvider>
    );
};

export default Environment;